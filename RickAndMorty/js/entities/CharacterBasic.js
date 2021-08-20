class CharacterBasic {
    #id;
    #name;
    #imgURL;
    #liked;
    constructor(id, name, imgURL) {
        this.#id = id;
        this.#name = name;
        this.#imgURL = imgURL;
        this.#liked = false;
    }
    get id() {
        return this.#id;
    }
    get name() {
        return this.#name;
    }
    get imgURL() {
        return this.#imgURL;
    }
    like() {
        this.#liked = true;
    }
    isLiked() {
        return this.#liked;
    }
    getData() {
        return (`${this.#id}: ${this.#name}; ${this.isLiked() ? "LIKED" : ""}`);
    }
}

export { CharacterBasic };