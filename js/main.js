import buttons from '../data/buttons.json' assert { type: "json" };
import scenes from '../data/scenes.json' assert { type: "json" };
import infos from '../data/info.json' assert { type: "json" };
import events from '../data/events.json' assert { type: "json"};
console.log("Javascript working.");

var currentScene = "demo";
var currentTarget = "";
const classTypes = [ "inspect", "interact", "journalButton" ];
var journal = [];

document.addEventListener("DOMContentLoaded", main);

function createActionListeners(className){
    var elements = document.getElementsByClassName("actionButton");
    console.log(elements);
    for (var i = 0; i < elements.length; i++){
        elements[i].addEventListener("click", doAction);
    }
}

function createEventListeners(){
    var elements;
    for ( var i = 0; i < classTypes.length; i++ ){
        elements = document.getElementsByClassName(classTypes[i]);
        console.log(i + ": " + classTypes[i]);
        for (var j = 0; j < elements.length; j++){
            elements[j].addEventListener("click", displayInfo);
        }
    }
}

function createUiListeners(){
    let uiElements = document.getElementsByClassName("uiButton");
    for (var i = 0; i < uiElements.length; i++){
        uiElements[i].addEventListener("click", displayUi)
    }
}

function displayInfo(event){
    console.log("click");
    currentTarget = event.target;
    getActionBar(currentTarget.className);
    getId("infoBox").innerHTML = infos[currentTarget.id]["description"];
}

function displayJournal(){
    getId("infoBox").innerHTML = "";
    getId("textBox").innerHTML = "<h1>Journal</h1>"
    getActionBar("journalButton");
    for (var i = 0; i < journal.length; i++){
        getId("textBox").innerHTML += journal[i];
    }
}

function displayScene(){
    var descriptions = scenes[currentScene]["description"];
    getId("textBox").innerHTML = "";
    for ( var paragraph in descriptions ){
        getId("textBox").innerHTML += descriptions[paragraph];
    }
    createEventListeners();
}

function displayUi(event){
    var currentTarget = event.target;
    if (currentTarget.id == "journalButton"){
        displayJournal();
    }
}

function doAction(event){
    if (event.target.id == "exitButton"){
        getId("textBox").innerHTML = "";
        getId("actionBar").innerHTML = "";
        displayScene();
    }
    else if (event.target.id == "inspectButton"){
        showInspect();
    }
    else if (event.target.id == "interactButton"){
        triggerEvent();
    }
}

function getActionBar(className){
    var actionBar = getId("actionBar");
    actionBar.innerHTML = "";
    actionBar.innerHTML = buttons[className];
    createActionListeners(className);
}

function getMainMenuBar(newBar){
    var menuBar = getId("menuBar");
    menuBar.innerHTML = "";
    menuBar.innerHTML = buttons[newBar];
}

function getId(newId){
    return document.getElementById(newId);
}

function showInspect(){
    getId("infoBox").innerHTML = infos[currentTarget.id]["info"];
}

function triggerEvent(){
    console.log("event!");
    console.log(events[currentTarget.id]["scenes"]);
    var newEvent = events[currentTarget.id];

    for (var i = 0; i < Object.keys(newEvent["mods"]).length; i++){
        var currentEvent = newEvent["mods"][i];
        var scene = currentEvent["scene"];
        var newKey = currentEvent["index"];
        var newValue = currentEvent["text"];
        scenes[scene]["description"][newKey] = newValue;
    }
    journal.push(newEvent["journal"]);
    console.log(journal);
    displayScene();
}
 
function main(){
    var mainElement = getId("main");
    console.log(buttons);
    displayScene();
    getMainMenuBar("core");
    createUiListeners();
}