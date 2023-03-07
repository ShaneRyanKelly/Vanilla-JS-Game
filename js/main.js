import buttons from '../data/buttons.json' assert { type: "json" };
import scenes from '../data/scenes.json' assert { type: "json" };
import infos from '../data/info.json' assert { type: "json" };
import events from '../data/events.json' assert { type: "json"};
import items from "../data/items.json" assert { type: "json" };
console.log("Javascript working.");

var currentScene = "demo";
var currentTarget = "";
const classTypes = [ "inspect", "interact", "item", "character", "journalButton" ];
var inventory = [];
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
    var id = currentTarget.id.split("_")[0];
    getActionBar(currentTarget.className);
    getId("infoBox").innerHTML = infos[id]["description"];
}

function displayInventory(){
    getId("infoBox").innerHTML = "";
    getId("textBox").innerHTML = "<h1>Inventory</h1>";
    getActionBar("inventory");
    for (const element in inventory){
        console.log("looping");
        getId("textBox").innerHTML += "<p id='" + inventory[element]["id"] + "' class='" + inventory[element]["class"] + "'>" + inventory[element]["title"] + " - " + inventory[element]["quantity"] + "</p>";
    }
}

function displayJournal(){
    getId("infoBox").innerHTML = "";
    getId("textBox").innerHTML = "<h1>Journal</h1>"
    getActionBar("journal");
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
    else if (currentTarget.id == "inventoryButton"){
        displayInventory();
    }
}

function doAction(event){
    if (event.target.id == "exitButton"){
        getId("textBox").innerHTML = "";
        displayScene();
    }
    else if (event.target.id == "inspectButton"){
        showInspect();
    }
    else if (event.target.id == "interactButton"){
        getId("actionBar").innerHTML = "";
        triggerEvent();
    }
    else if (event.target.id == "pickUpButton"){
        getId("actionBar").innerHTML = "";
        getId("infoBox").innerHTML = "";
        pickUpItem();
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

function hasItem(newItem){
    for (var i = 0; i < Object.keys(inventory).length; i++){
        if (inventory[i]["title"] == newItem)
            return true;
    }
    return false;
}

function pickUpItem(){
    var id = currentTarget.id.split("_")[0];
    console.log(id);
    if (hasItem(id)){
        inventory[id]["quantity"]++;
    }
    else{
        inventory[id] = items[id];
        inventory[id]["quantity"]++;
    }
}

function showInspect(){
    var id = currentTarget.id.split("_")[0];
    getId("infoBox").innerHTML = infos[id]["info"];
}

function triggerEvent(){
    var newEvent = events[currentScene][currentTarget.id];
    console.log(currentTarget.id);

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