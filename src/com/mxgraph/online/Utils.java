package com.mxgraph.online;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.util.zip.Inflater;
import java.util.zip.InflaterInputStream;

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
	 * 
	 */
	public static String inflate(byte[] binary) throws IOException
	{
		StringBuffer result = new StringBuffer();
		InputStream in = new InflaterInputStream(new ByteArrayInputStream(
				binary), new Inflater(true));

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

	public static void copy(InputStream in, OutputStream out)
			throws IOException
	{
		copy(in, out, IO_BUFFER_SIZE);
	}

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
	   * @return the encoded String
	   */
	public static String encodeURIComponent(String s, String charset)
	{
		String result = null;

		try
		{
			result = URLEncoder.encode(s, charset).replaceAll("\\+", "%20")
					.replaceAll("\\%21", "!").replaceAll("\\%28", "(")
					.replaceAll("\\%29", ")").replaceAll("\\%7E", "~");
		}

		// This exception should never occur.
		catch (UnsupportedEncodingException e)
		{
			result = s;
		}

		return result;
	}

}
