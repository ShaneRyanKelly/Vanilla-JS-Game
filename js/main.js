import buttons from '../ui/buttons.json' assert { type: "json"};
console.log("Javascript working.");
main();

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
    mainElement.innerHTML = "<p>Dynamically Generated Text!";
    getCoreActionBar();
}