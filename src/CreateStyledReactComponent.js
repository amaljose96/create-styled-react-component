const vscode = require("vscode");
var path = require("path");
var fs = require("fs");
const prettifyComponentName = require("./utils/prettifyComponentName");
const validateComponentName = require("./utils/validateComponentName");
const templates=require("./templates.json");
const camelToSnakeCase = require("./utils/camelToSnakeCase");

function getDirectoryFromMenu(currentFileName){
  let stats=fs.statSync(currentFileName);
  let directory = stats.isDirectory() ? currentFileName : path.dirname(currentFileName);
  return directory;
}
function getComponentName(){
  return  vscode.window
  .showInputBox({
    title: "Enter component name",
    validateInput: validateComponentName,
  }) .then((componentName) => {
    if(!componentName){
      vscode.window.showWarningMessage("Component Creation Cancelled by User.")
      throw "Component Creation Cancelled by User.";
    }
    return prettifyComponentName(componentName);
  });
}
function getTemplateFromCommand(){
  return vscode.window.showQuickPick(Object.keys(templates),{title:"Choose Template"}).then((selectedTemplate)=>{
    console.log("Selected ",selectedTemplate)
    return selectedTemplate
  })
}

/*
componentName - Input ComponentName
Template Name - Name of the template
baseDirectory - Parent of the new component
parentPath - Path in the current generation. Can be "" for root. 
Initial "" -> Then "__test__"
directoryName - The name of the directory being generated
directoryTemplate - The template object of the directory being generated
*/


function generateDirectory(componentName,templateName,baseFilePath,parentPath,newDirectoryName,directoryTemplate){
  let newDirectoryRelativePath = "";
  let newDirectoryFilePath = "";
  let templateFileBasePath = "";
  
  // If root folder, then relative path is "";
  if(parentPath === "root"){
    newDirectoryRelativePath = ""
    newDirectoryFilePath = baseFilePath + "/" + componentName;
    templateFileBasePath = "./contents/" + templateName;
    
  }
  else if(parentPath === ""){
    newDirectoryRelativePath = newDirectoryName
    newDirectoryFilePath = baseFilePath + "/" + componentName + "/" + newDirectoryRelativePath;
    templateFileBasePath = "./contents/" + templateName + "/" + newDirectoryName;
  }
  else{
    newDirectoryRelativePath = parentPath + "/" + newDirectoryName;
    newDirectoryFilePath = baseFilePath + "/" + componentName + "/" + newDirectoryRelativePath;
    templateFileBasePath = "./contents/" + templateName+"/"+parentPath+"/"+newDirectoryName;
    
  }
   
  console.log("Making directory folder with parent ",parentPath," at ",newDirectoryFilePath)
  fs.mkdirSync(newDirectoryFilePath);

  directoryTemplate.files.forEach(fileName=>{
    const templateFilePath =templateFileBasePath+"/"+fileName;
    let createdFilePath =newDirectoryFilePath + "/" + fileName;
    console.log("Generating file ",fileName,"from ",templateFilePath,"to ",createdFilePath)
    var contents = require(templateFilePath);
    const snakeCaseName = camelToSnakeCase(componentName)
    createdFilePath=createdFilePath.replaceAll("$ComponentName$",componentName)
    contents=contents.replaceAll("$ComponentName$",componentName)
    contents=contents.replaceAll("$ComponentNameSnake$",snakeCaseName)
    fs.writeFileSync(createdFilePath, contents);
  })
  if(!directoryTemplate.directories){
    return;
  }
  Object.keys(directoryTemplate.directories).forEach(subDirectoryName=>{
    
    const subDirectoryTemplate = directoryTemplate.directories[subDirectoryName]
    generateDirectory(componentName,templateName,baseFilePath,newDirectoryRelativePath,subDirectoryName,subDirectoryTemplate)
  })
}

function generateComponentFiles(parentDirectory,templateName,componentName){
  const template = templates[templateName];
  generateDirectory(componentName,templateName,parentDirectory,"root",componentName,template)
}

function createComponent(baseDirectory,templateName) {
  getComponentName().then(componentName=>
    generateComponentFiles(baseDirectory,templateName,componentName)
  ).catch((err)=>{
    if(!err){
      vscode.window.showErrorMessage("File Operations Failed",err)
        console.error("File Operations Failed",err);
    }
  })
}


function createComponentWithDefaultTemplate(currentFileName) {
  const directory = getDirectoryFromMenu(currentFileName);
  const templateName = vscode.workspace.getConfiguration('create-styled-react-component')["Generation"]["defaultTheme"]
  if(!templateName){
    vscode.window.showErrorMessage("Default Theme not set. Please set the default theme in your preferences")
  }
  createComponent(directory,templateName)
}

function createComponentFromMenu(currentFileName){
  const directory = getDirectoryFromMenu(currentFileName);
  getTemplateFromCommand().then(templateName=>createComponent(directory,templateName))
}


module.exports = {
  createComponentWithDefaultTemplate,
  createComponentFromMenu
};
