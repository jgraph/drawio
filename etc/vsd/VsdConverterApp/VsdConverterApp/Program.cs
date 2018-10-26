using System;
using System.Text;
using System.Threading.Tasks;
using System.Net;
using System.Net.Sockets;
using System.Collections.Generic;
using System.Diagnostics;
using System.Timers;
using System.IO;

namespace VsdConverterApp
{
    class Program
    {
        //IIS timeout is 2 minutes so if the processing is taking more than one minute, kill it
        static int MAX_VISIO_PROCESSING_TIME = 2 * 60;
        //Dangling files are not as harmful as processes, so let them live for 10 minutes
        static int MAX_FILE_AGE = 10 * 60; 
        //TODO this should be in a config or passed from the ASP.net server
        static string FILES_PATH = @"C:\VsdConverter\App_Data";

        private static void CleanupTimerHandler(object source, ElapsedEventArgs e)
        {
            //Hanging visio instances cleanup
            foreach (Process p in Process.GetProcesses())
            {
                try
                {
                    if (p.ProcessName.ToLower().IndexOf("visio") >= 0)
                    {
                        if ((DateTime.Now - p.StartTime).TotalSeconds > MAX_VISIO_PROCESSING_TIME)
                        {
                            try
                            {
                                p.Kill();
                            }
                            catch(Exception ex)
                            {   
                                //In case we don't have permissions to kill the process, proceed with remaining processes
                                Console.WriteLine(ex.Message);
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex.Message);
                }
            }

            //Handling undeleted files
            try
            {
                string[] fileEntries = Directory.GetFiles(FILES_PATH);
                foreach (string fileName in fileEntries)
                {
                    if ((DateTime.Now - File.GetCreationTime(fileName)).TotalSeconds > MAX_FILE_AGE)
                    {
                        try
                        {
                            File.Delete(fileName);
                        }
                        catch (Exception ex)
                        {   
                            //Usually file is being used, but above killing of visio should prevent that
                            Console.WriteLine(ex.Message);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }

        }

        static void Main(string[] args)
        {
            TcpListener server = null;
            try
            {
                Timer cleanupTimer = new Timer();
                cleanupTimer.Elapsed += new ElapsedEventHandler(CleanupTimerHandler);
                // Set the Interval to 1 min.
                cleanupTimer.Interval = 60000;
                cleanupTimer.Enabled = true;

                // Set the TcpListener on port 13000.
                Int32 port = 12355;
                IPAddress localAddr = IPAddress.Parse("127.0.0.1");

                // TcpListener server = new TcpListener(port);
                server = new TcpListener(localAddr, port);

                // Start listening for client requests.
                server.Start();

                int clientsCounter = 1;               
                // Enter the listening loop.
                while (true)
                {
                    Console.WriteLine("Waiting for a connection... ");

                    // Perform a blocking call to accept requests.
                    // You could also user server.AcceptSocket() here.
                    TcpClient client = server.AcceptTcpClient();
                    int clientNum = clientsCounter;
                    Console.WriteLine("New Client {0} Connected at {1}!", clientNum, DateTime.Now);

                    //Process this client asynch
                    Task.Run(() => ProcessRequest(client, clientNum));

                    clientsCounter++;
                }
            
            }
            catch (SocketException e)
            {
                Console.WriteLine("SocketException: {0}", e);
            }
            catch (Exception any)
            {
                Console.WriteLine("Exception: {0}", any);
            }
            finally
            {
                // Stop listening for new clients.
                server.Stop();
            }


            Console.WriteLine("\nHit enter to continue...");
            Console.Read();
        }

        private static void ProcessRequest(TcpClient client, int clientNum)
        {
            Microsoft.Office.Interop.Visio.InvisibleApp VisioInst = null;
            try
            {
                // Buffer for reading data
                Byte[] bytes = new Byte[4096];

                StringBuilder data = new StringBuilder();

                // Get a stream object for reading and writing
                NetworkStream stream = client.GetStream();

                int i;

                // Loop to receive all the data sent by the client.
                while (stream.DataAvailable)
                {
                    i = stream.Read(bytes, 0, bytes.Length);
                    // Translate data bytes to a ASCII string.
                    String str = System.Text.Encoding.ASCII.GetString(bytes, 0, i);
                    data.Append(str);
                }


                String allData = data.ToString();
                Console.WriteLine("{0} - Received: {1} at {2}", clientNum, allData, DateTime.Now);

                //Now convert these vsd file pathes to vsdx
                Console.WriteLine("{0} - Converting ...", clientNum);

                String[] info = allData.Split('\n');

                if (info.Length < 3)
                    throw new Exception("Invalid number of arguments");

                String[] files = new String[info.Length - 2];
                for (var o = 2; o < info.Length; o++)
                    files[o - 2] = info[o];

                String srcExt = info[0];
                String dstExt = info[1];

                //Using COM to call visio to convert the files
                Type VisioType = Type.GetTypeFromProgID("Visio.InvisibleApp");

                //TODO create a pool of visio instances
                VisioInst = (Microsoft.Office.Interop.Visio.InvisibleApp)Activator.CreateInstance(VisioType);

                foreach (String file in files)
                {
                    if (file.Length > 0)
                    {
                        var doc = VisioInst.Documents.Open(file + srcExt);
                        doc.SaveAs(file + dstExt);
                        doc.Close();
                    }
                }

                VisioInst.Quit();
                VisioInst = null;

                byte[] msg = System.Text.Encoding.ASCII.GetBytes("Done");

                // Send back a response.
                stream.Write(msg, 0, msg.Length);
                Console.WriteLine("{0} - Sent: Done at {1}", clientNum, DateTime.Now);
            }
            catch (SocketException e)
            {
                Console.WriteLine("{0} - {1}: SocketException: {2}", clientNum, DateTime.Now, e);
                //the socket has errors so most probably we cannot send back to the client
            }
            catch (Exception any)
            {
                Console.WriteLine("{0} - {1}: Exception: {2}", clientNum, DateTime.Now, any);

                byte[] msg = System.Text.Encoding.ASCII.GetBytes("Error");

                NetworkStream stream = client.GetStream();
                // Send back error response.
                stream.Write(msg, 0, msg.Length);
            }
            finally
            {
                //Close visio if an unexpected error occured
                if (VisioInst != null)
                {
                    VisioInst.Quit();
                }

                // Shutdown and end connection
                client.Close();
            }
        }
    }
}
