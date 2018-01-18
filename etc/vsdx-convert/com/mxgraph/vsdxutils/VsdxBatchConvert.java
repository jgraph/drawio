package com.mxgraph.vsdxutils;

import java.io.File;
import java.io.FilenameFilter;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.file.Files;
import java.util.Arrays;

import javax.swing.JFileChooser;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.TransformerException;

import org.apache.commons.lang3.StringUtils;
import org.xml.sax.SAXException;

import com.mxgraph.io.mxVsdxCodec;
import com.mxgraph.online.Utils;

public class VsdxBatchConvert
{
	/**
	 * @param args
	 */
	public static void main(String[] args)
	{
		File folder = selectFile("Select folder", "vsdx");

		if (folder != null)
		{
			try
			{
				execute(folder);
			}
			catch (IOException e)
			{
				e.printStackTrace();
			}
		}
	}
	
	/**
	 * Batch converts .vsdx files in the specified folder
	 */
	public static void execute(File folder) throws IOException
	{
		System.out.println(folder);
		
		File[] files = folder.listFiles(new FilenameFilter()
		{ 
            public boolean accept(File dir, String filename)
            {
            	return filename.endsWith(".vsdx");
            }
		} );
		
		System.out.println(Arrays.toString(files));
		
		for (int i = 0; i < files.length; i++)
		{
			File file = files[i];
			byte [] fileData = Files.readAllBytes(file.toPath());
			
			if (fileData != null)
			{
				mxVsdxCodec vdxCodec = new mxVsdxCodec();
				String xml = null;

				try
				{
					xml = vdxCodec.decodeVsdx(fileData, Utils.CHARSET_FOR_URL_ENCODING);
				}
				catch (ParserConfigurationException e)
				{
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				catch (SAXException e)
				{
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				catch (TransformerException e)
				{
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				
				if (xml != null)
				{
					String path = StringUtils.substringBefore(file.getPath(), ".");

					try (PrintWriter out = new PrintWriter(path + ".xml"))
					{
					    out.println(xml);
					}
				}
			}
		}
	}

	/**
	 * Shows a file dialog.
	 */
	public static File selectFile(String title, String extension)
	{
		JFileChooser chooser = new JFileChooser();
		// chooser.addChoosableFileFilter(new FileNameExtensionFilter(extension.toUpperCase() + " File", extension));
		chooser.setFileSelectionMode(JFileChooser.DIRECTORIES_ONLY);
		chooser.setDialogTitle(title);

		if (chooser.showOpenDialog(chooser) == JFileChooser.APPROVE_OPTION)
		{
			return chooser.getSelectedFile();
		}

		return null;
	}
}
