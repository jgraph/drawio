const fs = require('fs')
const os = require('os');
const path = require('path')
const url = require('url')
const electron = require('electron')
const {Menu: menu, shell} = require('electron')
const ipcMain = electron.ipcMain
const dialog = electron.dialog
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const crc = require('crc');
const zlib = require('zlib');
const log = require('electron-log')
const program = require('commander')
const {autoUpdater} = require("electron-updater")
const PDFDocument = require('pdf-lib').PDFDocument;
const Store = require('electron-store');
const store = new Store();
const ProgressBar = require('electron-progressbar');
const disableUpdate = require('./disableUpdate').disableUpdate() || 
						process.env.DRAWIO_DISABLE_UPDATE === 'true' || 
						fs.existsSync('/.flatpak-info'); //This file indicates running in flatpak sandbox
autoUpdater.logger = log
autoUpdater.logger.transports.file.level = 'info'
autoUpdater.autoDownload = false

const __DEV__ = process.env.DRAWIO_ENV === 'dev'
		
let windowsRegistry = []
let cmdQPressed = false
let firstWinLoaded = false
let firstWinFilePath = null

//Read config file
var queryObj = {
	'dev': __DEV__ ? 1 : 0,
	'test': __DEV__ ? 1 : 0,
	'gapi': 0,
	'db': 0,
	'od': 0,
	'gh': 0,
	'gl': 0,
	'tr': 0,
	'browser': 0,
	'picker': 0,
	'mode': 'device',
	'export': 'https://convert.diagrams.net/node/export'
};

try
{
	if (fs.existsSync(process.cwd() + '/urlParams.json'))
	{
		let urlParams = JSON.parse(fs.readFileSync(process.cwd() + '/urlParams.json'));
		
		for (var param in urlParams)
		{
			queryObj[param] = urlParams[param];
		}
	}
}
catch(e)
{
	console.log('Error in urlParams.json file: ' + e.message);
}

