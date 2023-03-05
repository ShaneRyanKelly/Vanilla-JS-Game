import buttons from '../data/buttons.json' assert { type: "json" };
import scenes from '../data/scenes.json' assert { type: "json" };
import infos from '../data/info.json' assert { type: "json" };
console.log("Javascript working.");

var currentScene = "demo";
var currentTarget = "";
const classTypes = [ "inspect", "interact" ];

main();

function createActionListeners(className){
    var elements = document.getElementsByClassName("actionButton");
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

function displayInfo(event){
    console.log("click");
    currentTarget = event.target;
    getActionBar(currentTarget.className);
    getId("infoBox").innerHTML = infos[currentTarget.id]["description"];
}

function displayScene(){
    var descriptions = scenes[currentScene]["description"];
    getId("textBox").innerHTML = "";
    for ( var paragraph in descriptions ){
        getId("textBox").innerHTML += descriptions[paragraph];
    }
    createEventListeners();
}

function doAction(event){
    if (event.target.id = "inspectButton"){
        showInspect();
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
 
function main(){
    var mainElement = getId("main");
    console.log(buttons);
    displayScene();
    getMainMenuBar("core");
}