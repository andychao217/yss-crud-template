#!/usr/bin/env node
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const SOURCES_DIRECTORY = path.join(__dirname, './template');  //源目录

let TARGET_SRC, pageUrl

/***替换模板内容 */
let replaceFileStrin = function (string) {
    let text = string.toString();
    text = text.replace(/\$PageName/g, pageUrl);
    return text;
}

// 拷贝核心函数
let copy = function (src, dst) {
    let paths = fs.readdirSync(src); //同步读取当前目录
    paths.forEach(function (path) {
        let _src = src + '/' + path;
        let _dst = dst + '/' + path;
        fs.stat(_src, function (err, stats) {  //stats  该对象 包含文件属性
            if (err) throw err;
            if (stats.isFile()) { //如果是个文件则拷贝 
                let readable = fs.createReadStream(_src);//创建读取流
                let writable = fs.createWriteStream(_dst);//创建写入流
                readable.on('data',(data)=>{
                    writable.write(replaceFileStrin(data)); //替换模板内容
                })
                // readable.close();
                // writable.end();
            } else if (stats.isDirectory()) { //是目录则 递归 
                checkDirectory(_src, _dst, copy);
            }
        });
    });
}

// 遍历拷贝
let checkDirectory = function (src, dst, callback) {
    fs.access(dst, fs.constants.F_OK, (err) => {
        if (err) {
            fs.mkdirSync(dst);
            callback(src, dst);
        } else {
            callback(src, dst);
        }
    });
    vscode.window.showInformationMessage('page created successfully!');
    return true;
};

// 提示
let prompt = function () {
    if (fs.existsSync(TARGET_SRC)) {
        // 检测是否存在当前文件夹
        vscode.window.showInformationMessage('Error: 目标已存在,请更换名称');
    } else {
        return checkDirectory(SOURCES_DIRECTORY, TARGET_SRC, copy);
    }
}

function getWebviewContent() {
    return `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Get to know Andy Chao</title>
        </head>
        <body>
            <iframe 
                width="100%"
                frameborder="0" 
                allowtransparency="yes" 
                src="https://www.andychao217.cn"
                style="height: 100vh"
            >
            </iframe>
        </body>
    </html>`;
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
            
            pageUrl = value;
          //  vscode.window.showInformationMessage(param.fsPath + '\\' + pageUrl); 
            TARGET_SRC = path.join('', param.fsPath + '\\' + pageUrl);
            //vscode.window.showInformationMessage(TARGET_SRC); 
            return prompt();
        });
    });
    context.subscriptions.push(fc);

    const showAndychao217 = vscode.commands.registerCommand('extension.showAndychao217', function (uri) {
        // 工程目录一定要提前获取，因为创建了webview之后activeTextEditor会不准确
        const panel = vscode.window.createWebviewPanel(
            'webView', // viewType
            "Who is Andychao217 ?", // 视图标题
            vscode.ViewColumn.One, // 显示在编辑器的哪个部位
            {
                enableScripts: true, // 启用JS，默认禁用
                retainContextWhenHidden: true, // webview被隐藏时保持状态，避免被重置
            }
        );
        panel.webview.html = getWebviewContent();
    });
    context.subscriptions.push(showAndychao217);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
    //
}
exports.deactivate = deactivate;