function createWindow (opt = {})
{
	let options = Object.assign(
	{
		width: 1600,
		height: 1200,
		webViewTag: false,
		'web-security': true,
		webPreferences: {
			// preload: path.resolve('./preload.js'),
			nodeIntegration: true,
			enableRemoteModule: true,
			nodeIntegrationInWorker: true,
			spellcheck: (os.platform() == "darwin" ? true : false),
			contextIsolation: false
		}
	}, opt)

	let mainWindow = new BrowserWindow(options)
	windowsRegistry.push(mainWindow)

	if (__DEV__) 
	{
		console.log('createWindow', opt)
	}

	let ourl = url.format(
	{
		pathname: `${__dirname}/index.html`,
		protocol: 'file:',
		query: queryObj,
		slashes: true
	})
	
	mainWindow.loadURL(ourl)

	// Open the DevTools.
	if (__DEV__)
	{
		mainWindow.webContents.openDevTools()
	}

	mainWindow.on('close', (event) =>
	{
		const win = event.sender
		const index = windowsRegistry.indexOf(win)
		
		if (__DEV__) 
		{
			console.log('Window on close', index)
		}
		
		const contents = win.webContents

		if (contents != null)
		{
			contents.executeJavaScript('if(typeof global.__emt_isModified === \'function\'){global.__emt_isModified()}', true)
				.then((isModified) =>
				{
					if (__DEV__) 
					{
						console.log('__emt_isModified', isModified)
					}
					
					if (isModified)
					{
						var choice = dialog.showMessageBoxSync(
							win,
							{
								type: 'question',
								buttons: ['Cancel', 'Discard Changes'],
								title: 'Confirm',
								message: 'The document has unsaved changes. Do you really want to quit without saving?' //mxResources.get('allChangesLost')
							})
							
						if (choice === 1)
						{
							win.destroy()
						}
						else
						{
							cmdQPressed = false
						}
					}
					else
					{
						win.destroy()
					}
				})

			event.preventDefault()
		}
	})

	// Emitted when the window is closed.
	mainWindow.on('closed', (event/*:WindowEvent*/) =>
	{
		const index = windowsRegistry.indexOf(event.sender)
		
		if (__DEV__) 
		{
			console.log('Window closed idx:%d', index)
		}
		
		windowsRegistry.splice(index, 1)
	})
	
	return mainWindow
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', e =>
{
	//asynchronous
	ipcMain.on('asynchronous-message', (event, arg) =>
	{
		console.log(arg)  // prints "ping"
		event.sender.send('asynchronous-reply', 'pong')
	})
	//synchronous
	ipcMain.on('winman', (event, arg) =>
	{
		if (__DEV__) 
		{
			console.log('ipcMain.on winman', arg)
		}
		
		if (arg.action === 'newfile')
		{
			event.returnValue = createWindow(arg.opt).id
			
			return
		}
		
		event.returnValue = 'pong'
	})
	
    let argv = process.argv
    
    // https://github.com/electron/electron/issues/4690#issuecomment-217435222
    if (process.defaultApp != true)
    {
        argv.unshift(null)
    }

	var validFormatRegExp = /^(pdf|svg|png|jpeg|jpg|vsdx|xml)$/;
	
	function argsRange(val) 
	{
	  return val.split('..').map(Number);
	}
	
	try
	{
		program
	        .version(app.getVersion())
	        .usage('[options] [input file/folder]')
	        .allowUnknownOption() //-h and --help are considered unknown!!
	        .option('-c, --create', 'creates a new empty file if no file is passed')
	        .option('-k, --check', 'does not overwrite existing files')
	        .option('-x, --export', 'export the input file/folder based on the given options')
	        .option('-r, --recursive', 'for a folder input, recursively convert all files in sub-folders also')
	        .option('-o, --output <output file/folder>', 'specify the output file/folder. If omitted, the input file name is used for output with the specified format as extension')
	        .option('-f, --format <format>',
			    'if output file name extension is specified, this option is ignored (file type is determined from output extension, possible export formats are pdf, png, jpg, svg, vsdx, and xml)',
			    validFormatRegExp, 'pdf')
			.option('-q, --quality <quality>',
				'output image quality for JPEG (default: 90)', parseInt)
			.option('-t, --transparent',
				'set transparent background for PNG')
			.option('-e, --embed-diagram',
				'includes a copy of the diagram (for PNG and PDF formats only)')
			.option('-b, --border <border>',
				'sets the border width around the diagram (default: 0)', parseInt)
			.option('-s, --scale <scale>',
				'scales the diagram size', parseFloat)
			.option('--width <width>',
				'fits the generated image/pdf into the specified width, preserves aspect ratio.', parseInt)
			.option('--height <height>',
				'fits the generated image/pdf into the specified height, preserves aspect ratio.', parseInt)
			.option('--crop',
				'crops PDF to diagram size')
			.option('-a, --all-pages',
				'export all pages (for PDF format only)')
			.option('-p, --page-index <pageIndex>',
				'selects a specific page, if not specified and the format is an image, the first page is selected', parseInt)
			.option('-g, --page-range <from>..<to>',
				'selects a page range (for PDF format only)', argsRange)
			.option('-u, --uncompressed',
				'Uncompressed XML output (for XML format only)')
	        .parse(argv)
	}
	catch(e)
	{
		//On parse error, return [exit and commander will show the error message]
		return;
	}
	
	var options = program.opts();
	
    //Start export mode?
    if (options.export)
	{
    	var dummyWin = new BrowserWindow({
			show : false,
			webPreferences: {
				nodeIntegration: true,
				contextIsolation: false
			}
		});
    	
    	windowsRegistry.push(dummyWin);
    	
    	try
    	{
	    	//Prepare arguments and confirm it's valid
	    	var format = null;
	    	var outType = null;
	    	
	    	//Format & Output
	    	if (options.output)
			{
	    		try
	    		{
	    			var outStat = fs.statSync(options.output);
	    			
	    			if (outStat.isDirectory())
					{
	    				outType = {isDir: true};
					}
	    			else //If we can get file stat, then it exists
					{
	    				throw 'Error: Output file already exists';
					}
	    		}
	    		catch(e) //on error, file doesn't exist and it is not a dir
	    		{
	    			outType = {isFile: true};
	    			
	    			format = path.extname(options.output).substr(1);
					
					if (!validFormatRegExp.test(format))
					{
						format = null;
					}
	    		}
			}
	    	
	    	if (format == null)
			{
	    		format = options.format;
			}
	    	
	    	var from = null, to = null;
	    	
	    	if (options.pageIndex != null && options.pageIndex >= 0)
			{
	    		from = options.pageIndex;
			}
	    	else if (options.pageRage && options.pageRage.length == 2)
			{
	    		from = options.pageRage[0] >= 0 ? options.pageRage[0] : null;
	    		to = options.pageRage[1] >= 0 ? options.pageRage[1] : null;
			}

			var expArgs = {
				format: format,
				w: options.width > 0 ? options.width : null,
				h: options.height > 0 ? options.height : null,
				border: options.border > 0 ? options.border : 0,
				bg: options.transparent ? 'none' : '#ffffff',
				from: from,
				to: to,
				allPages: format == 'pdf' && options.allPages,
				scale: (options.crop && (options.scale == null || options.scale == 1)) ? 1.00001: (options.scale || 1), //any value other than 1 crops the pdf
				embedXml: options.embedDiagram? '1' : '0',
				jpegQuality: options.quality,
				uncompressed: options.uncompressed
			};

			var paths = program.args;
			
			// If a file is passed 
			if (paths !== undefined && paths[0] != null)
			{
				var inStat = null;
				
				try
				{
					inStat = fs.statSync(paths[0]);
				}
				catch(e)
				{
					throw 'Error: input file/directory not found';	
				}
				
				var files = [];
				
				function addDirectoryFiles(dir, isRecursive)
				{
					fs.readdirSync(dir).forEach(function(file) 
					{
						var filePath = path.join(dir, file);
						stat = fs.statSync(filePath);
						
						if (stat.isFile() && path.basename(filePath).charAt(0) != '.')
						{
							files.push(filePath);
						}
						if (stat.isDirectory() && isRecursive)
					    {
							addDirectoryFiles(filePath, isRecursive)
					    }
					});
				}
				
				if (inStat.isFile())
				{
					files.push(paths[0]);
				}
				else if (inStat.isDirectory())
				{
					addDirectoryFiles(paths[0], options.recursive);
				}

				if (files.length > 0)
				{
					var fileIndex = 0;
					
					function processOneFile()
					{
						var curFile = files[fileIndex];
						
						try
						{
							var ext = path.extname(curFile);
							
							expArgs.xml = fs.readFileSync(curFile, ext === '.png' || ext === '.vsdx' ? null : 'utf-8');
							
							if (ext === '.png')
							{
								expArgs.xml = Buffer.from(expArgs.xml).toString('base64');
								startExport();
							}
							else if (ext === '.vsdx')
							{
								dummyWin.loadURL(`file://${__dirname}/vsdxImporter.html`);
								
								const contents = dummyWin.webContents;

								contents.on('did-finish-load', function()
							    {
									contents.send('import', expArgs.xml);

									ipcMain.once('import-success', function(evt, xml)
						    	    {
										expArgs.xml = xml;
										startExport();
						    	    });
						    	    
						    	    ipcMain.once('import-error', function()
						    	    {
						    	    	console.error('Error: cannot import VSDX file: ' + curFile);
						    	    	next();
						    	    });
							    });
							}
							else
							{
								startExport();
							}
							
							function next()
							{
								fileIndex++;
								
								if (fileIndex < files.length)
								{
									processOneFile();
								}
								else
								{
									cmdQPressed = true;
									dummyWin.destroy();
								}
							};
							
							function startExport()
							{
								var mockEvent = {
									reply: function(msg, data)
									{
										try
										{
											if (data == null || data.length == 0)
											{
												console.error('Error: Export failed: ' + curFile);
											}
											else if (msg == 'export-success')
											{
												var outFileName = null;
												
												if (outType != null)
												{
													if (outType.isDir)
													{
														outFileName = path.join(options.output, path.basename(curFile)) + '.' + format;
													}
													else
													{
														outFileName = options.output;
													}
												}
												else if (inStat.isFile())
												{
													outFileName = path.join(path.dirname(paths[0]), path.basename(paths[0],
														path.extname(paths[0]))) + '.' + format;
													
												}
												else //dir
												{
													outFileName = path.join(path.dirname(curFile), path.basename(curFile,
														path.extname(curFile))) + '.' + format;
												}
												
												try
												{
													var counter = 0;
													var realFileName = outFileName;
													
													if (program.rawArgs.indexOf('-k') > -1 || program.rawArgs.indexOf('--check') > -1)
													{
														while (fs.existsSync(realFileName))
														{
															counter++;
															realFileName = path.join(path.dirname(outFileName), path.basename(outFileName,
																path.extname(outFileName))) + '-' + counter + path.extname(outFileName);
														}
													}
													
													fs.writeFileSync(realFileName, data, format == 'vsdx'? 'base64' : null, { flag: 'wx' });
													console.log(curFile + ' -> ' + outFileName);
												}
												catch(e)
												{
													console.error('Error writing to file: ' + outFileName);
												}
											}
											else
											{
												console.error('Error: ' + data + ': ' + curFile);
											}
											
											next();
										}
										finally
										{
											mockEvent.finalize();
										}
							    	}
								};

								exportDiagram(mockEvent, expArgs, true);
							};
						}
						catch(e)
						{
							console.error('Error reading file: ' + curFile);
							next();
						}
					}
					
					processOneFile();
				}
				else
				{
					throw 'Error: input file/directory not found or directory is empty';
				}
			}
			else
			{
				throw 'Error: An input file must be specified';
			}
    	}
    	catch(e)
    	{
    		console.error(e);
    		
    		cmdQPressed = true;
			dummyWin.destroy();
    	}
    	
    	return;
	}
    else if (program.rawArgs.indexOf('-h') > -1 || program.rawArgs.indexOf('--help') > -1 || program.rawArgs.indexOf('-V') > -1 || program.rawArgs.indexOf('--version') > -1) //To prevent execution when help/version arg is used
	{
    	return;
	}
    
    //Prevent multiple instances of the application (casuses issues with configuration)
    const gotTheLock = app.requestSingleInstanceLock()

    if (!gotTheLock) 
    {
    	app.quit()
    } 
    else 
    {
    	app.on('second-instance', (event, commandLine, workingDirectory) => {
    		//Create another window
    		let win = createWindow()

			let loadEvtCount = 0;
			
			function loadFinished()
			{
				loadEvtCount++;
				
				if (loadEvtCount == 2)
				{
	    	    	//Open the file if new app request is from opening a file
	    	    	var potFile = commandLine.pop();
	    	    	
	    	    	if (fs.existsSync(potFile))
	    	    	{
	    	    		win.webContents.send('args-obj', {args: [potFile]});
	    	    	}
				}
			}
			
			//Order of these two events is not guaranteed, so wait for them async.
			//TOOD There is still a chance we catch another window 'app-load-finished' if user created multiple windows quickly 
	    	ipcMain.once('app-load-finished', loadFinished);
    	    
    	    win.webContents.on('did-finish-load', function()
    	    {    			
    	        win.webContents.zoomFactor = 1;
    	        win.webContents.setVisualZoomLevelLimits(1, 1);
				loadFinished();
    	    });
    	})
    }

    let win = createWindow()
    
	let loadEvtCount = 0;
			
	function loadFinished()
	{
		loadEvtCount++;
		
		if (loadEvtCount == 2)
		{
			//Sending entire program is not allowed in Electron 9 as it is not native JS object
			win.webContents.send('args-obj', {args: program.args, create: options.create});
		}
	}
	
	//Order of these two events is not guaranteed, so wait for them async.
	//TOOD There is still a chance we catch another window 'app-load-finished' if user created multiple windows quickly 
	ipcMain.once('app-load-finished', loadFinished);

    win.webContents.on('did-finish-load', function()
    {
    	if (firstWinFilePath != null)
		{
    		if (program.args != null)
    		{
    			program.args.push(firstWinFilePath);
    		}
    		else
			{
    			program.args = [firstWinFilePath];
			}
		}
    	
    	firstWinLoaded = true;
    	
        win.webContents.zoomFactor = 1;
        win.webContents.setVisualZoomLevelLimits(1, 1);
		loadFinished();
    });
	
    let updateNoAvailAdded = false;
    
	let checkForUpdates = {
		label: 'Check for updates',
		click() 
		{ 
			autoUpdater.checkForUpdates();
			store.set('dontCheckUpdates', false);
			
			if (!updateNoAvailAdded) 
			{
				updateNoAvailAdded = true;
				autoUpdater.on('update-not-available', (info) => {
					dialog.showMessageBox(
						{
							type: 'info',
							title: 'No updates found',
							message: 'You application is up-to-date',
						})
				})
			}
		}
	}

	let template = [{
	    label: app.name,
	    submenu: [
	      {
	        label: 'Website',
	        click() { shell.openExternal('https://about.draw.io'); }
	      },
	      {
	        label: 'Support',
	        click() { shell.openExternal('https://about.draw.io/support'); }
		  },
		  checkForUpdates,
	      {
	        type: 'separator'
	      },
	      {
	        label: 'Quit',
	        accelerator: 'CmdOrCtrl+Q',
	        click() { 
						cmdQPressed = true;
						app.quit(); 
					}
	      }]
	}]
	
	if (disableUpdate)
	{
		template[0].submenu.splice(2, 1);
	}
	
	if (process.platform === 'darwin')
	{
	    template = [{
	      label: app.name,
	      submenu: [
	        {
	          label: 'About ' + app.name,
	          click() { shell.openExternal('https://about.draw.io'); }
	        },
	        {
	          label: 'Support',
	          click() { shell.openExternal('https://about.draw.io/support'); }
			},
			checkForUpdates,
			{ type: 'separator' },
	        { role: 'hide' },
	        { role: 'hideothers' },
	        { role: 'unhide' },
	        { type: 'separator' },
	        { role: 'quit' }
	      ]
	    }, {
	      label: 'Edit',
	      submenu: [
			{ role: 'undo' },
			{ role: 'redo' },
			{ type: 'separator' },
			{ role: 'cut' },
			{ role: 'copy' },
			{ role: 'paste' },
			{ role: 'pasteAndMatchStyle' },
			{ role: 'selectAll' }
	      ]
	    }]
	    
	    if (disableUpdate)
		{
			template[0].submenu.splice(2, 1);
		}
	}
	
	const menuBar = menu.buildFromTemplate(template)
	menu.setApplicationMenu(menuBar)

	autoUpdater.setFeedURL({
		provider: 'github',
		repo: 'drawio-desktop',
		owner: 'jgraph'
	})
	
	if (!disableUpdate && !store.get('dontCheckUpdates'))
	{
		autoUpdater.checkForUpdates()
	}
})

