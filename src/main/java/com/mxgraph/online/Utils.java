/**
 * Copyright (c) 2006-2016, JGraph Holdings Ltd
 * Copyright (c) 2006-2016, draw.io AG
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
import java.net.Inet4Address;
import java.net.Inet6Address;
import java.net.InetAddress;
import java.net.MalformedURLException;
import java.net.Socket;
import java.net.URL;
import java.net.URLConnection;
import java.net.URLEncoder;
import java.net.UnknownHostException;
import java.security.SecureRandom;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.zip.Deflater;
import java.util.zip.Inflater;
import java.util.zip.InflaterInputStream;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SNIHostName;
import javax.net.ssl.SNIServerName;
import javax.net.ssl.SSLParameters;
import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;

/**
 * 
 * String/byte array encoding/manipulation utilities
 *
 */
public class Utils
{

	private static SecureRandom randomSecure = new SecureRandom();
	
	/**
	 * 
	 */
	public static String CHARSET_FOR_URL_ENCODING = "ISO-8859-1";

	/**
	 * 
	 */
	public static int MAX_SIZE = 20 * 1024 * 1024; // 20 MB

	/**
	 * 
	 */
	public static final int IO_BUFFER_SIZE = 4 * 1024;

	/**
	 * Alphabet for global unique IDs.
	 */
	public static final String TOKEN_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-_";

	private static Set<Integer> allowedPorts = new HashSet<>();
	
	static {
		// Allow overriding the Host header so connections that are pinned to a
		// literal IP (see openPinnedConnection) can still present the correct
		// virtual host. Best-effort: only takes effect if set before the JDK
		// HTTP client initialises its restricted-header set.
		try
		{
			System.setProperty("sun.net.http.allowRestrictedHeaders", "true");
		}
		catch (SecurityException e)
		{
			// Host header override will be best-effort
		}

		// -1 is for no port urls (ports 80, 443)
		allowedPorts.add(-1);

		String allowedPortsStr = System.getenv("DRAWIO_PROXY_ALLOWED_PORTS");
		
		if (allowedPortsStr != null) 
		{
			String[] ports = allowedPortsStr.split(",");
			
			for (String port : ports) 
			{
				try 
				{
					allowedPorts.add(Integer.parseInt(port));
				} 
				catch (NumberFormatException e) 
				{
					System.out.println("Invalid DRAWIO_PROXY_ALLOWED_PORTS port: " + port);
				}
			}
		}
	}

	/**
	 * Returns a random string of the given length.
	 */
	public static String generateToken(int length)
	{
		StringBuffer rtn = new StringBuffer();

		for (int i = 0; i < length; i++)
		{
			int offset = randomSecure.nextInt(TOKEN_ALPHABET.length());
			rtn.append(TOKEN_ALPHABET.substring(offset,offset+1));
		}

		return rtn.toString();
	};

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
	 * Copies the input stream to the output stream using the default buffer size
	 * @param in the input stream
	 * @param out the output stream
	 * @param sizeLimit the maximum number of bytes to copy
	 * @throws IOException
	 */
	public static int copyRestricted(InputStream in, OutputStream out) throws IOException
	{
		return copy(in, out, IO_BUFFER_SIZE, MAX_SIZE);
	}

	/**
	 * Copies the input stream to the output stream using the default buffer size
	 * @param in the input stream
	 * @param out the output stream
	 * @param sizeLimit the maximum number of bytes to copy
	 * @throws IOException
	 */
	public static int copyRestricted(InputStream in, OutputStream out, int sizeLimit) throws IOException
	{
		return copy(in, out, IO_BUFFER_SIZE, sizeLimit);
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
		copy(in, out, bufferSize, 0);
	}

