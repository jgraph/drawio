const fs = require('fs')
const path = require('path')
const electron = require('electron')
const ipcMain = electron.ipcMain
const dialog = electron.dialog
const app = electron.app
const BrowserWindow = electron.BrowserWindow

let windowsRegistry = []

function createWindow (opt = {}) {
	let options = Object.assign({
		width: 1600,
		height: 1200,
		'web-security': false,
	}, opt)

	let mainWindow = new BrowserWindow(options)
	windowsRegistry.push(mainWindow)

	console.log('createWindow', opt)

	// and load the index.html of the app.
	mainWindow.loadURL(
		`file://${__dirname}/index.html?dev=1&test=1&db=0&gapi=0&od=0&analytics=0&picker=0&mode=device&browser=0&p=electron`)

	// Open the DevTools.
	mainWindow.webContents.openDevTools()

	mainWindow.on('close', (event/*:WindowEvent*/) => {
		const win = event.sender
		const index = windowsRegistry.indexOf(win)
		console.log('Window on close idx:%d', index)
		const contents = win.webContents
		if (contents != null) {
			contents.executeJavaScript(`global.__emt_isModified()`, true,
				isModified => {
					console.log('__emt_isModified', isModified)
					if (isModified) {
						var choice = dialog.showMessageBox(
							win,
							{
								type: 'question',
								buttons: ['Yes', 'No'],
								title: 'Confirm',
								message: 'All Changes will be lost' //mxResources.get('allChangesLost')
							})
						if (choice === 0) {
							win.destroy()
						}
					} else {
						win.destroy()
					}
				})
			event.preventDefault()
		}
	})

	// Emitted when the window is closed.
	mainWindow.on('closed', (event/*:WindowEvent*/) => {
		const index = windowsRegistry.indexOf(event.sender)
		console.log('Window closed idx:%d', index)
		windowsRegistry.splice(index, 1)
	})

	return mainWindow.id
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', e => {
	//asynchronous
	ipcMain.on('asynchronous-message', (event, arg) => {
		console.log(arg)  // prints "ping"
		event.sender.send('asynchronous-reply', 'pong')
	})
	//synchronous
	ipcMain.on('winman', (event, arg) => {
		console.log('ipcMain.on winman', arg)
		if (arg.action === 'newfile') {
			event.returnValue = createWindow(arg.opt)
			return
		}
		event.returnValue = 'pong'
	})
	createWindow()
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
	console.log('window-all-closed', windowsRegistry.length)
	// On OS X it is common for applications and their menu bar
	// to stay active until the user quits explicitly with Cmd + Q
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', function () {
	console.log('app on activate', windowsRegistry.length)
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (windowsRegistry.length === 0) {
		createWindow()
	}
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
