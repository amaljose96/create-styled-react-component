// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const createComponent=require("./src/CreateStyledReactComponent");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	let createComponentSubscription = vscode.commands.registerCommand('create-styled-react-component.createComponent',function(event){
		if(event && event.path){
			createComponent.createComponentFromMenu(event.path);
		}
	});
	let quickCreateComponentSubscription = vscode.commands.registerCommand('create-styled-react-component.quickCreateDefaultTemplateComponent',function(event){
		if(event && event.path){
			createComponent.createComponentWithDefaultTemplate(event.path);
		}
	});
	
	context.subscriptions.push(createComponentSubscription)
	context.subscriptions.push(quickCreateComponentSubscription)
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
