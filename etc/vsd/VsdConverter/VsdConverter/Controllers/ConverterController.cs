using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Ionic.Zip;
using System.Collections.Generic;
using System.IO;
using System.Net.Sockets;
using System.Net.Http.Headers;
using System.Web.Http.Cors;

namespace VsdConverter.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class ConverterController : ApiController
    {
        static String Connect(String message)
        {
            try
            {
                Int32 port = 12355;
                TcpClient client = new TcpClient("127.0.0.1", port);

                // Translate the passed message into ASCII and store it as a Byte array.
                Byte[] data = System.Text.Encoding.ASCII.GetBytes(message);

                NetworkStream stream = client.GetStream();

                // Send the message to the connected TcpServer. 
                stream.Write(data, 0, data.Length);

                // Receive the TcpServer.response.

                // Buffer to store the response bytes.
                data = new Byte[256];

                // String to store the response ASCII representation.
                String responseData = String.Empty;

                // Read the first batch of the TcpServer response bytes.
                //This will block until the server finishes its work
                Int32 bytes = stream.Read(data, 0, data.Length);
                responseData = System.Text.Encoding.ASCII.GetString(data, 0, bytes);

                // Close everything.
                stream.Close();
                client.Close();
                return responseData;
            }
            catch (ArgumentNullException e)
            {
                Console.WriteLine("ArgumentNullException: {0}", e);
            }
            catch (SocketException e)
            {
                Console.WriteLine("SocketException: {0}", e);
            }
            return "Error";
        }

        public async Task<HttpResponseMessage> PostFile()
        {
            // Check if the request contains multipart/form-data.
            if (!Request.Content.IsMimeMultipartContent())
            {
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);
            }

            //TODO is this secure or it only returns the header?
            String origin = Request.GetCorsRequestContext().Origin;

            if (!origin.EndsWith("draw.io") && !origin.EndsWith("jgraph.com"))
            {
                throw new HttpResponseException(HttpStatusCode.Forbidden);
            }

            string root = HttpContext.Current.Server.MapPath("~/App_Data");
            var provider = new MultipartFormDataStreamProvider(root);

            List<string> files = new List<string>();
            List<string> convertedFiles = new List<string>();
            List<string> actualNames = new List<string>();

            try
            {
                // Read the form data and return an async task.
                await Request.Content.ReadAsMultipartAsync(provider);
                String srcExt = "", dstExt = "";

                //We assume one type for all files, otherwise, conversion will fail
                foreach (var file in provider.FileData)
                {
                    string actualFileName = file.Headers.ContentDisposition.FileName;
                    if (actualFileName.EndsWith(".vsd\""))
                    {
                        convertedFiles.Add(file.LocalFileName);
                        actualNames.Add(actualFileName);

                        System.IO.File.Move(file.LocalFileName, file.LocalFileName + ".vsd");
                        srcExt = ".vsd";
                        dstExt = ".vsdx";
                    }
                    else if (actualFileName.EndsWith(".vss\""))
                    {
                        convertedFiles.Add(file.LocalFileName);
                        actualNames.Add(actualFileName);

                        System.IO.File.Move(file.LocalFileName, file.LocalFileName + ".vss");
                        srcExt = ".vss";
                        dstExt = ".vssx";
                    }
                    else
                    {
                        files.Add(file.LocalFileName);
                    }
                }

                StringBuilder allFiles = new StringBuilder();
                allFiles.Append(srcExt);
                allFiles.Append("\n");
                allFiles.Append(dstExt);

                for (int i = 0; i < convertedFiles.Count; i++)
                {
                    allFiles.Append("\n");
                    allFiles.Append(convertedFiles[i]);
                }

                //Ask the TCP Converter Server to do the job
                //This will block until the server finishes the conversion
                String resp = Connect(allFiles.ToString());

                if ("Error".Equals(resp))
                {
                    throw new Exception("Coversion Failed");
                }

                if (convertedFiles.Count == 1)
                {
                    var pushStreamContent = new PushStreamContent((stream, content, context) =>
                    {
                        FileStream fs = new FileStream(convertedFiles[0] + dstExt, FileMode.Open);
                        fs.CopyTo(stream);
                        fs.Close();
                        stream.Close(); // After save we close the stream to signal that we are done writing.

                        System.IO.File.Delete(convertedFiles[0] + srcExt);
                        System.IO.File.Delete(convertedFiles[0] + dstExt);
                    }, "application/x-visio");

                    HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK) { Content = pushStreamContent };
                    response.Content.Headers.ContentDisposition = new ContentDispositionHeaderValue("attachment")
                    {
                        FileName = Path.GetFileNameWithoutExtension(actualNames[0].Replace('"', ' ')) + dstExt
                    };
                    response.Content.Headers.Add("Access-Control-Allow-Origin", "*");
                    return response;
                }
                else
                {
                    using (var zipFile = new ZipFile())
                    {
                        for (int i = 0; i < convertedFiles.Count; i++)
                        {
                            var name = Path.GetFileNameWithoutExtension(actualNames[i].Replace('"', ' '));
                            var file = convertedFiles[i];
                            var e = zipFile.AddFile(file + dstExt);
                            e.FileName = name + dstExt;
                        }

                        var pushStreamContent = new PushStreamContent((stream, content, context) =>
                        {
                            zipFile.Save(stream);
                            stream.Close(); // After save we close the stream to signal that we are done writing.

                            foreach (string file in convertedFiles)
                            {
                                System.IO.File.Delete(file + srcExt);
                                System.IO.File.Delete(file + dstExt);
                            }
                        }, "application/zip");

                        HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK) { Content = pushStreamContent };
                        response.Content.Headers.Add("Access-Control-Allow-Origin", "*");
                        return response;
                    }
                }
            }
            catch (System.Exception e)
            {
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, e);
            }
            finally
            {
                //clean all non-vsd files
                foreach (string file in files)
                {
                    System.IO.File.Delete(file);
                }
            }
        }

    }
}
