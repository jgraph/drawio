const fs = require('fs');
const path = require('path');
const { COPYFILE_EXCL } = fs.constants;

function isConflict(origStat, stat)
{
	return stat != null && origStat != null && stat.mtimeMs != origStat.mtimeMs;
};

function saveFile(fileObject, data, origStat, overwrite, defEnc, reqId)
{
	var retryCount = 0;
	var backupCreated = false;
	
	var writeFile = function()
	{
		if (data == null || data.length == 0)
		{
			postMessage({error: true, msg: 'empty data', reqId: reqId});
		}
		else
		{
			var writeEnc = defEnc || fileObject.encoding;
			
			fs.writeFile(fileObject.path, data, writeEnc,
			function (e)
		    {
        		if (e)
        		{
        			postMessage({error: true, msg: 'saving failed', e: e, reqId: reqId});
        		}
        		else
        		{
					fs.stat(fileObject.path, function(e2, stat2)
					{
						if (e2)
		        		{
		        			postMessage({error: true, msg: 'stat failed', e: e2, reqId: reqId});
		        		}
						else
						{
							// Workaround for possible writing errors is to check the written
							// contents of the file and retry 3 times before showing an error
							fs.readFile(fileObject.path, writeEnc, (err, writtenData) => 
							{
								if (data != writtenData)
								{
									retryCount++;
									
									if (retryCount < 3)
									{
										writeFile();
									}
									else
									{
					        			postMessage({error: true, msg: 'all saving trials failed', e: e, reqId: reqId});
									}
								}
								else
								{
				        			postMessage({success: true, data: {stat: stat2}, reqId: reqId});
				        			
				        			if (backupCreated)
			        				{
				        				fs.unlink(fileObject.bkpPath, (err) => {}); //Ignore errors!
			        				}
								}
							});							
						}
					});
        		}
        	});
		}
	};
	
	function doSaveFile()
	{
		//Copy file to backup file (after conflict and stat is checked)
		fs.copyFile(fileObject.path, fileObject.bkpPath, COPYFILE_EXCL, (err) => 
		{
			if (!err)
			{
				backupCreated = true;
			}
			
			writeFile();
		});	
	};
	
	if (overwrite)
	{
		doSaveFile();
	}
	else
	{
		//TODO Using stat before write is not recommended, we can check the error code from writeFile
		fs.stat(fileObject.path, function(err, stat)
		{
			if (isConflict(origStat, stat))
			{
    			postMessage({error: true, msg: 'conflict', e: {isConflicted: true}, reqId: reqId});
			}
			else if (err != null && err.code !== 'ENOENT')
			{
    			postMessage({error: true, msg: 'stat failed', e: err, reqId: reqId});
			}
			else
			{
				doSaveFile();
			}
		});
	}
};

//TODO handle reqId better
onmessage = function(e) 
{
  switch(e.data.action)
  {
  case 'saveFile':
	  saveFile(e.data.fileObject, e.data.data, e.data.origStat, e.data.overwrite, e.data.defEnc, e.data.reqId);
	  break;
  };
};