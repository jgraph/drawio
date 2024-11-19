import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Set;
import java.util.zip.Deflater;
import java.util.Base64;

public class Xml2Js
{
	/**
	 * 
	 */
	protected static final int IO_BUFFER_SIZE = 4 * 1024;

	/**
	 * 
	 */
	public static String CHARSET_FOR_URL_ENCODING = "UTF-8";

	/**
	 * 
	 * @param path
	 * @return
	 */
	public List<String> walk(File base, File root) throws IOException
	{
		if (root == null)
		{
			root = base;
		}

		List<String> result = new LinkedList<String>();
		String basePath = base.getCanonicalPath();
		File[] list = root.listFiles();

		if (list != null)
		{
			for (File f : list)
			{
				if (f.isDirectory())
				{
					result.addAll(walk(base, f));
				}
				else if (f.getCanonicalPath().toLowerCase().endsWith(".xml"))
				{
					String name = f.getCanonicalPath()
							.substring(basePath.length() + 1);
					result.add(
							"f['" + name + "'] = '" + processFile(f) + "';\n");
				}
			}
		}

		return result;
	}

	/**
	 * 
	 * @param file
	 * @return
	 * @throws IOException
	 */
	public static String processFile(File file) throws IOException
	{
		Deflater deflater = new Deflater(Deflater.BEST_COMPRESSION, true);
		byte[] inBytes = readInputStream(new FileInputStream(file)).getBytes("UTF-8");
		deflater.setInput(inBytes);

		ByteArrayOutputStream outputStream = new ByteArrayOutputStream(
				inBytes.length);
		deflater.finish();
		byte[] buffer = new byte[IO_BUFFER_SIZE];

		while (!deflater.finished())
		{
			int count = deflater.deflate(buffer); // returns the generated code... index  
			outputStream.write(buffer, 0, count);
		}

		outputStream.close();

		return Base64.getEncoder().encodeToString(outputStream.toByteArray());
	}

	/**
	 * 
	 * @param stream
	 * @return
	 * @throws IOException
	 */
	public static String readInputStream(InputStream stream) throws IOException
	{
		BufferedReader reader = new BufferedReader(
				new InputStreamReader(stream));
		StringBuffer result = new StringBuffer();
		String tmp = reader.readLine();

		while (tmp != null)
		{
			result.append(tmp.trim());
			tmp = reader.readLine();
		}

		reader.close();

		return result.toString();
	}

	public static String encodeURIComponent(String s, String charset)
	{
		if (s == null)
		{
			return null;
		}
		else
		{
			String result;

			try
			{
				result = URLEncoder.encode(s, charset).replaceAll("\\+", "%20")
						.replaceAll("\\%21", "!").replaceAll("\\%27", "'")
						.replaceAll("\\%28", "(").replaceAll("\\%29", ")")
						.replaceAll("\\%7E", "~");
			}
			catch (UnsupportedEncodingException e)
			{
				// This exception should never occur
				result = s;
			}

			return result;
		}
	}

	private static final char[] CA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
			.toCharArray();

	private static final int[] IA = new int[256];
	static
	{
		Arrays.fill(IA, -1);
		for (int i = 0, iS = CA.length; i < iS; i++)
			IA[CA[i]] = i;
		IA['='] = 0;
	}

	/**
	 * Main
	 */
	public static void main(String[] args)
	{
		if (args.length < 2)
		{
			System.out.println("Usage: xml2js path file");
		}
		else
		{
			try
			{
				Xml2Js fw = new Xml2Js();

				// Generates result
				StringBuffer result = new StringBuffer();
				result.append("(function() {\nvar f = {};\n");

				List<String> files = fw
						.walk(new File(new File(".").getCanonicalPath()
								+ File.separator + args[0]), null);
				Iterator<String> it = files.iterator();

				while (it.hasNext())
				{
					result.append(it.next());
				}

				result.append("\n");
				result.append("var l = mxStencilRegistry.loadStencil;\n\n");
				result.append(
						"mxStencilRegistry.loadStencil = function(filename, fn)\n{\n");
				result.append("  var t = f[filename.substring(STENCIL_PATH.length + 1)];\n");
				result.append("  var s = null;\n");
				result.append("  if (t != null) {\n");
				result.append("    s = pako.inflateRaw(Uint8Array.from(atob(t), function (c) {\n");
				result.append("      return c.charCodeAt(0);\n");
				result.append("    }), {to: 'string'});\n");
				result.append("  }\n");
				result.append("  if (fn != null && s != null) {\n");
				result.append(
						"    window.setTimeout(function(){fn(mxUtils.parseXml(s))}, 0);\n");
				result.append("  } else {\n");
				result.append(
						"    return (s != null) ? mxUtils.parseXml(s) : l.apply(this, arguments)\n");
				result.append("  }\n");
				result.append("};\n");
				result.append("})();\n");

				FileWriter writer = new FileWriter(
						new File(new File(".").getCanonicalPath()
								+ File.separator + args[1]));
				writer.write(result.toString());
				writer.flush();
				writer.close();
			}
			catch (IOException ex)
			{
				ex.printStackTrace();
			}
		}
	}
}
