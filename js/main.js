import buttons from '../ui/buttons.json' assert { type: "json" };
import scenes from '../ui/scenes.json' assert { type: "json" };
console.log("Javascript working.");

var currentScene = "demo";
var sceneData;

main();

function displayScene(){
    sceneData = scenes[currentScene];
    getId("title").innerHTML = sceneData["title"];
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