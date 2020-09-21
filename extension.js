#!/usr/bin/env node
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const SOURCES_DIRECTORY = path.join(__dirname, './template');  //源目录

let TARGET_SRC, pageUrl

// 拷贝核心函数
var copy = function (src, dst) {
    let paths = fs.readdirSync(src); //同步读取当前目录
    paths.forEach(function (path) {
        var _src = src + '/' + path;
        var _dst = dst + '/' + path;
        fs.stat(_src, function (err, stats) {  //stats  该对象 包含文件属性
            if (err) throw err;
            if (stats.isFile()) { //如果是个文件则拷贝 
                let readable = fs.createReadStream(_src);//创建读取流
                let writable = fs.createWriteStream(_dst);//创建写入流
                readable.pipe(writable);
            } else if (stats.isDirectory()) { //是目录则 递归 
                checkDirectory(_src, _dst, copy);
            }
        });
    });
}

// 遍历拷贝
var checkDirectory = function (src, dst, callback) {
    fs.access(dst, fs.constants.F_OK, (err) => {
        if (err) {
            fs.mkdirSync(dst);
            callback(src, dst);
        } else {
            callback(src, dst);
        }
    });
    vscode.window.showInformationMessage('page created successfully!');
    return true
};

// 提示
var prompt = function () {
    if (fs.existsSync(TARGET_SRC)) {
        vscode.window.showInformationMessage('Error: 目标已存在,请更换名称');
    } else {
        return checkDirectory(SOURCES_DIRECTORY, TARGET_SRC, copy);
    }
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "react-template" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    const fc = vscode.commands.registerCommand('extension.createYSSCRUDPage', function (param) {
        // The code you place here will be executed every time your command is executed
        const options = {
            prompt: "Please input the page name: ",
            placeHolder: "page-name"
        }
        
        vscode.window.showInputBox(options).then(value => {
            if (!value) return;

            const pageName = value;
            pageUrl = pageName;
          //  vscode.window.showInformationMessage(param.fsPath + '\\' + pageUrl); 
            TARGET_SRC = path.join('', param.fsPath + '\\' + pageUrl);
            //vscode.window.showInformationMessage(TARGET_SRC); 
            return prompt();
        });
    });

    context.subscriptions.push(fc);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;