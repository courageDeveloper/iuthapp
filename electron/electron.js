'use strict';
const electron = require('electron');
// Module to control application life.
const {
    app } = electron;
// Module to create native browser window.
const {
    BrowserWindow
} = electron;
let win;
let frameName = 'modal';
const path = require('path');
const url = require('url');

// SET ENV
process.env.NODE_ENV = 'production';

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1024,
        height: 600,
        //icon: __dirname + '/../dist/assets/icons/win/hospital.ico',
        title: "IUTH Account Manager",
        backgroundColor: 'white',
        webPreferences: {
            nativeWindowOpen: true
        },
        // Boolean - Specify `false` to create a [Frameless Window](https://github.com/atom/electron/blob/master/docs/api/frameless-window.md). Default is `true`. 
        //frame: false,
        // Boolean - Show window in the center of the screen. 
        center: true,
        // [NativeImage](https://github.com/atom/electron/blob/master/docs/api/native-image.md) - The window icon, when omitted on Windows the executable's icon would be used as window icon. 
        icon: 'assets/img/IUTHlogo.ico',
        // Boolean - When setting `false`, it will disable the same-origin policy (Usually using testing websites by people), and set `allowDisplayingInsecureContent` and `allowRunningInsecureContent` to `true` if these two options are not set by user. Default is `true`. 
        webSecurity: false,

        node: {
            __dirname: false
        },

        // Boolean - Allow an https page to display content like images from http URLs. Default is `false`. 
        allowDisplayingInsecureContent: true,

        // Boolean - Allow a https page to run JavaScript, CSS or plugins from http URLs. Default is `false`. 
        allowRunningInsecureContent: true,
    });

    win.maximize();
    //var url = 'file://' + __dirname + '/../www/index.html';
    /* var Args = process.argv.slice(2);
    Args.forEach(function (val) {
        if (val === "test") {
            url = 'http://localhost:8100'
        }
    }); */

    // and load the index.html of the app.
    //win.loadURL(url);
    //win.loadURL('file://' + __dirname + '/index.html');
    /*  win.loadURL(url.format({
         protocol: 'file:',
         pathname: path.join(__dirname, '/index.html'),
         slashes: true
     })); */

    var url = 'file://' + __dirname + '/../public/index.html';
    setTimeout(() => {
        win.loadURL(url);
    }, 2000); // 1 second wasn't enough lol
    // Open the DevTools.
if(process.env.NODE_ENV == 'development'){
    win.webContents.openDevTools();
}
else if(process.env.NODE_ENV == 'production'){
     console.log('Production Mode');
     //win.removeMenu();  //For electron 5 and above.
}
    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
    });

   /*  win.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
        if (frameName === 'modal') {
            // open window as modal
            event.preventDefault()
            Object.assign(options, {
                modal: true,
                parent: win,
                width: 100,
                height: 100
            })
            event.newGuest = new BrowserWindow(options)
        }
    }) */
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});