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
		System.out.println("Processing " + file.getCanonicalPath() + "...");

		Deflater deflater = new Deflater(Deflater.DEFAULT_COMPRESSION, true);
		byte[] inBytes = encodeURIComponent(
				readInputStream(new FileInputStream(file)),
				CHARSET_FOR_URL_ENCODING).getBytes("UTF-8");
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

		return encodeToString(outputStream.toByteArray(), false);
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

	// ****************************************************************************************
	// *  char[] version
	// ****************************************************************************************

	/** Encodes a raw byte array into a BASE64 <code>char[]</code> representation i accordance with RFC 2045.
	 * @param sArr The bytes to convert. If <code>null</code> or length 0 an empty array will be returned.
	 * @param lineSep Optional "\r\n" after 76 characters, unless end of file.<br>
	 * No line separator will be in breach of RFC 2045 which specifies max 76 per line but will be a
	 * little faster.
	 * @return A BASE64 encoded array. Never <code>null</code>.
	 */
	public final static char[] encodeToChar(byte[] sArr, boolean lineSep)
	{
		// Check special case
		int sLen = sArr != null ? sArr.length : 0;
		if (sLen == 0)
			return new char[0];

		int eLen = (sLen / 3) * 3; // Length of even 24-bits.
		int cCnt = ((sLen - 1) / 3 + 1) << 2; // Returned character count
		int dLen = cCnt + (lineSep ? (cCnt - 1) / 76 << 1 : 0); // Length of returned array
		char[] dArr = new char[dLen];

		// Encode even 24-bits
		for (int s = 0, d = 0, cc = 0; s < eLen;)
		{
			// Copy next three bytes into lower 24 bits of int, paying attension to sign.
			int i = (sArr[s++] & 0xff) << 16 | (sArr[s++] & 0xff) << 8
					| (sArr[s++] & 0xff);

			// Encode the int into four chars
			dArr[d++] = CA[(i >>> 18) & 0x3f];
			dArr[d++] = CA[(i >>> 12) & 0x3f];
			dArr[d++] = CA[(i >>> 6) & 0x3f];
			dArr[d++] = CA[i & 0x3f];

			// Add optional line separator
			if (lineSep && ++cc == 19 && d < dLen - 2)
			{
				dArr[d++] = '\r';
				dArr[d++] = '\n';
				cc = 0;
			}
		}

		// Pad and encode last bits if source isn't even 24 bits.
		int left = sLen - eLen; // 0 - 2.
		if (left > 0)
		{
			// Prepare the int
			int i = ((sArr[eLen] & 0xff) << 10)
					| (left == 2 ? ((sArr[sLen - 1] & 0xff) << 2) : 0);

			// Set last four chars
			dArr[dLen - 4] = CA[i >> 12];
			dArr[dLen - 3] = CA[(i >>> 6) & 0x3f];
			dArr[dLen - 2] = left == 2 ? CA[i & 0x3f] : '=';
			dArr[dLen - 1] = '=';
		}
		return dArr;
	}

	// ****************************************************************************************
	// * String version
	// ****************************************************************************************

	/** Encodes a raw byte array into a BASE64 <code>String</code> representation i accordance with RFC 2045.
	 * @param sArr The bytes to convert. If <code>null</code> or length 0 an empty array will be returned.
	 * @param lineSep Optional "\r\n" after 76 characters, unless end of file.<br>
	 * No line separator will be in breach of RFC 2045 which specifies max 76 per line but will be a
	 * little faster.
	 * @return A BASE64 encoded array. Never <code>null</code>.
	 */
	public final static String encodeToString(byte[] sArr, boolean lineSep)
	{
		// Reuse char[] since we can't create a String incrementally anyway and StringBuffer/Builder would be slower.
		return new String(encodeToChar(sArr, lineSep));
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
				result.append("    t = pako.inflateRaw(Uint8Array.from(atob(t), function (c) {\n");
				result.append("      return c.charCodeAt(0);\n");
				result.append("    }), {to: 'string'});\n");
				result.append("    s = decodeURIComponent(t);\n");
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
