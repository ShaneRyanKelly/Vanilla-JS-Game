import buttons from '../data/buttons.json' assert { type: "json" };
import scenes from '../data/scenes.json' assert { type: "json" };
console.log("Javascript working.");

var currentScene = "demo";
var sceneData;

main();

function displayScene(){
    sceneData = scenes[currentScene];
    getId("textBox").innerHTML = "";
    for ( var element in sceneData ){
        getId("textBox").innerHTML += sceneData[element];
    }
}

function getCoreActionBar(){
    var actionBar = getId("actionBar");
    console.log(actionBar);
    actionBar.innerHTML = buttons["core"];
}

function getId(newId){
    return document.getElementById(newId);
}

function getJson(path, key){
    
}

function main(){
    var mainElement = getId("main");
    console.log(buttons);
    mainElement.append("Dynamically Generated Text!");
    displayScene();
    getCoreActionBar();
}