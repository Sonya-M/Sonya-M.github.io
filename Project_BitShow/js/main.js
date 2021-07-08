var $searchBox;
var $resultsDiv;
var $searchSuggestions;

var mouseOverSearchSuggestions = false; // true if mouse is over search suggestion links,
// false otherwise

var showList = [];
var singleShowInfo; // fetched json obj containing data for a single show
var suggestionsList = [];

const ENTER_CODE = 13;
const ESCAPE_CODE = 27;
const MAX_LIST_ITEMS = 10;
const MAX_SUGGESTIONS = 10;

const HOME_URL = "./index.html";
const GET_TOP_50_URL = "http://api.tvmaze.com/shows"; // -> json list/ARRAY of show objs sorted by **weight**)
const SEARCH_ROOT_URL = "http://api.tvmaze.com";
const SEARCH_SHOWS_ENDPOINT = "/search/shows";
// EMBEDDING EXAMPLE: http://api.tvmaze.com/shows/1?embed[]=episodes&embed[]=cast
// where 1 is the show id
// template: GET_SHOW_BY_ID_ROOT_URL + id + EMBEDDED_PARAMS;
const GET_SHOW_BY_ID_ROOT_URL = "http://api.tvmaze.com/shows/";
// embedded params for single show search:
const EMBEDDED_PARAMS = "?embed[]=seasons&embed[]=episodes&embed[]=cast&embed[]=crew&embed[]=cast&embed[]=akas"

const NO_IMAGE_PLACEHOLDER_PATH = "./imgs/no_img_placeholder.png";
const NO_INFO_HTML = "<p>No information available</p>";

$(document).ready(function () {
    initVariables();
    $searchBox.focus();
    setEventHandlers();

    var showID = getSearchParam();
    if (showID) {
        fetchSingleShowInfo(showID);
    } else {
        fetchTop50();
    }
});

function getSearchParam() {
    var url = window.location.href;
    var idStartIndex = url.lastIndexOf("id=");
    if (idStartIndex >= 0) {
        showID = (url.substring(url.lastIndexOf("id=") + 3));
        return showID;
    } // else returns undefined
}

function initVariables() {
    $searchBox = $("#search-box");
    $resultsDiv = $("#resultsDiv");
    $searchSuggestions = $("#dropdown-search-suggestions");
}

function setEventHandlers() {
    $searchBox.on("keydown", onSearch);
    $searchBox.on("keyup", onType);
    $searchBox.on("focus", clearInput);
    $searchSuggestions.on("mouseover", function () {
        mouseOverSearchSuggestions = true;
    });
    $searchSuggestions.on("mouseout", function () {
        mouseOverSearchSuggestions = false;
    });
    $searchBox.on("blur", function () {
        if (!mouseOverSearchSuggestions) $searchSuggestions.removeClass("visible")
    });
}

function onSearch(event) {
    var query = $searchBox.val();
    if (event.keyCode === ENTER_CODE) {
        $searchBox.blur();
        $searchSuggestions.removeClass("visible");
        if (query) fetchShows(query);
    } else if (event.keyCode === ESCAPE_CODE) {
        $searchSuggestions.removeClass("visible");
    }
}
function onType() {
    var query = $searchBox.val();
    getSearchSuggestions(query);

}
function getSearchSuggestions(query) {
    $.ajax({
        url: SEARCH_ROOT_URL + SEARCH_SHOWS_ENDPOINT,
        method: "GET",
        data: {
            q: query,
        },
    }).done(function (response) {
        suggestionsList = [];
        var max = Math.min(response.length, MAX_SUGGESTIONS);
        for (var i = 0; i < max; i++) {
            suggestionsList.push(response[i].show);
        }
        console.log("suggestionsList in done()", suggestionsList);
        renderSuggestions();
    }).fail(function (jqXHR) {
        console.log("Error on fetching suggestions!");
    })
}

function renderSuggestions() {
    $searchSuggestions.addClass("visible");
    console.log("suggestionsList in render()", suggestionsList);
    if (suggestionsList.length === 0) {
        $searchSuggestions.html("");
        return;
    }
    $searchSuggestions.html("");
    for (var i = 0; i < suggestionsList.length; i++) {
        $searchSuggestions.append("<a href='" + HOME_URL + "?id=" + parseInt(suggestionsList[i].id) + "'>" + suggestionsList[i].name + "</a>")
    }
}

