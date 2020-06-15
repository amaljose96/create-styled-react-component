const vscode = require("vscode");
var path = require("path");
var fs = require("fs");
const prettifyComponentName = require("./utils/prettifyComponentName");
const validateComponentName = require("./utils/validateComponentName");
const filesToCreate = ["index.js", "styles.js", "__tests__/$ComponentName$.test.js"];

function createComponentFromCommand() {
  if (!vscode.window.activeTextEditor) {
    vscode.window.showErrorMessage("You dont have an active editor window open");
    return;
  }
  let currentFileName = vscode.window.activeTextEditor.document.fileName;
  let directory = path.dirname(currentFileName);
  createComponent(directory);
}
function createComponentFromMenu(currentFileName){
  let stats=fs.statSync(currentFileName);
  let directory = stats.isDirectory() ? currentFileName : path.dirname(currentFileName);
  createComponent(directory);
}

function createComponent(baseDirectory) {
  vscode.window
    .showInputBox({
      prompt: "Enter component name",
      validateInput: validateComponentName,
    })
    .then((componentName) => {
      if(!componentName){
        vscode.window.showWarningMessage("Component Creation Cancelled by User.")
        return ;
      }
      componentName = prettifyComponentName(componentName);
      let componentDirectory = baseDirectory + "/" + componentName;
      try{
        fs.mkdirSync(componentDirectory);
        fs.mkdirSync(componentDirectory + "/__tests__");
        filesToCreate.forEach((fileName) => {
          var contents = require("./contents/" + fileName);
          let createdFileName = componentDirectory + "/" + fileName;
          contents = contents.split("$ComponentName$").join(componentName);
          createdFileName = createdFileName
            .split("$ComponentName$")
            .join(componentName);
          fs.writeFileSync(createdFileName, contents);
        });
      }catch(e){
        vscode.window.showErrorMessage("File Operations Failed",e)
        console.error("File Operations Failed",e);
      }
      
    });
}

module.exports = {
  createComponentFromCommand,
  createComponentFromMenu
};
