import buttons from '../data/buttons.json' assert { type: "json" };
import scenes from '../data/scenes.json' assert { type: "json" };
import infos from '../data/info.json' assert { type: "json" };
import events from '../data/events.json' assert { type: "json"};
import items from "../data/items.json" assert { type: "json" };
import characters from "../data/characters.json" assert {type: "json"};
import enemies from "../data/enemies.json" assert {type: "json"};
import party from "../data/party.json" assert {type: "json"};

var currentScene = "demo";
var currentTarget = "";
const classTypes = [ "inspect", "interact", "item", "character", "dialogue", "enemy" ];
var inventory = [];
var journal = [];
var selectedCharacter;
var dialogueTree;
var inBattle = false;
var player;
var enemy;

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

function displayBattle(){
    console.log('battlebutton clicked!');
    inBattle = true;
    getActionBar("battle");
    var textBox = getId("textBox");
    enemy = enemies[currentTarget.id.split("_")[0]];
    textBox.innerHTML = "<h1>" + enemy["name"] + "</h1>";
    textBox.innerHTML += "<img src='" + enemy["imagePath"] + "' />";
}

function displayDialogue(){
    getActionBar("dialogue");
    var textBox = getId("textBox");
    textBox.innerHTML = "<h1>" + characters[selectedCharacter]["name"] + "</h1>";
    dialogueTree = characters[selectedCharacter]["dialogue"];
    console.log(dialogueTree["greeting"]);
    var i = 0;
    for (var node in dialogueTree["greeting"]){
        if (i == 0)
            textBox.innerHTML += "<p><b>" + characters[selectedCharacter]["nickName"] + ":</b></p>";
        textBox.innerHTML += dialogueTree["greeting"][node];
        i++;
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
    console.log(event);
    if (currentTarget.id == "journalButton"){
        displayJournal();
    }
    else if (currentTarget.id == "inventoryButton"){
        displayInventory();
    }
}

function doAction(event){
    getId("infoBox").innerHTML = "";
    console.log("doaction");
    if (event.target.id == "exitButton"){
        getId("actionBar").innerHTML = "";
        triggerEvent();
        displayScene();
        getMainMenuBar("core");
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
        pickUpItem();
        triggerEvent();
    }
    else if (event.target.id == "talkButton"){
        getId("actionBar").innerHTML = "";
        displayDialogue();
    }
    else if (event.target.id == "battleButton"){
        getId("actionBar").innerHTML = "";
        getId("menuBar").innerHTML = "";
        displayBattle();
    }
    else if (event.target.id == "attackButton"){
        player["selectedAction"] = "attack";
        handleTurn();
    }
}

function executeActions(characters){
    console.log(characters);
    var textBox = getId("textBox");
    for (var i = 0; i < characters.length; i++){
        if (characters[i]["selectedAction"] == "attack"){
            var damage = getAttackDamage(characters[i]);
            textBox.innerHTML += "<p>" + characters[i]["name"] + " attacks dealing " + damage + " damage!</p>"
        }
        characters[i]["target"]["hp"] -= damage;
        if (characters[i]["target"]["hp"] <= 0){
            textBox.innerHTML += characters[i]["name"] + " defeated " + characters[i]["target"]["name"] + "!";
            getActionBar("dialogue");
            inBattle = false;
            break;
        }
    }
}

function getActionBar(className){
    var actionBar = getId("actionBar");
    actionBar.innerHTML = "";
    actionBar.innerHTML = buttons[className];
    createActionListeners(className);
}

function getAttackDamage(character){
    return ((character["attack"] - character["defense"])) / 2 + ((((character["attack"] - character["defense"]) / 2) + 1) * Math.floor(Math.random() * 256) / 256) / 4
}

function getMainMenuBar(newBar){
    var menuBar = getId("menuBar");
    menuBar.innerHTML = "";
    menuBar.innerHTML = buttons[newBar];
}

function getId(newId){
    return document.getElementById(newId);
}

function getTurnNum(character){
    return (Math.floor(Math.random() * 255) * (character["agility"] - (character["agility"] / 4))/256);
}

function getTurnOrder(){
    var playerNum = getTurnNum(player);
    var enemyNum = getTurnNum(enemy);
    var turnArray = [];
    if (playerNum > enemyNum){
        turnArray.push(enemy);
        turnArray.push(player);
    }
    else{
        turnArray.push(player);
        turnArray.push(enemy);
    }
    return turnArray;
}

function handleTurn(){
    console.log("Turn initiated");
    enemy["selectedAction"] = enemy["actions"][Math.floor(Math.random() * Object.keys(enemy["actions"]).length)];
    enemy["target"] = player;
    player["target"] = enemy;
    var turnOrder = getTurnOrder();
    executeActions(turnOrder);
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
    var i = 0;
    for (var node in newNode){
        if (i == 0)
            getId("textBox").innerHTML += "<p><b>" + characters[selectedCharacter]["nickName"] + ":</b></p>"
        getId("textBox").innerHTML += newNode[node];
        i++;
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
    console.log(newEvent["dialogueMods"]);
    for (var i = 0; i < Object.keys(newEvent["dialogueMods"]).length; i++){
        var currentEvent = newEvent["dialogueMods"][i];
        console.log(newEvent);
        var character = currentEvent["character"];
        var newIndex = currentEvent["index"];
        var newResponse = currentEvent["response"];
        var newText = currentEvent["text"];
        characters[character]["dialogue"][newIndex][newResponse] = newText;
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
    player = party["player"];
    displayScene();
    getMainMenuBar("core");
    createUiListeners();
}