//Quit from the dock context menu should quit the application directly
if (process.platform === 'darwin') 
{
	app.on('before-quit', function() {
		cmdQPressed = true;
	});	
}

// Quit when all windows are closed.
app.on('window-all-closed', function ()
{
	if (__DEV__) 
	{
		console.log('window-all-closed', windowsRegistry.length)
	}
	
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (cmdQPressed || process.platform !== 'darwin')
	{
		app.quit()
	}
})

app.on('activate', function ()
{
	if (__DEV__) 
	{
		console.log('app on activate', windowsRegistry.length)
	}
	
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (windowsRegistry.length === 0)
	{
		createWindow()
	}
})

app.on('will-finish-launching', function()
{
	app.on("open-file", function(event, path) 
	{
	    event.preventDefault();

	    if (firstWinLoaded)
	    {
		    let win = createWindow();
		    
			let loadEvtCount = 0;
			
			function loadFinished()
			{
				loadEvtCount++;
				
				if (loadEvtCount == 2)
				{
	    	    	win.webContents.send('args-obj', {args: [path]});
				}
			}
			
			//Order of these two events is not guaranteed, so wait for them async.
			//TOOD There is still a chance we catch another window 'app-load-finished' if user created multiple windows quickly 
	    	ipcMain.once('app-load-finished', loadFinished);
    	    
		    win.webContents.on('did-finish-load', function()
		    {
		        win.webContents.zoomFactor = 1;
		        win.webContents.setVisualZoomLevelLimits(1, 1);
				loadFinished();
		    });
	    }
	    else
		{
	    	firstWinFilePath = path
		}
	});
});

