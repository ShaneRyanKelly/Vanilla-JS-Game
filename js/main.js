import buttons from '../data/buttons.json' assert { type: "json" };
import scenes from '../data/scenes.json' assert { type: "json" };
import infos from '../data/info.json' assert { type: "json" };
import events from '../data/events.json' assert { type: "json"};
import items from "../data/items.json" assert { type: "json" };
import characters from "../data/characters.json" assert {type: "json"};

var currentScene = "demo";
var currentTarget = "";
const classTypes = [ "inspect", "interact", "item", "character", "dialogue", "journalButton" ];
var inventory = [];
var journal = [];
var selectedCharacter;
var dialogueTree;

document.addEventListener("DOMContentLoaded", main);

function createActionListeners(className){
    var elements = document.getElementsByClassName("actionButton");
    for (var i = 0; i < elements.length; i++){
        elements[i].addEventListener("click", doAction);
    }
}

function createDialogueListeners(){
    var elements = document.getElementsByClassName("dialogueButton");
    for (var i = 0; i < elements.length; i++){
        elements[i].addEventListener("click", handleDialogue)
    }
}

function createEventListeners(){
    var elements;
    for ( var i = 0; i < classTypes.length; i++ ){
        elements = document.getElementsByClassName(classTypes[i]);
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

function displayDialogue(){
    getActionBar("dialogue");
    var text = getId("textBox");
    text.innerHTML = "<h1>" + characters[selectedCharacter]["name"] + "</h1>";
    dialogueTree = characters[selectedCharacter]["dialogue"];
    for (var i = 0; i < Object.keys(dialogueTree["greeting"]).length; i++){
        if (i == 0)
            text.innerHTML += "<p><b>" + characters[selectedCharacter]["nickName"] + ":</b></p>";
        text.innerHTML += dialogueTree["greeting"][i];
    }
    createDialogueListeners();
}

function displayInfo(event){
    currentTarget = event.target;
    var id = currentTarget.id.split("_")[0];
    if (currentTarget.className == "character"){
        selectedCharacter = id;
    }
    getActionBar(currentTarget.className);
    getId("infoBox").innerHTML = infos[id]["description"];
}

function displayInventory(){
    getId("infoBox").innerHTML = "";
    getId("textBox").innerHTML = "<h1>Inventory</h1>";
    getActionBar("inventory");
    for (const element in inventory){
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
    getId("actionBar").innerHTML = "";
    getId("infoBox").innerHTML = "";

    if (event.target.id == "exitButton"){
        displayScene();
    }
    else if (event.target.id == "inspectButton"){
        showInspect();
    }
    else if (event.target.id == "interactButton"){
        triggerEvent();
    }
    else if (event.target.id == "pickUpButton"){
        pickUpItem();
        triggerEvent();
    }
    else if (event.target.id == "talkButton"){
        displayDialogue();
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

function handleDialogue(event){
    var text = getId("textBox");
    let elements = text.getElementsByClassName("dialogueButton");
    for (var i = (elements.length - 1); i >= 0; i--){
        elements[i].remove();
    }
    getId("textBox").innerHTML += "<p><b>Player:</b></p>"
    getId("textBox").innerHTML += "<p>" + event.target.textContent + "</p>";
    currentTarget = event.target;
    var newNode = dialogueTree[event.target.id];
    for (var i = 0; i < Object.keys(newNode).length; i++){
        if (i == 0)
            getId("textBox").innerHTML += "<p><b>" + characters[selectedCharacter]["nickName"] + ":</b></p>"
        getId("textBox").innerHTML += newNode[i];
    }
    triggerDialogueEvent();
    createDialogueListeners();
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
    console.log(currentTarget.id);
    if (!events[currentScene][currentTarget.id]){
        console.log("no event found!");
        return;
    }
    var newEvent = events[currentScene][currentTarget.id];

    for (var i = 0; i < Object.keys(newEvent["mods"]).length; i++){
        var currentEvent = newEvent["mods"][i];
        var scene = currentEvent["scene"];
        var newKey = currentEvent["index"];
        var newValue = currentEvent["text"];
        scenes[scene]["description"][newKey] = newValue;
    }
    journal.push(newEvent["journal"]);
    displayScene();
}

function triggerDialogueEvent(){
    if (!events[currentScene][currentTarget.id]){
        console.log("no event found!");
        return;
    }
    var newEvent = events[currentScene][currentTarget.id];

    for (var i = 0; i < Object.keys(newEvent["mods"]).length; i++){
        var currentEvent = newEvent["mods"][i];
        var scene = currentEvent["scene"];
        var newKey = currentEvent["index"];
        var newValue = currentEvent["text"];
        scenes[scene]["description"][newKey] = newValue;
    }
    journal.push(newEvent["journal"]);
}
 
function main(){
    var mainElement = getId("main");
    displayScene();
    getMainMenuBar("core");
    createUiListeners();
}