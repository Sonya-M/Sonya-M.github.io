// jshint esversion: 6

import * as data from "./data.js";
import * as ui from "./ui.js";

// Characters are loaded on clicking the next button, below the
// displayed cards, sort of like an infinite scroll on demand;
// Keep track of the number of loaded pages;
let nLoadedPages = 1;

document.addEventListener("DOMContentLoaded", function () {
    initUI();
    let characterID = localStorage.getItem("characterID");
    if (characterID) {
        fetchAndDisplaySingleCharacter(characterID);
    }
    else {
        fetchAndDisplayCharacters(nLoadedPages);
    }
});

function initUI() {
    ui.initDOM();
    bindEventHandlers();
}

function bindEventHandlers() {
    ui.bindClickOnCharacter(onCharacterClick);
    ui.bindLikeEventHandler(onLikeHandler);
    ui.bindNextPageEventHandler(onNextPageClick);
}

function onCharacterClick(characterID) {
    localStorage.setItem("characterID", characterID);
    // window.open("./index.html", "blank"); //!!!this has the effect of opening
    // all details pages in the same secondary tab
    // fetchAndDisplaySingleCharacter(characterID);
}

function fetchAndDisplaySingleCharacter(characterID) {
    data.fetchSingleCharacter(characterID)
        .then(character => {
            ui.displaySingleCharacter(character);
        }).then(() => localStorage.removeItem("characterID"))
        .catch(error => ui.displayErrorMessage(error.message));
}

function onLikeHandler(characterID) {
    data.likeCharacter(characterID);
}
function onNextPageClick() {
    // fetch next 20 characters from page with given number
    if (nLoadedPages < data.getTotalPages()) {
        fetchAndDisplayCharacters(++nLoadedPages);
    } else {
        ui.displayMessage("No more characters");
    }
}

function fetchAndDisplayCharacters(pageNumber) {
    // if ui were a class, you would have to use bind:
    // data.fetchCharacters(ui.displayCharacters.bind(ui));
    data.fetchCharacters(pageNumber)
        .then(list => {
            if (list) ui.displayCharacters(list);
            else {
                ui.displayErrorMessage("Sorry, something went wrong...");
            }
        })
        .catch(error => ui.displayErrorMessage(error.message));
}

