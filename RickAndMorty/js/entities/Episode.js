class Episode {
    #number;
    #name;
    constructor(number, name) {
        this.#number = number;
        this.#name = name;
    }

    get number() {
        return this.#number;
    }
    get name() {
        return this.#name;
    }
}

export { Episode }