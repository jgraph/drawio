/**
 * Copyright (c) 2006-2016, JGraph Ltd
 * Copyright (c) 2006-2016, Gaudenz Alder
 */
package com.mxgraph.online;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.zip.Deflater;
import java.util.zip.Inflater;
import java.util.zip.InflaterInputStream;

/**
 * 
 * String/byte array encoding/manipulation utilities
 *
 */
public class Utils
{

	/**
	 * 
	 */
	public static String CHARSET_FOR_URL_ENCODING = "ISO-8859-1";

	/**
	 * 
	 */
	protected static final int IO_BUFFER_SIZE = 4 * 1024;

	/**
	 * Applies a standard inflate algo to the input byte array
	 * @param binary the byte array to inflate
	 * @return the inflated String
	 * 
	 */
	public static String inflate(byte[] binary) throws IOException
	{
		StringBuffer result = new StringBuffer();
		InputStream in = new InflaterInputStream(
				new ByteArrayInputStream(binary), new Inflater(true));

		while (in.available() != 0)
		{
			byte[] buffer = new byte[IO_BUFFER_SIZE];
			int len = in.read(buffer, 0, IO_BUFFER_SIZE);

			if (len <= 0)
			{
				break;
			}

			result.append(new String(buffer, 0, len));
		}

		in.close();

		return result.toString();
	}

	/**
	 * Applies a standard deflate algo to the input String
	 * @param inString the String to deflate
	 * @return the deflated byte array
	 * 
	 */
	public static byte[] deflate(String inString) throws IOException
	{
		Deflater deflater = new Deflater(Deflater.DEFAULT_COMPRESSION, true);
		byte[] inBytes = inString.getBytes("UTF-8");
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
		byte[] output = outputStream.toByteArray();

		return output;
	}

	/**
	 * Copies the input stream to the output stream using the default buffer size
	 * @param in the input stream
	 * @param out the output stream
	 * @throws IOException
	 */
	public static void copy(InputStream in, OutputStream out) throws IOException
	{
		copy(in, out, IO_BUFFER_SIZE);
	}

	/**
	 * Copies the input stream to the output stream using the specified buffer size
	 * @param in the input stream
	 * @param out the output stream
	 * @param bufferSize the buffer size to use when copying
	 * @throws IOException
	 */
	public static void copy(InputStream in, OutputStream out, int bufferSize)
			throws IOException
	{
		byte[] b = new byte[bufferSize];
		int read;

		while ((read = in.read(b)) != -1)
		{
			out.write(b, 0, read);
		}
	}

	/**
	 * Reads an input stream and returns the result as a String
	 * @param stream the input stream to read
	 * @return a String representation of the input stream
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
			result.append(tmp + "\n");
			tmp = reader.readLine();
		}

		reader.close();

		return result.toString();
	}

	/**
	  * Encodes the passed String as UTF-8 using an algorithm that's compatible
	  * with JavaScript's <code>encodeURIComponent</code> function. Returns
	  * <code>null</code> if the String is <code>null</code>.
	  * 
	  * @param s The String to be encoded
	  * @param charset the character set to base the encoding on
	  * @return the encoded String
	  */
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
						.replaceAll("\\%21", "!").replaceAll("\\%28", "(")
						.replaceAll("\\%29", ")").replaceAll("\\%7E", "~");
			}
			catch (UnsupportedEncodingException e)
			{
				// This exception should never occur
				result = s;
			}

			return result;
		}
	}

	/**
	 * <p>Removes one newline from end of a String if it's there,
	 * otherwise leave it alone.  A newline is &quot;{@code \n}&quot;,
	 * &quot;{@code \r}&quot;, or &quot;{@code \r\n}&quot;.</p>
	 *
	 * <p>Borrowed from Apache Commons Lang 3.5</p>
	 *
	 * <pre>
	 * StringUtils.chomp(null)          = null
	 * StringUtils.chomp("")            = ""
	 * StringUtils.chomp("abc \r")      = "abc "
	 * StringUtils.chomp("abc\n")       = "abc"
	 * StringUtils.chomp("abc\r\n")     = "abc"
	 * StringUtils.chomp("abc\r\n\r\n") = "abc\r\n"
	 * StringUtils.chomp("abc\n\r")     = "abc\n"
	 * StringUtils.chomp("abc\n\rabc")  = "abc\n\rabc"
	 * StringUtils.chomp("\r")          = ""
	 * StringUtils.chomp("\n")          = ""
	 * StringUtils.chomp("\r\n")        = ""
	 * </pre>
	 *
	 * @param str  the String to chomp a newline from, may be null
	 * @return String without newline, {@code null} if null String input
	 */
	public static String chomp(final String str)
	{
		if (str.isEmpty())
		{
			return str;
		}

		if (str.length() == 1)
		{
			final char ch = str.charAt(0);

			if (ch == '\r' || ch == '\n')
			{
				return "";
			}

			return str;
		}

		int lastIdx = str.length() - 1;
		final char last = str.charAt(lastIdx);

		if (last == '\n')
		{
			if (str.charAt(lastIdx - 1) == '\r')
			{
				lastIdx--;
			}
		}
		else if (last != '\r')
		{
			lastIdx++;
		}

		return str.substring(0, lastIdx);
	}

}