	/**
	 * Copies the input stream to the output stream using the specified buffer size
	 * @param in the input stream
	 * @param out the output stream
	 * @param bufferSize the buffer size to use when copying
	 * @param sizeLimit the maximum number of bytes to copy
	 * @throws IOException
	 */
	public static int copy(InputStream in, OutputStream out, int bufferSize, int sizeLimit)
			throws IOException
	{
		byte[] b = new byte[bufferSize];
		int read, total = 0;

		while ((read = in.read(b)) != -1)
		{
			total += read;

			if (sizeLimit > 0 && total > sizeLimit)
			{
				throw new SizeLimitExceededException();
			}

			out.write(b, 0, read);
		}

		return total;
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

	/**
	 * Checks the file type of an input stream and returns the
	 * bytes that have been read (because URL connections to not
	 * have support for mark/reset).
	 */
	static public byte[] checkStreamContent(InputStream is)
			throws IOException, UnsupportedContentException
	{
		byte[] head = new byte[16];
		boolean valid = false;

		if (is.read(head) == head.length)
		{
			int c1 = head[0] & 0xFF;
			int c2 = head[1] & 0xFF;
			int c3 = head[2] & 0xFF;
			int c4 = head[3] & 0xFF;
			int c5 = head[4] & 0xFF;
			int c6 = head[5] & 0xFF;
			int c7 = head[6] & 0xFF;
			int c8 = head[7] & 0xFF;
			int c9 = head[8] & 0xFF;
			int c10 = head[9] & 0xFF;
			int c11 = head[10] & 0xFF;
			int c12 = head[11] & 0xFF;
			int c13 = head[12] & 0xFF;
			int c14 = head[13] & 0xFF;
			int c15 = head[14] & 0xFF;
			int c16 = head[15] & 0xFF;

			if (c1 == '<')
			{
				// text/html
				if (c2 == '!'
						|| ((c2 == 'h'
								&& (c3 == 't' && c4 == 'm' && c5 == 'l'
										|| c3 == 'e' && c4 == 'a' && c5 == 'd')
								|| (c2 == 'b' && c3 == 'o' && c4 == 'd'
										&& c5 == 'y')))
						|| ((c2 == 'H'
								&& (c3 == 'T' && c4 == 'M' && c5 == 'L'
										|| c3 == 'E' && c4 == 'A' && c5 == 'D')
								|| (c2 == 'B' && c3 == 'O' && c4 == 'D'
										&& c5 == 'Y'))))
				{
					valid = true;
				}

				// application/xml
				if (c2 == '?' && c3 == 'x' && c4 == 'm' && c5 == 'l'
						&& c6 == ' ')
				{
					valid = true;
				}
				
				// application/svg+xml
				if (c2 == 's' && c3 == 'v' && c4 == 'g' && c5 == ' ')
				{
					valid = true;
				}
			}

			// big and little (identical) endian UTF-8 encodings, with BOM
			// application/xml
			if (c1 == 0xef && c2 == 0xbb && c3 == 0xbf)
			{
				if (c4 == '<' && c5 == '?' && c6 == 'x')
				{
					valid = true;
				}
			}

			// big and little endian UTF-16 encodings, with byte order mark
			// application/xml
			if (c1 == 0xfe && c2 == 0xff)
			{
				if (c3 == 0 && c4 == '<' && c5 == 0 && c6 == '?' && c7 == 0
						&& c8 == 'x')
				{
					valid = true;
				}
			}

			// application/xml
			if (c1 == 0xff && c2 == 0xfe)
			{
				if (c3 == '<' && c4 == 0 && c5 == '?' && c6 == 0 && c7 == 'x'
						&& c8 == 0)
				{
					valid = true;
				}
			}

			// big and little endian UTF-32 encodings, with BOM
			// application/xml
			if (c1 == 0x00 && c2 == 0x00 && c3 == 0xfe && c4 == 0xff)
			{
				if (c5 == 0 && c6 == 0 && c7 == 0 && c8 == '<' && c9 == 0
						&& c10 == 0 && c11 == 0 && c12 == '?' && c13 == 0
						&& c14 == 0 && c15 == 0 && c16 == 'x')
				{
					valid = true;
				}
			}

			// application/xml
			if (c1 == 0xff && c2 == 0xfe && c3 == 0x00 && c4 == 0x00)
			{
				if (c5 == '<' && c6 == 0 && c7 == 0 && c8 == 0 && c9 == '?'
						&& c10 == 0 && c11 == 0 && c12 == 0 && c13 == 'x'
						&& c14 == 0 && c15 == 0 && c16 == 0)
				{
					valid = true;
				}
			}

			// image/gif
			if (c1 == 'G' && c2 == 'I' && c3 == 'F' && c4 == '8')
			{
				valid = true;
			}

			// image/x-bitmap
			if (c1 == '#' && c2 == 'd' && c3 == 'e' && c4 == 'f')
			{
				valid = true;
			}

			// image/x-pixmap
			if (c1 == '!' && c2 == ' ' && c3 == 'X' && c4 == 'P' && c5 == 'M'
					&& c6 == '2')
			{
				valid = true;
			}

			// image/png
			if (c1 == 137 && c2 == 80 && c3 == 78 && c4 == 71 && c5 == 13
					&& c6 == 10 && c7 == 26 && c8 == 10)
			{
				valid = true;
			}

			// image/jpeg
			if (c1 == 0xFF && c2 == 0xD8 && c3 == 0xFF)
			{
				if (c4 == 0xE0 || c4 == 0xEE)
				{
					valid = true;
				}

				/**
				 * File format used by digital cameras to store images.
				 * Exif Format can be read by any application supporting
				 * JPEG. Exif Spec can be found at:
				 * http://www.pima.net/standards/it10/PIMA15740/Exif_2-1.PDF
				 */
				if ((c4 == 0xE1) && (c7 == 'E' && c8 == 'x' && c9 == 'i'
						&& c10 == 'f' && c11 == 0))
				{
					valid = true;
				}
			}

			// Additional signatures
			// See https://www.garykessler.net/library/file_sigs.html
			// and https://en.wikipedia.org/wiki/List_of_file_signatures
			// TODO: Add check for .eot fonts
			// ttf
			if (c1 == 0x00 && c2 == 0x01 && c3 == 0x00 && c4 == 0x00
					&& c5 == 0x00)
			{
				valid = true;
			}

			// otf
			if (c1 == 0x4F && c2 == 0x54 && c3 == 0x54 && c4 == 0x4F
					&& c5 == 0x00)
			{
				valid = true;
			}

			// woff
			if (c1 == 0x77 && c2 == 0x4F && c3 == 0x46 && c4 == 0x46)
			{
				valid = true;
			}

			// woff2
			if (c1 == 0x77 && c2 == 0x4F && c3 == 0x46 && c4 == 0x32)
			{
				valid = true;
			}

			// vsdx, vssx (also zip, jar, odt, ods, odp, docx, xlsx, pptx, apk, aar)
			if (c1 == 0x50 && c2 == 0x4B && c3 == 0x03 && c4 == 0x04)
			{
				valid = true;
			}
			else if (c1 == 0x50 && c2 == 0x4B && c3 == 0x03 && c4 == 0x06)
			{
				valid = true;
			}

			// vsd, ppt
			if (c1 == 0xD0 && c2 == 0xCF && c3 == 0x11 && c4 == 0xE0
					&& c5 == 0xA1 && c6 == 0xB1 && c7 == 0x1A && c8 == 0xE1)
			{
				valid = true;
			}

			// mxfile, mxlibrary, mxGraphModel
			if (c1 == '<' && c2 == 'm' && c3 == 'x')
			{
				valid = true;
			}

			if (c1 == '<' && c2 == 'D' && c3 == 'O' && c4 == 'C' && c5 == 'T'
					&& c6 == 'Y' && c7 == 'P' && c8 == 'E')
			{
				valid = true;
			}

			if (c1 == '<' && c2 == '!' && c3 == '-' && c4 == '-' && c5 == '['
					&& c6 == 'i' && c7 == 'f' && c8 == ' ')
			{
				valid = true;
			}

			// Gliffy
			if (c1 == '{' && c2 == '"' && c3 == 'c' && c4 == 'o' && c5 == 'n'
					&& c6 == 't' && c7 == 'e' && c8 == 'n' && c9 == 't'
					&& c10 == 'T' && c11 == 'y' && c12 == 'p' && c13 == 'e'
					&& c14 == '"' && c15 == ':')
			{
				valid = true;
			}

			// Lucidchart
			if (c1 == '{' && c2 == '"' && c3 == 's' && c4 == 't' && c5 == 'a'
					&& c6 == 't' && c7 == 'e' && c8 == '"' && c9 == ':')
			{
				valid = true;
			}
		}

		if (!valid)
		{
			throw new UnsupportedContentException();
		}

		return head;
	}

	public static boolean isNumeric (String str)
	{ 
		try
		{  
			Double.parseDouble(str);

			return true;
		}
		catch(NumberFormatException e)
		{  
			return false;  
		}  
	}

	/**
	 * Checks if the URL parameter is legal, i.e. isn't attempting an SSRF
	 * 
	 * @param url the URL to check
	 * @return true if the URL is permitted
	 */
	public static boolean sanitizeUrl(String url)
	{
		return validatedAddress(url) != null;
	}

	/**
	 * Returns true if the address is an IPv6 Unique Local Address (fc00::/7,
	 * which spans fc00::/8 and fd00::/8 - including AWS's fd00:ec2::/32 IMDS
	 * range). This must be tested on the raw address bytes: the JDK's
	 * {@link InetAddress#getHostAddress()} always returns the fully expanded
	 * eight-group form and never "::"-compresses, so a startsWith("fc00::")
	 * or startsWith("fd00::") string check never matches a real ULA and lets
	 * the whole range through.
	 *
	 * @param address the resolved address to test
	 * @return true if the address is in fc00::/7
	 */
	private static boolean isUniqueLocalIPv6(InetAddress address)
	{
		if (address instanceof Inet6Address)
		{
			byte[] bytes = address.getAddress();

			// fc00::/7: high 7 bits are 1111110, i.e. first byte 0xFC or 0xFD
			return bytes.length == 16 && (bytes[0] & 0xFE) == 0xFC;
		}

		return false;
	}

	/**
	 * Returns true if the address is in the RFC 6598 shared / Carrier-Grade-NAT
	 * range 100.64.0.0/10 (100.64.0.0 - 100.127.255.255). This range is not
	 * octet-aligned, so it cannot be matched with a startsWith prefix without
	 * either missing part of it or over-blocking the surrounding public
	 * 100.0.0.0/8 space; the raw bytes are masked instead. It is routable
	 * internal space in many deployments (AWS EKS secondary pod CIDRs, some
	 * k8s CNIs, Oracle Cloud, Tailscale, ISP CGNAT).
	 *
	 * @param address the resolved address to test
	 * @return true if the address is in 100.64.0.0/10
	 */
	private static boolean isSharedCgnatIPv4(InetAddress address)
	{
		if (address instanceof Inet4Address)
		{
			byte[] bytes = address.getAddress();

			// 100.64.0.0/10: first octet 100, second octet's top 2 bits = 01
			return bytes.length == 4
					&& (bytes[0] & 0xFF) == 100
					&& (bytes[1] & 0xC0) == 0x40;
		}

		return false;
	}

	/**
	 * Resolves and validates the host of the given URL exactly once and returns
	 * the resolved address, or null if the URL is not permitted (malformed,
	 * unknown host, non-http(s), disallowed port, or pointing at a private,
	 * internal or reserved address).
	 *
	 * Callers that go on to fetch the URL must connect to the returned address
	 * via {@link #openPinnedConnection(URL, InetAddress)} rather than letting
	 * the JDK resolve the hostname a second, independent time - that second
	 * lookup is what a DNS-rebinding attacker exploits to slip an internal
	 * address past this check (TOCTOU).
	 *
	 * @param url the URL to check
	 * @return the validated InetAddress, or null if the URL is not permitted
	 */
	public static InetAddress validatedAddress(String url)
	{
		if (url != null)
		{
			try
			{
				URL parsedUrl = new URL(url);
				String protocol = parsedUrl.getProtocol();
				String host = parsedUrl.getHost();
				InetAddress address = InetAddress.getByName(host);
				String hostAddress = address.getHostAddress();
				host = host.toLowerCase();
	
				boolean allow10Net = "1".equals(System.getenv("ALLOW_INTERNAL_10_NET"));
	
				// Special handling: if ALLOW_INTERNAL_10_NET=1 and IP is 10.x.x.x, allow it
				if (hostAddress.startsWith("10.") && allow10Net)
				{
					return ((protocol.equals("http") || protocol.equals("https"))
							&& allowedPorts.contains(parsedUrl.getPort())) ? address : null;
				}
	
				// Block all other private/internal/reserved IPs
				boolean isPrivateAddress = 
						address.isAnyLocalAddress()
						|| address.isLoopbackAddress()
						|| address.isLinkLocalAddress()
						|| host.endsWith(".internal")
						|| host.endsWith(".local")
						|| host.contains("localhost")
						|| hostAddress.startsWith("0.")
						|| hostAddress.startsWith("10.") // still here to block if not explicitly allowed
						|| hostAddress.startsWith("127.")
						|| hostAddress.startsWith("169.254.")
						|| hostAddress.startsWith("172.16.")
						|| hostAddress.startsWith("172.17.")
						|| hostAddress.startsWith("172.18.")
						|| hostAddress.startsWith("172.19.")
						|| hostAddress.startsWith("172.20.")
						|| hostAddress.startsWith("172.21.")
						|| hostAddress.startsWith("172.22.")
						|| hostAddress.startsWith("172.23.")
						|| hostAddress.startsWith("172.24.")
						|| hostAddress.startsWith("172.25.")
						|| hostAddress.startsWith("172.26.")
						|| hostAddress.startsWith("172.27.")
						|| hostAddress.startsWith("172.28.")
						|| hostAddress.startsWith("172.29.")
						|| hostAddress.startsWith("172.30.")
						|| hostAddress.startsWith("172.31.")
						|| hostAddress.startsWith("192.0.0.")
						|| hostAddress.startsWith("192.168.")
						|| hostAddress.startsWith("198.18.")
						|| hostAddress.startsWith("198.19.")
						|| isSharedCgnatIPv4(address)
						|| isUniqueLocalIPv6(address)
						|| host.endsWith(".arpa");
	
				return ((protocol.equals("http") || protocol.equals("https"))
						&& !isPrivateAddress
						&& allowedPorts.contains(parsedUrl.getPort())) ? address : null;
			}
			catch (MalformedURLException | UnknownHostException e)
			{
				return null;
			}
		}
		else
		{
			return null;
		}
	}

	/**
	 * Opens a connection to the given URL that is pinned to the supplied,
	 * already-validated IP address, so the JDK does not perform a second,
	 * independent DNS lookup of the hostname (which a rebinding attacker could
	 * answer with an internal address). The original hostname is preserved for
	 * the Host header and, for HTTPS, for SNI and certificate verification.
	 *
	 * @param url the original URL (carrying the hostname)
	 * @param pinned the validated address to connect to
	 * @return an unconnected URLConnection pinned to the validated address
	 */
	public static URLConnection openPinnedConnection(URL url, InetAddress pinned)
			throws IOException
	{
		final String host = url.getHost();
		int port = url.getPort();
		String ipHost = pinned.getHostAddress();

		if (pinned instanceof Inet6Address)
		{
			ipHost = "[" + ipHost + "]";
		}

		// Connect to the literal, already-validated IP so the hostname is not
		// resolved again at connection time.
		URL ipUrl = new URL(url.getProtocol(), ipHost, port, url.getFile());
		URLConnection connection = ipUrl.openConnection();

		if (connection instanceof HttpsURLConnection)
		{
			HttpsURLConnection https = (HttpsURLConnection) connection;

			// The URL now carries the IP literal, so use the real hostname for
			// SNI and verify the certificate against it (not the IP).
			https.setSSLSocketFactory(new PinnedSNISocketFactory(
					(SSLSocketFactory) SSLSocketFactory.getDefault(), host));

			final HostnameVerifier defaultVerifier =
					HttpsURLConnection.getDefaultHostnameVerifier();
			https.setHostnameVerifier(
					(hostname, session) -> defaultVerifier.verify(host, session));
		}

		// Preserve virtual-host routing (requires allowRestrictedHeaders, set
		// in the static initialiser above).
		connection.setRequestProperty("Host",
				(port == -1) ? host : host + ":" + port);

		return connection;
	}

	/**
	 * SSLSocketFactory that layers TLS over the already IP-pinned plain socket
	 * created by the JDK HTTPS client, while using the real hostname for SNI so
	 * the correct certificate is served and verified.
	 */
	private static final class PinnedSNISocketFactory extends SSLSocketFactory
	{
		private final SSLSocketFactory delegate;
		private final String sniHost;

		PinnedSNISocketFactory(SSLSocketFactory delegate, String sniHost)
		{
			this.delegate = delegate;
			this.sniHost = sniHost;
		}

		// Variant the JDK HTTPS client uses to layer TLS over the connected
		// (IP-pinned) plain socket. Substituting the real hostname here drives
		// SNI and endpoint identification onto the hostname, not the IP.
		@Override
		public Socket createSocket(Socket s, String host, int port,
				boolean autoClose) throws IOException
		{
			SSLSocket socket =
					(SSLSocket) delegate.createSocket(s, sniHost, port, autoClose);

			try
			{
				SSLParameters params = socket.getSSLParameters();
				List<SNIServerName> serverNames =
						Collections.singletonList(new SNIHostName(sniHost));
				params.setServerNames(serverNames);
				socket.setSSLParameters(params);
			}
			catch (IllegalArgumentException e)
			{
				// sniHost is an IP literal; leave the default SNI handling
			}

			return socket;
		}

		@Override
		public String[] getDefaultCipherSuites()
		{
			return delegate.getDefaultCipherSuites();
		}

		@Override
		public String[] getSupportedCipherSuites()
		{
			return delegate.getSupportedCipherSuites();
		}

		@Override
		public Socket createSocket(String host, int port) throws IOException
		{
			return delegate.createSocket(host, port);
		}

		@Override
		public Socket createSocket(String host, int port,
				InetAddress localHost, int localPort) throws IOException
		{
			return delegate.createSocket(host, port, localHost, localPort);
		}

		@Override
		public Socket createSocket(InetAddress host, int port) throws IOException
		{
			return delegate.createSocket(host, port);
		}

		@Override
		public Socket createSocket(InetAddress address, int port,
				InetAddress localAddress, int localPort) throws IOException
		{
			return delegate.createSocket(address, port, localAddress, localPort);
		}
	}
	/**
	 *
	 */
	public static class UnsupportedContentException extends Exception
	{
		private static final long serialVersionUID = 1239597891574347740L;
	}

	/**
	 * Exception for size limit exceeeded in copy request.
	 */
	public static class SizeLimitExceededException extends IOException
	{
		public SizeLimitExceededException()
		{
			super("Size limit exceeded");
		}
	}

}