function clearInput() {
    $searchBox.val("");
}

function fetchShows(query) {
    $.ajax({
        url: SEARCH_ROOT_URL + SEARCH_SHOWS_ENDPOINT,
        method: "GET",
        data: {
            q: query,
        },
    }).done(function (response) {
        showList.splice(0, showList.length);
        // for loop to extract only show objs
        for (var i = 0; i < response.length; i++) {
            showList.push(response[i].show);
        }
        console.log(showList);
        renderShows();
    }).fail(function (jqXHR) {
        reportError("ERROR", jqXHR.status);
    })
}

// shows are already sorted by popularity (the key is "weight")
// https://www.tvmaze.com/threads/26/adding-new-features-to-the-api :
// "internally we use a "weight" to sort shows & people, which is based on a combination 
// of votes, follow counts and page views."
function fetchTop50() {
    $.ajax({
        url: GET_TOP_50_URL,
        method: "GET",
    }).done(function (response) {
        var max = Math.min(response.length, 50);
        showList = response.slice(0, max);
        console.log(showList);
        renderShows();
    })
}

function fetchSingleShowInfo(id) {
    $.ajax({
        url: GET_SHOW_BY_ID_ROOT_URL + id + EMBEDDED_PARAMS,
        method: "GET",
    }).done(function (response) {
        singleShowInfo = response;
        console.log(response);
        renderSingleShowInfo();
    }).fail(function (jqXHR) {
        reportError("ERROR", jqXHR.status);
    })
}

function renderShows() {
    $resultsDiv.html("");
    if (showList.length === 0) {
        reportError("Sorry, no results");
        return;
    }
    if (showList.length === 50) { // otherwise it's 10
        $resultsDiv.append("<h1 class='h1 text-center'>Popular Shows</h1>");
    }
    for (var i = 0; i < showList.length; i++) {
        var $showCard = $("<a>"); // will make the whole card link to details url (see below)
        $showCard.append($("<div>"));
        $showCard.addClass("col-sm-6 col-md-4 col-lg-3 card showCard m-1");
        $showCard.attr("data-id", showList[i].id); // might need it
        if (!showList[i].image) { // sometimes img is null
            $showCard.append("<img src='" + NO_IMAGE_PLACEHOLDER_PATH + "'>");
        } else {
            $showCard.append("<img src='" + showList[i].image.medium + "'>");
        }
        $showCard.append("<h6 class='show-name'>" + showList[i].name + "</h6>");
        $showCard.attr("href", HOME_URL + "?id=" + parseInt(showList[i].id));
        $showCard.attr("target", "_blank");
        $resultsDiv.append($showCard);
    }
}

function renderSingleShowInfo() {
    $resultsDiv.html("");
    $resultsDiv.addClass("innerContainer singleShowDisplay");
    console.log(singleShowInfo);
    $resultsDiv.append("<h1 class= 'h1 text-center'>" + singleShowInfo.name + "</h1>")
    var imgSrc = (singleShowInfo.image) ? singleShowInfo.image.original : NO_IMAGE_PLACEHOLDER_PATH;
    $resultsDiv.append("<div class='col-md-8'><img src='" + imgSrc + "'></div>");
    var $details = $("<div>");
    $details.addClass("col-md-4");
    $details.append(getSeasonsList());
    $details.append(getCastList());
    $resultsDiv.append($details);
    $resultsDiv.append("<div class='col'>" + ((singleShowInfo.summary) ? (singleShowInfo.summary) : "No information available") + "</div>");

    renderExtraSingleShowDetails();
}

function renderExtraSingleShowDetails() {
    $resultsDiv.append("<h2 class='text-center text-info'>Extra Details</h2>");
    renderEpisodes();
    renderCrew();
    renderAKAs();
}

function linkVisibilityBtnToElement($button, $elementToToggle) {
    $elementToToggle.addClass("invisible");
    $button.addClass("btn btn-secondary")
    $button.on("click", function () {
        $elementToToggle.toggleClass("invisible");
    })
}

