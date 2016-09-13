/**
 * mxVsdxModel
 * 
 */

function mxVsdxModel()
{
};

mxVsdxModel.prototype.decode = function(data)
{
	var unzipFinished = 0;
	var srcDocs = new mxDictionary();
	zip.workerScripts = 'js/deflate/';
	zip.useWebWorkers = false;

	var unzipBlob = function(blob, callback)
	{
		zip.createReader(new zip.BlobReader(blob), function(zipReader)
		{
			zipReader.getEntries(function(entries)
			{
				for (var i = 0; i < entries.length; i++)
				{
					unzipFinished = unzipFinished + 1;

					(function(entry)
					{
						entry.getData(new zip.TextWriter(), function(text) {
							callback(entry, text);
						}, function()
						{
							// console.log('progress', arguments);
						});

					})(entries[i]);
				}
			});
		}, onerror);
	}

	var doc;
	var parser = new DOMParser();
	
	unzipBlob(data, function(entry, data)
	{
		doc = parser.parseFromString(data, 'text/xml');

		srcDocs.put(entry.filename, doc);
		unzipFinished = unzipFinished - 1;
		
		if (unzipFinished == 0)
		{
			//the point when we have a filled array of unzipped DOM documents.
			//getDocument(srcDocs, "visio/pages/page1.xml");
		};
		
		return null;
	});
};