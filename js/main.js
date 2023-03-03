import buttons from '../data/buttons.json' assert { type: "json" };
import scenes from '../data/scenes.json' assert { type: "json" };
import infos from '../data/info.json' assert { type: "json" };
console.log("Javascript working.");

var currentScene = "demo";
var currentTarget = "";
const classTypes = [ "inspect" ];

main();

function createEventListeners(){
    var elements;
    for ( var i = 0; i < classTypes.length; i++ ){
        elements = document.getElementsByClassName(classTypes[i]);
        for (var i = 0; i < elements.length; i++){
            elements[i].addEventListener("click", displayInfo);
        }
    }
}

function displayInfo(event){
    currentTarget = event.target.id;
    getId("infoBox").innerHTML = infos[currentTarget]["description"];
}

function displayScene(){
    var descriptions = scenes[currentScene]["description"];
    getId("textBox").innerHTML = "";
    for ( var paragraph in descriptions ){
        getId("textBox").innerHTML += descriptions[paragraph];
    }
    createEventListeners();
}

function getActionBar(newBar){
    var actionBar = getId("actionBar");
    actionBar.innerHTML = "";
    actionBar.innerHTML = buttons[newBar];
}

function getId(newId){
    return document.getElementById(newId);
}

function getJson(path, key){
    
}

function main(){
    var mainElement = getId("main");
    console.log(buttons);
    displayScene();
    getActionBar("core");
}