autoUpdater.on('error', e => log.error('@error@\n', e))

autoUpdater.on('update-available', (a, b) =>
{
	log.info('@update-available@\n', a, b)
	
	dialog.showMessageBox(
	{
		type: 'question',
		buttons: ['Ok', 'Cancel', 'Don\'t Ask Again'],
		title: 'Confirm Update',
		message: 'Update available.\n\nWould you like to download and install new version?',
		detail: 'Application will automatically restart to apply update after download',
	}).then( result =>
	{
		if (result.response === 0)
		{
			autoUpdater.downloadUpdate()
			
			var progressBar = new ProgressBar({
				title: 'draw.io Update',
			    text: 'Downloading draw.io update...'
			});
			
			function reportUpdateError(e)
			{
				progressBar.detail = 'Error occured while fetching updates. ' + (e && e.message? e.message : e)
				progressBar._window.setClosable(true);
			}

			autoUpdater.on('error', e => {
				if (progressBar._window != null)
				{
					reportUpdateError(e);
				}
				else
				{
					progressBar.on('ready', function() {
						reportUpdateError(e);
					});
				}
			})

			var firstTimeProg = true;
			
			autoUpdater.on('download-progress', (d) => {
				//On mac, download-progress event is not called, so the indeterminate progress will continue until download is finished
				log.info('@update-progress@\n', d);
				
				var percent = d.percent;
				
				if (percent)
				{
					percent = Math.round(percent * 100)/100;
				}
				
				if (firstTimeProg)
				{
					firstTimeProg = false;
					progressBar.close();

					progressBar = new ProgressBar({
						indeterminate: false,
						title: 'draw.io Update',
						text: 'Downloading draw.io update...',
						detail: `${percent}% ...`,
						initialValue: percent
					});
				
					progressBar
							.on('completed', function() {
								progressBar.detail = 'Download completed.';
							})
							.on('aborted', function(value) {
								log.info(`progress aborted... ${value}`);
							})
							.on('progress', function(value) {
								progressBar.detail = `${value}% ...`;
							})
							.on('ready', function() {
								//InitialValue doesn't set the UI! so this is needed to render it correctly
								progressBar.value = percent;
							});
				}
				else 
				{
					progressBar.value = percent;
				}
			});

		    autoUpdater.on('update-downloaded', (info) => {
				if (!progressBar.isCompleted())
				{
					progressBar.close()
				}
		
				log.info('@update-downloaded@\n', info)
				// Ask user to update the app
				dialog.showMessageBox(
				{
					type: 'question',
					buttons: ['Install', 'Later'],
					defaultId: 0,
					message: 'A new version of ' + app.name + ' has been downloaded',
					detail: 'It will be installed the next time you restart the application',
				}).then(result =>
				{
					if (result.response === 0)
					{
						setTimeout(() => autoUpdater.quitAndInstall(), 1)
					}
				})
		    });
		}
		else if (result.response === 2)
		{
			//save in settings don't check for updates
			log.info('@dont check for updates!@')
			store.set('dontCheckUpdates', true)
		}
	})
})

