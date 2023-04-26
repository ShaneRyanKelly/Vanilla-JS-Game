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
var selectedItem;
var ongoingBattle;
var currentScreen;

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

function createEquipListeners(){
    var elements = document.getElementsByClassName('equipSlot');
    
    for (var i = 0; i < elements.length; i++){
        elements[i].addEventListener("click", selectEquip);
    }
}

function createEquipItemListeners(){
    var elements = document.getElementsByClassName("equipItem");

    for (var i = 0; i < elements.length; i++){
        elements[i].addEventListener("click", selectEquipItem);
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

function createKeyEventListeners(){
    var elements;
    for ( var i = 0; i < classTypes.length; i++ ){
        elements = document.getElementsByClassName(classTypes[i]);
        for (var j = 0; j < elements.length; j++){
            elements[j].addEventListener("click", checkKey);
        }
    }
}

function createInventoryListeners(){
    var elements = document.getElementsByClassName('inventoryItem');
    for (var i = 0; i < elements.length; i++){
        elements[i].addEventListener("click", selectItem)
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
    createUiListeners();
    var textBox = getId("textBox");
    enemy = enemies[currentTarget.id.split("_")[0]];
    textBox.innerHTML = "<h1>" + enemy["name"] + "</h1>";
    textBox.innerHTML += "<img src='" + enemy["imagePath"] + "' />";
    ongoingBattle = textBox.innerHTML;
}

function displayBattleOngoing(){
    getActionBar("battle");
    createUiListeners();
    var textBox = getId("textBox");
    textBox.innerHTML = ongoingBattle;
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

function displayEquip(){
    if (inBattle){
        getActionBar("exitToBattle");
    }
    else{
        getActionBar("status");
    }

    getId("infoBox").innerHTML = "";
    getId("textBox").innerHTML = "<h1>Equipment</h1>";
    getId("menuBar").innerHTML = "";
    getId("textBox").innerHTML += "<p id='weapon' class='equipSlot'>[WEAPON]: " + items[player["weapon"]]["name"] + "</p>";
    getId("textBox").innerHTML += "<p id='armour' class='equipSlot'>[ARMOUR]: " + items[player["armour"]]["name"] + "</p>";
    getId("textBox").innerHTML += "<p id='accessory' class='equipSlot'>[ACCESSORY]: " + items[player["accessory"]]["name"] + "</p>";
    createEquipListeners();
}

function displayEquip0(){
    getId("infoBox").innerHTML = "";
    getId("textBox").innerHTML = "<h1>Equipment</h1>";
    getId("menuBar").innerHTML = "";
    getActionBar("equip");
    for (var element in inventory){
        console.log(element);
        if (items[element]["class"] == "weapon" || items[element]["class"] == "armour"){
            var newEquipment = items[element];
            getId("infoBox").innerHTML += "<h3 id='" + newEquipment["id"] + "' class='equipItem'>" + newEquipment["name"] + "</h3>"
        }
    }
    createEquipListeners();
}

function displayInfo(event){
    currentTarget = event.target;
    var id = currentTarget.id.split("_")[0];
    if (currentTarget.className == "character"){
        selectedCharacter = id;
    }
    getActionBar(currentTarget.className);
    getId("infoBox").innerHTML = infos[id]["description"];
    scrollDown();
}

function displayInventory(){
    getId("infoBox").innerHTML = "";
    getId("textBox").innerHTML = "<h1>Inventory</h1>";
    getId("menuBar").innerHTML = "";
    if (inBattle){
        getActionBar("battleInventory");
    }
    else{
        getActionBar("inventory");
    }

    for (const element in inventory){
        getId("textBox").innerHTML += "<p id='" + inventory[element]["id"] + "' class='" + inventory[element]["class"] + " inventoryItem'>" + inventory[element]["name"] + " - " + inventory[element]["quantity"] + "</p>";
    }
    createInventoryListeners();
}

function displayJournal(){
    getId("infoBox").innerHTML = "";
    getId("textBox").innerHTML = "<h1>Journal</h1>"
    getActionBar("journal");
    console.log(journal);
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

function displayStatus(){
    getId("infoBox").innerHTML = "";
    var textBox = getId("textBox");
    getActionBar("status");
    textBox.innerHTML = "<h1><b>" + player["name"] + "</b></h1>"; 
    textBox.innerHTML += "<p>" + player["description"] + "</p>";
    textBox.innerHTML += "<img src='" + player["imagePath"] + "' />";
    textBox.innerHTML += "<table><tr><td><b>HP: </b>" + player["hp"] + "</td>" + "<td><b>MP: </b>" + player["mp"] + "</td>" + "<td><b>Sanity: </b>" + player["sanity"] + "</td></tr></table>";
    textBox.innerHTML += "<h2><b>Attributes</b></h2>"
    textBox.innerHTML += "<table><tr><td><b>Strength: </b>" + player["strength"] + "</td>" + "<td><b>Reslilience: </b>" + player["resilience"] + "</td>" + "<td><b>Agility: </b>" + player["agility"] + "</td></tr>" + "<tr><td><b>Wisdom: </b>" + player["wisdom"] + "</td>" + "<td><b>Luck: </b>" + player["luck"] + "</td>" + "<td><b>Deftness: </b>" + player["deftness"] + "</td></tr>" + "<tr><td><b>Charm: </b>" + player["charm"] + "</td>" + "<td><b>Magical Might: </b>" + player["magicalMight"] + "</td>" + "<td><b>Magical Mending: </b>" + player["magicalMending"] + "</td></tr></table>";
    textBox.innerHTML += "<h2><b>Equipment</b></h2>"
    textBox.innerHTML += "<table><tr><td><b>Attack:</b>" + player["attack"] + "</td>" + "<td><b>Defense: </b>" + player["defense"] + "</td>" + "<td><b>Evasion: </b>" + player["evasion"] + "</td></tr></table>";
    textBox.innerHTML += "<b>Weapon: </b>" + getItemName(player["weapon"]) + "<br>";
    textBox.innerHTML += "<b>Armour: </b>" + getItemName(player["armour"]) + "<br>";
    textBox.innerHTML += "<b>Accessory: </b>" + getItemName(player["accessory"]) + "<br>";
}

function displayUi(event){
    var currentTarget = event.target;
    console.log(event);
    if (currentTarget.id == "journalButton"){
        currentScreen = "journal";
        displayJournal();
    }
    else if (currentTarget.id == "equipButton"){
        currentScreen = "equip";
        displayEquip()
    }
    else if (currentTarget.id == "inventoryButton"){
        currentScreen = "inventory";
        displayInventory();
    }
    else if (currentTarget.id == "statusButton"){
        currentScreen = "status";
        displayStatus();
    }
}

function doAction(event){
    console.log("doaction");

    if (event.target.id == "consumeButton"){
        getId("actionBar").innerHTML = "";
        getId("infoBox").innerHTML = "";
        consumeItem();
    }
    else if (event.target.id == "exitButton"){
        getId("actionBar").innerHTML = "";
        getId("infoBox").innerHTML = "";
        //triggerEvent();
        displayScene();
        getMainMenuBar("core");
    }
    else if (event.target.id == "exitBattle"){
        getId("actionBar").innerHTML = "";
        getId("infoBox").innerHTML = "";
        triggerEvent();
        displayScene();
        getMainMenuBar("core");
    }
    else if (event.target.id == "exitToBattleButton"){
        getId("actionBar").innerHTML = "";
        getId("infoBox").innerHTML = "";
        displayBattleOngoing()
    }
    else if (event.target.id == "exitToInventoryButton"){
        getId("actionBar").innerHTML = "";
        getId("infoBox").innerHTML = "";
        displayInventory();
    }
    else if (event.target.id == "escapeButton"){
        getId("actionBar").innerHTML = "";
        getId("infoBox").innerHTML = "";
        inBattle = false;
        displayScene();
        getMainMenuBar("core");
    }
    else if (event.target.id == "inspectButton"){
        showInspect();
    }
    else if (event.target.id == "interactButton"){
        getId("actionBar").innerHTML = "";

        if (infos[currentTarget.id]["status"] == "locked"){
            var infoBox = getId("infoBox");
            infoBox.innerHTML = infos[currentTarget.id]["info"];
        }
        else{
            triggerEvent();
        }
    }
    else if (event.target.id == "pickUpButton"){
        getId("actionBar").innerHTML = "";
        pickUpItem();
        triggerEvent();
    }
    else if (event.target.id == "talkButton"){
        getId("actionBar").innerHTML = "";
        getId("menuBar").innerHTML = "";
        getId("infoBox").innerHTML = "";
        currentScreen = "dialogue";
        displayDialogue();
    }
    else if (event.target.id == "battleButton"){
        getId("actionBar").innerHTML = "";
        getId("menuBar").innerHTML = "";
        getId("infoBox").innerHTML = "";
        currentScreen = "battle";
        displayBattle();
    }
    else if (event.target.id == "attackButton"){
        player["selectedAction"] = "attack";
        handleTurn();
    }
    else if (event.target.id == "equipButton"){
        equipItem();
    }
    else if (event.target.id == "equipItemButton"){
        if (inBattle)
            equipItemToo();
        else
            equipItem();
    }
    else if (event.target.id == "useButton"){
        getId("actionBar").innerHTML = "";
        useKey();
    }
}

function checkKey(event){
    var infoBox = getId("infoBox");
    currentTarget = event.target;
    if (selectedItem == infos[event.target.id]["key"]){
        infoBox.innerHTML = "Success.";
        getId("actionBar").innerHTML = "";
        triggerEvent();
    }
    else {
        infoBox.innerHTML = "Failure.";
    }
    scrollDown();
}

function equipItem(){
    console.log(selectedItem);
    if (items[selectedItem]["class"] == "weapon"){
        player["weapon"] = selectedItem;
        player["attack"] = items[selectedItem]["attack"];
    }
    else if (items[selectedItem]["class"] == "armour"){
        player["armour"] = selectedItem;
        player["defense"] = items[selectedItem]["defense"];
        player["evasion"] = items[selectedItem]["evasion"];
    }
    else if (items[selectedItem]["class"] == "accessory"){
        player["accessory"] = selectedItem;
        player["attack"] = items[selectedItem]["attack"];
        player["defense"] = items[selectedItem]["defense"];
        player["evasion"] = items[selectedItem]["evasion"];
    }
    if (currentScreen == "inventory")
        displayInventory();
    else
        displayEquip();

    if (inBattle){
        getActionBar("battleInventory")
    }
    else {
        getActionBar("inventory")

    }
    getId("infoBox").innerHTML = items[selectedItem]["name"] + " equipped!";
}

function equipItemToo(){
    console.log(selectedItem);
    if (items[selectedItem]["class"] == "weapon"){
        player["weapon"] = selectedItem;
        player["attack"] = items[selectedItem]["attack"];
    }
    else if (items[selectedItem]["class"] == "armour"){
        player["armour"] = selectedItem;
        player["defense"] = items[selectedItem]["defense"];
        player["evasion"] = items[selectedItem]["evasion"];
    }
    else if (items[selectedItem]["class"] == "accessory"){
        player["accessory"] = selectedItem;
        player["attack"] = items[selectedItem]["attack"];
        player["defense"] = items[selectedItem]["defense"];
        player["evasion"] = items[selectedItem]["evasion"];
    }
    displayEquip();
    getId("infoBox").innerHTML = items[selectedItem]["name"] + " equipped!";
}

function executeActions(characters){
    console.log(characters);
    var textBox = getId("textBox");
    for (var i = 0; i < characters.length; i++){
        if (characters[i]["selectedAction"] == "attack"){
            var damage = getAttackDamage(characters[i]);
            textBox.innerHTML += "<p>" + characters[i]["name"] + " attacks dealing " + damage + " damage!</p>"
            ongoingBattle = textBox.innerHTML;
            scrollDown();
        }
        characters[i]["target"]["hp"] -= damage;
        if (characters[i]["target"]["hp"] <= 0){
            textBox.innerHTML += characters[i]["name"] + " defeated " + characters[i]["target"]["name"] + "!";
            ongoingBattle = textBox.innerHTML;
            getActionBar("exitBattle");
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
    createUiListeners();
}

function getId(newId){
    return document.getElementById(newId);
}

function getItemName(id){
    return items[id]["name"];
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
    scrollDown();
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
    scrollDown();
}

function hasItem(newItem){
    for (var item in inventory){
        if (inventory[item]["name"] == newItem)
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

function scrollDown(){
    window.scrollTo(0, document.body.scrollHeight);
}

function getStatDifference(newItem, oldItem){
    if (items[newItem]["class"] == "weapon"){
        var difference = items[newItem]["attack"] - items[oldItem]["attack"];
        if (difference >= 0){
            return "+" + difference;
        }
        else {
            return "-" + difference;
        }
    }
    else if (items[newItem]["class"] == "armour"){
        var defDifference = items[newItem]["defense"] - items[oldItem]["defense"];
        var evaDifference = items[newItem]["evasion"] - items[oldItem]["evasion"];
        if (defDifference > 0)
            defDifference = "+" + defDifference;
        else
            defDifference = "-" + defDifference;
        if (evaDifference > 0)
            evaDifference = "+" + evaDifference;
        else
            evaDifference = "-" + evaDifference;

        return defDifference + ", " + evaDifference;
    }
}

function selectEquip(event){
    selectedItem = event.target;
    console.log("item" + selectedItem);
    var itemClass = event.target.id;

    console.log(itemClass);
    for (var element in inventory){
        if (inventory[element]["class"] == itemClass && itemClass == "weapon"){
            getId("infoBox").innerHTML = "<p id='" + inventory[element]["id"] + "' class='equipItem'><b>" + inventory[element]["name"] + ": </b>Attack: " + inventory[element]["attack"] + " (" + getStatDifference(inventory[element]["id"], player["weapon"]) + ")</p>";
        }
        else if (inventory[element]["class"] == itemClass && itemClass == "armour"){
            getId("infoBox").innerHTML = "<p id='" + inventory[element]["id"] + "' class='equipItem'><b>" + inventory[element]["name"] + ": </b>Defense: " + inventory[element]["defense"] + " <b>Evasion: </b> " + inventory[element]["evasion"] + " (" + getStatDifference(inventory[element]["id"], player["armour"]) + ")</p>";
        }
        else if (inventory[element]["class"] == itemClass && itemClass == "accessory"){
            getId("infoBox").innerHTML = "<p id='" + inventory[element]["id"] + "' class='equipItem'><b>" + inventory[element]["name"] + ": </b>Attack: " + inventory[element]["attack"] + " (" + getStatDifference(inventory[element]["id"], player["weapon"]) + ")</p>";
        }
    }
    createEquipListeners();
    createEquipItemListeners();
    createActionListeners();
}

function selectEquipItem(event){
    getActionBar("equip");
    selectedItem = event.target.id;
}

function selectItem(event){
    displayInventory();
    selectedItem = event.target.id;
    console.log(selectedItem);
    getId("infoBox").innerHTML = "<p>" + items[selectedItem]["name"] + ": " + infos[selectedItem]["description"] + "</p>";

    if (items[selectedItem]["class"] == "consumable"){
        getId(selectedItem).innerHTML += "<p>" + items[selectedItem]["effect"] + "</p>";
        getActionBar("consumable");
    }
    else if (items[selectedItem]["class"] == "keyItem"){
        getId(selectedItem).innerHTML += "<p>" + items[selectedItem]["effect"] + "</p>";
        getActionBar("keyItem");
    }
    else if (items[selectedItem]["class"] == "weapon"){
        getId(selectedItem).innerHTML += "<p><b>[ATTACK]: </b>: " + items[selectedItem]["attack"] + "</p>";
        getActionBar("equip");
    }
    else if (items[selectedItem]["class"] == "armour"){
        getId(selectedItem).innerHTML += "<p><b>[DEFENSE]:</b> " + items[selectedItem]["defense"] + "    <b>[EVASION]:</b> " + items[selectedItem]["evasion"] + "</p>";
        getActionBar("equip");
    }
    else if (items[selectedItem]["class"] == "accessory"){
        getId(selectedItem).innerHTML += "<p><b>[DEFENSE]:</b> " + items[selectedItem]["defense"] + "    <b>[EVASION]:</b> " + items[selectedItem]["evasion"] + "</p>";
        getActionBar("equip");
    }
    createActionListeners();
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
    for (var mod in newEvent["mods"]){
        var currentEvent = newEvent["mods"][mod];
        var scene = currentEvent["scene"];
        var newKey = currentEvent["index"];
        var newValue = currentEvent["text"];
        scenes[scene]["description"][newKey] = newValue;
    }
    console.log(newEvent["dialogueMods"]);
    for (var i = 0; i < Object.keys(newEvent["dialogueMods"]).length; i++){
        var currentEvent = newEvent["dialogueMods"][i];
        var character = currentEvent["character"];
        var newIndex = currentEvent["index"];
        var newResponse = currentEvent["response"];
        var newText = currentEvent["text"];
        characters[character]["dialogue"][newIndex][newResponse] = newText;
    }
    journal.push(newEvent["journal"]);
    displayScene();
    getMainMenuBar("core");
    scrollDown();
}

function triggerDialogueEvent(){
    if (!events[currentScene][currentTarget.id]){
        console.log("no event found!");
        return;
    }
    var newEvent = events[currentScene][currentTarget.id];
    for (var mod in newEvent["mods"]){
        var currentEvent = newEvent["mods"][mod];
        var scene = currentEvent["scene"];
        var newKey = currentEvent["index"];
        var newValue = currentEvent["text"];
        scenes[scene]["description"][newKey] = newValue;
    }
    for (var mod in newEvent["dialogueMods"]){
        var currentEvent = newEvent["dialogueMods"][mod];
        var character = currentEvent["character"];
        var newIndex = currentEvent["index"];
        var newResponse = currentEvent["response"];
        var newText = currentEvent["text"];
        characters[character]["dialogue"][newIndex][newResponse] = newText;
    }
    /*for (var i = 0; i < Object.keys(newEvent["mods"]).length; i++){
        var currentEvent = newEvent["mods"][i];
        var scene = currentEvent["scene"];
        var newKey = currentEvent["index"];
        var newValue = currentEvent["text"];
        scenes[scene]["description"][newKey] = newValue;
    }*/
    journal.push(newEvent["journal"]);
    scrollDown();
}

function displayKeyScene(){
    var descriptions = scenes[currentScene]["description"];
    getId("textBox").innerHTML = "";
    for ( var paragraph in descriptions ){
        getId("textBox").innerHTML += descriptions[paragraph];
    }
    createKeyEventListeners();
    getActionBar("useKey");
    createActionListeners();
}

function useKey(){
    displayKeyScene();
}
 
function main(){
    var mainElement = getId("main");
    player = party["player"];
    displayScene();
    getMainMenuBar("core");
}