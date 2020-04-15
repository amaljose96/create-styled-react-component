const vscode = require("vscode");
var path = require("path");
var fs = require("fs");
const prettifyComponentName = require("./utils/prettifyComponentName");
const validateComponentName = require("./utils/validateComponentName");
const filesToCreate = ["index.js", "styles.js", "__tests__/$ComponentName$.js"];

function createComponentFromCommand() {
  if (!vscode.window.activeTextEditor) {
    console.error("No Window Open");
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
        return ;
      }
      componentName = prettifyComponentName(componentName);
      let componentDirectory = baseDirectory + "/" + componentName;
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
    });
}

module.exports = {
  createComponentFromCommand,
  createComponentFromMenu
};