//Pdf export
const MICRON_TO_PIXEL = 264.58 		//264.58 micron = 1 pixel
const PNG_CHUNK_IDAT = 1229209940;
const LARGE_IMAGE_AREA = 30000000;

//NOTE: Key length must not be longer than 79 bytes (not checked)
function writePngWithText(origBuff, key, text, compressed, base64encoded)
{
	var isDpi = key == 'dpi';
	var inOffset = 0;
	var outOffset = 0;
	var data = text;
	var dataLen = isDpi? 9 : key.length + data.length + 1; //we add 1 zeros with non-compressed data, for pHYs it's 2 of 4-byte-int + 1 byte
	
	//prepare compressed data to get its size
	if (compressed)
	{
		data = zlib.deflateRawSync(encodeURIComponent(text));
		dataLen = key.length + data.length + 2; //we add 2 zeros with compressed data
	}
	
	var outBuff = Buffer.allocUnsafe(origBuff.length + dataLen + 4); //4 is the header size "zTXt", "tEXt" or "pHYs"
	
	try
	{
		var magic1 = origBuff.readUInt32BE(inOffset);
		inOffset += 4;
		var magic2 = origBuff.readUInt32BE(inOffset);
		inOffset += 4;
		
		if (magic1 != 0x89504e47 && magic2 != 0x0d0a1a0a)
		{
			throw new Error("PNGImageDecoder0");
		}
		
		outBuff.writeUInt32BE(magic1, outOffset);
		outOffset += 4;
		outBuff.writeUInt32BE(magic2, outOffset);
		outOffset += 4;
	}
	catch (e)
	{
		log.error(e.message, {stack: e.stack});
		throw new Error("PNGImageDecoder1");
	}

	try
	{
		while (inOffset < origBuff.length)
		{
			var length = origBuff.readInt32BE(inOffset);
			inOffset += 4;
			var type = origBuff.readInt32BE(inOffset)
			inOffset += 4;

			if (type == PNG_CHUNK_IDAT)
			{
				// Insert zTXt chunk before IDAT chunk
				outBuff.writeInt32BE(dataLen, outOffset);
				outOffset += 4;
				
				var typeSignature = isDpi? 'pHYs' : (compressed ? "zTXt" : "tEXt");
				outBuff.write(typeSignature, outOffset);
				
				outOffset += 4;

				if (isDpi)
				{
					var dpm = Math.round(parseInt(text) / 0.0254) || 3937; //One inch is equal to exactly 0.0254 meters. 3937 is 100dpi

					outBuff.writeInt32BE(dpm, outOffset);
					outBuff.writeInt32BE(dpm, outOffset + 4);
					outBuff.writeInt8(1, outOffset + 8);
					outOffset += 9;

					data = Buffer.allocUnsafe(9);
					data.writeInt32BE(dpm, 0);
					data.writeInt32BE(dpm, 4);
					data.writeInt8(1, 8);
				}
				else
				{
					outBuff.write(key, outOffset);
					outOffset += key.length;
					outBuff.writeInt8(0, outOffset);
					outOffset ++;

					if (compressed)
					{
						outBuff.writeInt8(0, outOffset);
						outOffset ++;
						data.copy(outBuff, outOffset);
					}
					else
					{
						outBuff.write(data, outOffset);	
					}

					outOffset += data.length;				
				}

				var crcVal = 0xffffffff;
				crcVal = crc.crcjam(typeSignature, crcVal);
				crcVal = crc.crcjam(data, crcVal);

				// CRC
				outBuff.writeInt32BE(crcVal ^ 0xffffffff, outOffset);
				outOffset += 4;

				// Writes the IDAT chunk after the zTXt
				outBuff.writeInt32BE(length, outOffset);
				outOffset += 4;
				outBuff.writeInt32BE(type, outOffset);
				outOffset += 4;

				origBuff.copy(outBuff, outOffset, inOffset);

				// Encodes the buffer using base64 if requested
				return base64encoded? outBuff.toString('base64') : outBuff;
			}

			outBuff.writeInt32BE(length, outOffset);
			outOffset += 4;
			outBuff.writeInt32BE(type, outOffset);
			outOffset += 4;

			origBuff.copy(outBuff, outOffset, inOffset, inOffset + length + 4);// +4 to move past the crc
			
			inOffset += length + 4;
			outOffset += length + 4;
		}
	}
	catch (e)
	{
		log.error(e.message, {stack: e.stack});
		throw e;
	}
}

