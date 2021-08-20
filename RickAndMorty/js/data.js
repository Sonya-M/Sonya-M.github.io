// jshint esversion: 6
import { Character } from "./entities/Character.js";
import { CharacterBasic } from "./entities/CharacterBasic.js";
import { Episode } from "./entities/Episode.js";

// e.g. for page 2: "https://rickandmortyapi.com/api/character?page=2"
const PAGINATED_CHARACTERS_API_URL = "https://rickandmortyapi.com/api/character?page=";
// e.g https://rickandmortyapi.com/api/character/1 for character with id 1
const SINGLE_CHARACTER_API = "https://rickandmortyapi.com/api/character/";

let charactersList = [];
let singleCharacter; // need to store the value for multiple then blocks when
// fetching episodes
console.log(charactersList);
// store total number of pages and characters on first call to 
// fetchCaracters()
let totalPages = 0;
let totalCharacters = 0;

function fetchCharacters(pageNumber) {
    console.log("charactersList: ", charactersList);
    if (totalPages && pageNumber > totalPages) {
        console.log("No more pages to load");
        return;
    }
    // MUST USE RETURN for the next `then in main.js`!!!
    return (fetch(PAGINATED_CHARACTERS_API_URL + pageNumber)
        .then(response => response.json())
        .then(data => {
            if (!totalPages || !totalCharacters) {
                totalCharacters = data.info.count;
                totalPages = data.info.pages;
            }
            let nCharacters = (charactersList.length + 20 > totalCharacters)
                ? (totalCharacters - charactersList.length)
                : 20;
            storeCharacters(data.results);
            // return only the last 20 characters (or less if reached the last page)
            // slice()returns a shallow copy of a portion of an array into a new
            // array object, so characterList remains protected; Character
            // instances are also protected using private variables and getters
            return charactersList
                .slice(Math.max(charactersList.length - nCharacters, 0));
        })
        .catch(error => {
            console.log(error.message);
        }));
}

function fetchSingleCharacter(characterID) {
    return (fetch(SINGLE_CHARACTER_API + characterID)
        .then(response => response.json())
        .then(json => {
            const character = new Character(json.id, json.name, json.image,
                json.species, json.gender, json.origin.name, json.location.name,
                json.created, json.episode);
            console.log("CHARACTER: ", character.getData());
            singleCharacter = character; // !!! store it for next `then` blocks
            return singleCharacter;
        }).then(character => fetchEpisodeNames(character)
        ).then(episodes => {
            singleCharacter.addEpisodesData(episodes);
            return singleCharacter; // must return character again after fetching
            // all the episodes
        })
        .catch(error => console.log(error.message))
    );
}

/** Creates CharacterBasic instances from raw data and stores them in 
 * charactersList */
function storeCharacters(rawDataList) {
    console.log("rawDataList:", rawDataList)
    for (let c of rawDataList) {
        charactersList.push(new CharacterBasic(c.id, c.name, c.image));
    }
    for (let c of charactersList) console.log(c.getData());
}

// episode list json format:
// "episode": [
//     "https://rickandmortyapi.com/api/episode/6",
//     "https://rickandmortyapi.com/api/episode/7",
//     "https://rickandmortyapi.com/api/episode/8",
//     "https://rickandmortyapi.com/api/episode/9"...
// ];
// source: https://stackoverflow.com/questions/62674886/js-fetch-api-how-to-fetch-content-from-multiple-files-with-one-async-function

function fetchEpisodeNames(character) {
    const episodeJSONlinks = character.episodesAPI;
    // console.log(episodeJSONlinks);
    return Promise.all(
        episodeJSONlinks.map(ep => fetch(ep))
    ).then(
        results => Promise.all(
            results.map(result => result.json())
        )
    ).then(rawJSON => {
        const episodesList =
            rawJSON.map(episode => (new Episode(episode.id, episode.name)));
        character.addEpisodesData(episodesList);
        return episodesList;
    }
    ).catch(error => console.log(error.message));
}

function likeCharacter(characterID) {
    for (let c of charactersList) {
        if (c.id === characterID) {
            c.like();
            console.log(c.getData());
            return;
        }
    }
    console.log("likeCharacter: this shouldn't happen");
}

function getTotalPages() {
    return totalPages;
}

function getTotalCharacters() {
    return totalCharacters;
}

// for debugging
function printCharactersList() {
    for (let c of charactersList) console.log(`${c.getData()}; episodes: `, c.episodes);
}

function getCharacterByID(id) {
    // returning characterList[id-1] would be faster, but that relies on the id
    // value of characters, which this app has no control over
    for (let c of charactersList) {
        if (c.id === id) return c;
    }
    return null; // this shouldn't happen
}
function addEpisodesListToCharacterInfo(characterID, episodesList) {
    getCharacterByID(characterID).addEpisodesData(episodesList);
    printCharactersList();
}
export {
    fetchCharacters, fetchSingleCharacter, likeCharacter, getTotalPages,
    getTotalCharacters, getCharacterByID, fetchEpisodeNames,
    addEpisodesListToCharacterInfo,
};

// console.log("single character:", fetchCharacterDetails(1).then(console.log));

// console.log(fetchEpisodeNames(1));