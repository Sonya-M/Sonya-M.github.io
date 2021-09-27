// jshint esversion: 6

let likeHandler;// bound by bindLikeEventHandler()
let clickOnCharacterImgHandler; // bound by bindClickOnCharacter()

let $charactersSection;
let $nextBtn;
let $h1HomeLink;
let $messageDiv;

function initDOM() {
    $h1HomeLink = document.getElementById("h1-home-link");
    $h1HomeLink.textContent = "Rick and Morty";
    $charactersSection = document.getElementById("charactersSection");
    $nextBtn = document.getElementById("nextBtn");
    $messageDiv = document.getElementById("messageDiv");
}

function bindLikeEventHandler(handler) {
    likeHandler = handler;

}
function bindNextPageEventHandler(handler) {
    $nextBtn.addEventListener("click", handler);
}

function bindClickOnCharacter(handler) {
    clickOnCharacterImgHandler = handler;
}

function displayCharacters(charactersList) {
    $nextBtn.classList.remove("invisible");
    for (const character of charactersList) {
        const $card =
            createCharacterCard(character.id, character.name, character.imgURL);
        $charactersSection.append($card);
    }
}

function displaySingleCharacter(character) {
    const $h2 = document.createElement("h2");
    $h2.classList.add("text-center");
    $h2.textContent = character.name + "'s Profile";
    $charactersSection.innerHTML = "";
    $charactersSection.append($h2);
    $nextBtn.classList.add("invisible");
    $charactersSection.append(createProfileImg(character.imgURL));
    $charactersSection.append(createProfileTable(character));
    $charactersSection.append(createEpisodesList(character.episodes));
}


function createLikeBtn(characterID) {
    const $likeBtn = document.createElement("button");
    $likeBtn.classList.add("btn", "btn-like", "mb-2");
    $likeBtn.insertAdjacentHTML("beforeend",
        "<i class='bi bi-hand-thumbs-up'></i>" + " Like");
    $likeBtn.setAttribute("data-id", characterID);
    $likeBtn.addEventListener("click", function (e) {
        $likeBtn.classList.toggle("liked");
        likeHandler(parseInt($likeBtn.getAttribute("data-id")));

    });
    return $likeBtn;
}

function createCharacterCard(id, name, imgURL) {
    const $card = document.createElement("div");
    $card.classList.add("card", "col-sm-6", "col-md-4", "col-lg-2", "m-1");
    // $card.setAttribute("data-id", id);
    const $detailsLink = document.createElement("a");
    // instead of using `window.open("./index.html", "blank")` in 
    // main.onCharacterClick(), setting the link/anchor this way has the effect
    // of opening each details page in a separate tab:
    $detailsLink.href = "./index.html";
    $detailsLink.target = "_blank";
    const $img = document.createElement("img");
    $img.src = imgURL;
    $img.classList.add("card-img-top", "mt-2");
    $img.addEventListener("click", function () {
        clickOnCharacterImgHandler(id);
    });
    $img.addEventListener("auxclick", function () { // handle middle click too,
        // otherwise the new tab opens with initial view
        clickOnCharacterImgHandler(id);
    });
    $detailsLink.append($img);
    $card.append($detailsLink);
    $card.insertAdjacentHTML("beforeend",
        "<h5 class='card-title text-center'>" +
        name + "</h5> ");
    const $likeBtn = createLikeBtn(id);
    $card.append($likeBtn);

    return $card;
}

function createProfileTable(character) {
    // LIST of episode urls: character.episodes 
    // (format: https://rickandmortyapi.com/api/episode/36)
    const $tableDiv = document.createElement("div");
    $tableDiv.classList.add("col-md-6", "profile-div");
    const $table = document.createElement("table");
    $table.classList.add("table", "table-light");
    const $tbody = document.createElement("tbody");
    $tbody.append(createTableRow("Name:", character.name));
    $tbody.append(createTableRow("Gender:", character.gender));
    $tbody.append(createTableRow("Species:", character.species));
    $tbody.append(createTableRow("Origin:", character.origin));
    $tbody.append(createTableRow("Location:", character.location));
    $tbody.append(createTableRow("Date created:", character.dateCreated));
    $table.append($tbody);
    $tableDiv.append($table);
    return $tableDiv;
}

function createProfileImg(imgURL) {
    const $imgDiv = document.createElement("div");
    $imgDiv.classList.add("col-md-6");
    const $profileImg = document.createElement("img");
    $profileImg.classList.add("profile-img");
    $profileImg.setAttribute("src", imgURL);
    $imgDiv.append($profileImg);
    return $imgDiv;
}

function createTableRow(thText, tdText) {
    const $tr = document.createElement("tr");
    $tr.innerHTML = "<th scope='row'>" + thText + "</th><td>" + tdText + "</td>";
    return $tr;

}

function createEpisodesList(episodesList) {
    const $listDiv = document.createElement("div");
    $listDiv.classList.add("col-md-8", "episodes-list");
    $listDiv.innerHTML = "<h2>Episodes list</h2>";
    const $ul = document.createElement("ul");
    $ul.classList.add("list-group", "table");
    for (let e of episodesList) {
        $ul.append(createEpisodeListItem(e.number, e.name));
    }
    $listDiv.append($ul);
    return $listDiv;
}
function createEpisodeListItem(episodeNumber, episodeName) {
    const $li = document.createElement("li");
    $li.classList.add("list-group-item");
    $li.innerHTML =
        `<span class="episode-number">Episode #${episodeNumber}</span>: &emsp;${episodeName}`;
    return $li;
}

function displayErrorMessage(message) {
    displayMessage(message, true);
}

function displayMessage(message, error) {
    if (error) {
        $nextBtn.classList.add("invisible");
        $messageDiv.classList.add("text-center", "error-message");
    }
    else { $messageDiv.classList.add("text-center", "message") };
    $messageDiv.innerHTML = "<p>" + message + "</p>";
}

export {
    initDOM, bindClickOnCharacter, bindLikeEventHandler,
    bindNextPageEventHandler, displayCharacters, displaySingleCharacter,
    displayErrorMessage, displayMessage
};