//TODO Create a lightweight html file similar to export3.html for exporting to vsdx
function exportVsdx(event, args, directFinalize)
{
	let win = createWindow({
		show : false
	});

	let loadEvtCount = 0;
			
	function loadFinished()
	{
		loadEvtCount++;
		
		if (loadEvtCount == 2)
		{
	    	win.webContents.send('export-vsdx', args);
	    	
	        ipcMain.once('export-vsdx-finished', (evt, data) =>
			{
				var hasError = false;
				
				if (data == null)
				{
					hasError = true;
				}
				
				//Set finalize here since it is call in the reply below
				function finalize()
				{
					win.destroy();
				};
				
				if (directFinalize === true)
				{
					event.finalize = finalize;
				}
				else
				{
					//Destroy the window after response being received by caller
					ipcMain.once('export-finalize', finalize);
				}
				
				if (hasError)
				{
					event.reply('export-error');
				}
				else
				{
					event.reply('export-success', data);
				}
			});
		}
	}
	
	//Order of these two events is not guaranteed, so wait for them async.
	//TOOD There is still a chance we catch another window 'app-load-finished' if user created multiple windows quickly 
	ipcMain.once('app-load-finished', loadFinished);
    win.webContents.on('did-finish-load', loadFinished);
};

async function mergePdfs(pdfFiles, xml)
{
	//Pass throgh single files
	if (pdfFiles.length == 1 && xml == null)
	{
		return pdfFiles[0];
	}

	try 
	{
		const pdfDoc = await PDFDocument.create();
		pdfDoc.setCreator('diagrams.net');

		if (xml != null)
		{	
			//Embed diagram XML as file attachment
			await pdfDoc.attach(Buffer.from(xml).toString('base64'), 'diagram.xml', {
				mimeType: 'application/vnd.jgraph.mxfile',
				description: 'Diagram Content'
			  });
		}

		for (var i = 0; i < pdfFiles.length; i++)
		{
			const pdfFile = await PDFDocument.load(pdfFiles[i].buffer);
			const pages = await pdfDoc.copyPages(pdfFile, pdfFile.getPageIndices());
			pages.forEach(p => pdfDoc.addPage(p));
		}

		const pdfBytes = await pdfDoc.save();
        return Buffer.from(pdfBytes);
    }
	catch(e)
	{
        throw new Error('Error during PDF combination: ' + e.message);
    }
}

