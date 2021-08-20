
import { CharacterBasic } from "./CharacterBasic.js";
/**
 * Character object with detailed information, required for the detailed view.
 */
class Character extends CharacterBasic {
    // never use raw data!
    // always convert from json to object!
    #species;
    #gender;
    #origin;
    #location;
    #episodes; // added thru addEpisodesData()
    #dateCreated;
    #episodesAPI; //---> list of api links for each episode in the format below:
    // [
    //     "https://rickandmortyapi.com/api/episode/6",
    //     "https://rickandmortyapi.com/api/episode/7",
    //     "https://rickandmortyapi.com/api/episode/8",
    //     "https://rickandmortyapi.com/api/episode/9"...
    // ];
    constructor(id, name, imgURL, species, gender, origin, location,
        dateCreated, episodesAPI) {
        super(id, name, imgURL);
        this.#gender = gender;
        this.#species = species;
        this.#origin = origin;
        this.#location = location;
        this.#dateCreated = Character.#parseDate(dateCreated); // static methods
        // called on the class
        this.#episodesAPI = episodesAPI;
    }

    /**
     * @param {string} dateString 
     * @returns {Date} date object corresponding to given string
     */
    static #parseDate(dateString) {
        return Date.parse(dateString);
    }

    /**
     * Returns a formatted string representation of given date
     * @param {Date} date 
     */
    static #formatDate(date) {
        return (new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' })
            .format(date));
    }
    get dateCreated() {
        return Character.#formatDate(this.#dateCreated);
    }
    get gender() {
        return this.#gender;
    }
    get species() {
        return this.#species;
    }
    get origin() {
        return this.#origin;
    }
    get location() {
        return this.#location;
    }
    get episodesAPI() {
        return this.#episodesAPI;
    }
    /**
     * 
     * @param {array} episodesList array of Episode objects
     */
    addEpisodesData(episodesList) {
        this.#episodes = episodesList;
    }
    get episodes() {
        return this.#episodes;
    }
    

}

export { Character };