function renderCrew() {
    var $toggleBtn = $("<button>Crew</button>");
    $resultsDiv.append($toggleBtn);
    $crewList = getCrewList();
    linkVisibilityBtnToElement($toggleBtn, $crewList);
    $resultsDiv.append($crewList);
}

function renderAKAs() {
    var $toggleBtn = $("<button>AKAs</button>");
    $resultsDiv.append($toggleBtn);
    $akaList = getAKAs();
    linkVisibilityBtnToElement($toggleBtn, $akaList);
    $resultsDiv.append($akaList);
}

function getAKAs() {
    var $list = $("<ul>");
    var akasList = singleShowInfo._embedded.akas;
    if (!akasList || !akasList.length) {
        $list.append("No information available");
    } else {
        for (var i = 0; i < akasList.length; i++) {
            $list.append("<li>" + akasList[i].name + "</li>")
        }
    }
    return $list;
}

function getCrewList() {
    var $list = $("<ul>");
    var crewList = singleShowInfo._embedded.crew; // array of objs
    if (!crewList || crewList.length === 0) {
        $list.append("No information available");
    } else {
        for (var i = 0; i < crewList.length; i++) {
            $list.append("<li>" + "<strong>" + crewList[i].type + ": </strong>" + crewList[i].person.name + "</li>")
        }
    }
    return $list;
}

function renderEpisodes() {
    var $toggleBtn = $("<button>Episodes List</button>");
    $resultsDiv.append($toggleBtn);
    $episodeListTable = getEpisodesListTable();
    linkVisibilityBtnToElement($toggleBtn, $episodeListTable);
    $resultsDiv.append($episodeListTable);
}

function getEpisodesListTable() {
    var episodes = singleShowInfo._embedded.episodes;
    if (episodes.length === 0) {
        return ($("<p>No information available</p>"))
    }
    var $table = $("<table>");
    $table.addClass("table table-striped");
    $thead = $("<thead>");
    var $row = $("<tr>");
    $row.append("<th> " + "season" + " </th>");
    $row.append("<th> " + "ep #" + " </th>");
    $row.append("<th> " + "episode name" + " </th>");
    $thead.append($row);
    $table.append($thead);
    var $tbody = $("<tbody>");
    for (var i = 0; i < episodes.length; i++) {
        var $row = $("<tr>");
        $row.append("<td> " + episodes[i].season + " </td>");
        $row.append("<td> " + episodes[i].number + " </td>");
        $row.append("<td> " + episodes[i].name + " </td>");
        $tbody.append($row);
    }
    $table.append($tbody);
    return $table;
}

function getSeasonsList() {
    var $listDiv = $("<div>");
    var seasons = singleShowInfo._embedded.seasons;
    $listDiv.append("<h3>Seasons(" + seasons.length + ")</h3>");
    var $seasonsList = $("<ul>");
    if (seasons.length === 0) {
        $seasonsList.append(NO_INFO_HTML);
    } else {
        for (var i = 0; i < seasons.length; i++) {
            if (seasons[i].premiereDate === null
                || seasons[i].endDate === null) {
                $seasonsList.append("<li>" + "No information available" + "</li>");
            } else {
                $seasonsList.append("<li>" + seasons[i].premiereDate + " - "
                    + seasons[i].endDate + "</li>");
            }
        }
    }
    $listDiv.append($seasonsList);
    return $listDiv;
}

function getCastList() {
    var $listDiv = $("<div>");
    var cast = singleShowInfo._embedded.cast;
    $listDiv.append("<h3>Cast</h3>");
    var $castList = $("<ul>");
    if (cast.length === 0) {
        $castList.append(NO_INFO_HTML);
    } else {
        var length = Math.min(cast.length, MAX_LIST_ITEMS);
        for (var i = 0; i < length; i++) {
            $castList.append("<li>" + cast[i].person.name + "</li>");
        }
    }
    $listDiv.append($castList);
    return $listDiv;
}

function reportError(message, statusCode) {
    $resultsDiv.html("");
    if (statusCode !== undefined) {
        message += ": STATUS CODE " + statusCode;
    }
    $resultsDiv.append("<h1 class='h1 errorMsg text-center'>" + message + "</h1>");
}