//TODO Use canvas to export images if math is not used to speedup export (no capturePage). Requires change to export3.html also
function exportDiagram(event, args, directFinalize)
{
	if (args.format == 'vsdx')
	{
		exportVsdx(event, args, directFinalize);
		return;
	}
	
	var browser = null;
	
	try
	{
		browser = new BrowserWindow({
			webPreferences: {
				backgroundThrottling: false,
				nodeIntegration: true,
				contextIsolation: false
			},
			show : false,
			frame: false,
			enableLargerThanScreen: true,
			transparent: args.format == 'png' && (args.bg == null || args.bg == 'none'),
			parent: windowsRegistry[0] //set parent to first opened window. Not very accurate, but useful when all visible windows are closed
		});

		browser.loadURL(`file://${__dirname}/export3.html`);

		const contents = browser.webContents;
		var pageByPage = (args.format == 'pdf' && !args.print), from, pdfs;

		if (pageByPage)
		{
			from = args.allPages? 0 : parseInt(args.from || 0);
			to = args.allPages? 1000 : parseInt(args.to || 1000) + 1; //The 'to' will be corrected later
			pdfs = [];

			args.from = from;
			args.to = from;
			args.allPages = false;
		}
			
		contents.on('did-finish-load', function()
	    {
			//Set finalize here since it is call in the reply below
			function finalize()
			{
				browser.destroy();
			};
			
			if (directFinalize === true)
			{
				event.finalize = finalize;
			}
			else
			{
				//Destroy the window after response being received by caller
				ipcMain.once('export-finalize', finalize);
			}

			function renderingFinishHandler(evt, renderInfo)
			{
				var pageCount = renderInfo.pageCount, bounds = null;
				//For some reason, Electron 9 doesn't send this object as is without stringifying. Usually when variable is external to function own scope
				try
				{
					bounds = JSON.parse(renderInfo.bounds);
				}
				catch(e)
				{
					bounds = null;
				}
				
				var pdfOptions = {pageSize: 'A4'};
				var hasError = false;
				
				if (bounds == null || bounds.width < 5 || bounds.height < 5) //very small page size never return from printToPDF
				{
					//A workaround to detect errors in the input file or being empty file
					hasError = true;
				}
				else
				{
					//Chrome generates Pdf files larger than requested pixels size and requires scaling
					var fixingScale = 0.959;
	
					var w = Math.ceil(bounds.width * fixingScale);
					
					// +0.1 fixes cases where adding 1px below is not enough
					// Increase this if more cropped PDFs have extra empty pages
					var h = Math.ceil(bounds.height * fixingScale + 0.1);
					
					pdfOptions = {
						printBackground: true,
						pageSize : {
							width: w * MICRON_TO_PIXEL,
							height: (h + 2) * MICRON_TO_PIXEL //the extra 2 pixels to prevent adding an extra empty page						
						},
						marginsType: 1 // no margin
					}
				}
				
				var base64encoded = args.base64 == '1';
				
				if (hasError)
				{
					event.reply('export-error');
				}
				else if (args.format == 'png' || args.format == 'jpg' || args.format == 'jpeg')
				{
					//Adds an extra pixel to prevent scrollbars from showing
					var newBounds = {width: Math.ceil(bounds.width + bounds.x) + 1, height: Math.ceil(bounds.height + bounds.y) + 1};
					browser.setBounds(newBounds);
					
					//TODO The browser takes sometime to show the graph (also after resize it takes some time to render)
					//	 	1 sec is most probably enough (for small images, 5 for large ones) BUT not a stable solution
					setTimeout(function()
					{
						browser.capturePage().then(function(img)
						{
							//Image is double the given bounds, so resize is needed!
							var tScale = 1;

							//If user defined width and/or height, enforce it precisely here. Height override width
							if (args.h)
							{
								tScale = args.h / newBounds.height;
							}
							else if (args.w)
							{
								tScale = args.w / newBounds.width;
							}
							
							newBounds.width *= tScale;
							newBounds.height *= tScale;
							img = img.resize(newBounds);

							var data = args.format == 'png'? img.toPNG() : img.toJPEG(args.jpegQuality || 90);
							
							if (args.dpi != null && args.format == 'png')
							{
								data = writePngWithText(data, 'dpi', args.dpi);
							}
							
							if (args.embedXml == "1" && args.format == 'png')
							{
								data = writePngWithText(data, "mxGraphModel", args.xml, true,
										base64encoded);
							}
							else
							{
								if (base64encoded)
								{
									data = data.toString('base64');
								}
							}
							
							event.reply('export-success', data);
						});
					}, bounds.width * bounds.height < LARGE_IMAGE_AREA? 1000 : 5000);
				}
				else if (args.format == 'pdf')
				{
					if (args.print)
					{
						pdfOptions = {
							scaleFactor: args.pageScale,
							printBackground: true,
							pageSize : {
								width: args.pageWidth * MICRON_TO_PIXEL,
								//This height adjustment fixes the output. TODO Test more cases
								height: (args.pageHeight * 1.025) * MICRON_TO_PIXEL
							},
							marginsType: 1 // no margin
						};
						 
						contents.print(pdfOptions, (success, errorType) => 
						{
							//Consider all as success
							event.reply('export-success', {});
						});
					}
					else
					{
						contents.printToPDF(pdfOptions).then(async (data) => 
						{
							pdfs.push(data);
							to = to > pageCount? pageCount : to;
							from++;
							
							if (from < to)
							{
								args.from = from;
								args.to = from;
								ipcMain.once('render-finished', renderingFinishHandler);
								contents.send('render', args);
							}
							else
							{
								data = await mergePdfs(pdfs, args.embedXml == '1' ? args.xml : null);
								event.reply('export-success', data);
							}
						})
						.catch((error) => 
						{
							event.reply('export-error', error);
						});
					}
				}
				else if (args.format == 'svg')
				{
					contents.send('get-svg-data');
					
					ipcMain.once('svg-data', (evt, data) =>
					{
						event.reply('export-success', data);
					});
				}
				else
				{
					event.reply('export-error', 'Error: Unsupported format');
				}
			};
			
			ipcMain.once('render-finished', renderingFinishHandler);

			if (args.format == 'xml')
			{
				ipcMain.once('xml-data', (evt, data) =>
				{
					event.reply('export-success', data);
				});
				
				ipcMain.once('xml-data-error', () =>
				{
					event.reply('export-error');
				});
			}
			
			args.border = args.border || 0;
			args.scale = args.scale || 1;
			
			contents.send('render', args);
	    });
	}
	catch (e)
	{
		if (browser != null)
		{
			browser.destroy();
		}

		event.reply('export-error', e);
		console.log('export-error', e);
	}
};

ipcMain.on('export', exportDiagram);