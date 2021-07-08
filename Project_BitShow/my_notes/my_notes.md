## URL

On doc ready:
Init vars
Set event listeners
Get url
If search param === q ??? Not sure I need to handle that separately if I don't have diff landing vs search page
if search param === showname, search single show details
Else show top 50/ landing page

OnSearch(e){
If(enter && e.val()) {
Clear url from id, if any
Set url to += ?/q=e.currentTarget.val()
Reset everything else (including show list)
Do the search
}
}

OnDetails(e){
Use EMBEDDING!!!
fetchDetails, fetchEpisodes, fetchCast, fetchseasons, fetch...,
render;
}

EMBEDDING supported for single search: http://api.tvmaze.com/singlesearch/shows?q=girls&embed=episodes

You need the single show search, so you also need to decode the name because of whitespace and special chars:

The decodeURIComponent function will handle correctly the decoding:

decodeURIComponent("this%20is%20the%20string"); // "this is the string"

https://stackoverflow.com/questions/2918336/javascript-replace-query-string-with-a-space

-   The root url is http://api.tvmaze.com

## Show search

URL: /search/shows?q=:query
Example: http://api.tvmaze.com/search/shows?q=girls

## Show single search

URL: /singlesearch/shows?q=:query
Example: http://api.tvmaze.com/singlesearch/shows?q=girls
Example: http://api.tvmaze.com/singlesearch/shows?q=girls&embed=episodes

## Popularity

**------>** http://api.tvmaze.com/shows -> json list of show objs sorted by **weight**, exactly what you need ( explanation from https://www.tvmaze.com/threads/26/adding-new-features-to-the-api : internally we use a "weight" to sort shows & people, which is based on a combination of votes, follow counts and page views.)

https://www.tvmaze.com/threads/2749/what-do-score-represents-from-show-search
**`weight`**: Overall show popularity (0-100). A value of 100 would indicate that it is the most popular show.
`ranking`->average: Average rank given by users (1-10).
`score`: relevance of the search result

## Description

**----->** the value of the entry is preformatted in HTML!!!

```
response.show.summary
```

## Embedding

https://www.tvmaze.com/api#embedding
...our API resources can contain **links to related URLs**.

For example, http://api.tvmaze.com/shows/1?embed=episodes will serve the show's main information and its episode list in one single response.

Embedding multiple links is possible with the array syntax:
http://api.tvmaze.com/shows/1?embed[]=episodes&embed[]=cast

## Images

If an image exists, the image property will be a dictionary containing a "medium" and "original" key, referring to the image in fixed resized dimensions or in the original uploaded resolution. If no image exists yet, the image property will be NULL.

# PROJECT SPECS

-   Landing Page

    -   **Top 50 TV shows** should be presented on this page (**------>** http://api.tvmaze.com/shows -> json list/ARRAY of show objs sorted by **weight**);
        -   To get data
            `response[i].name; response[i].image.medium // img src, but response[i].image can be null!!!`
    -   When the user clicks on the show, he’s **redirected to the _Show Info Page_**
    -   The user can use **search box** on the page to search for shows
    -   Searching is done on all available shows (TvMaze API), not just on the local list
    -   When presenting the result in **search dropdown list**, don’t list more than 10 shows

-   Show Info Page

    -   ## The page should contain TV show **name, show poster and description**
        -   To get data:
            `response[i].show.name; response[i].show.image.medium; response[i].show.summary`
            **response[i].show.image can be NULL**
    -   Provide **number of seasons** as well as the **start and end date of each season**

        -   URL: /shows/:id/seasons
            Example: http://api.tvmaze.com/shows/1/seasons
            **ARRAY OF SEASONS, so `response.length === nSeasons`**

            `response[i].premiereDate` ---> start date for each(`i`) season
            `response[i].endDate` ---> end date

    -   Provide the cast list
        Each cast item is a combination of a person and a character. Items are ordered by importance
        -   URL: /shows/:id/cast
            Example: http://api.tvmaze.com/shows/1/cast
            `response[castMemberIndex].person.name` ---> actor's name
            `response[castMemberIndex].character.name` ---> character they are playing

-   Extra features

    -   Show crew

        -   Each crew item is a combination of a person and their crew type.
            URL: /shows/:id/crew
            Example: http://api.tvmaze.com/shows/1/crew

    -   Show AKA’s

        -   list of AKA's (aliases) for a show. An AKA with its country set to null indicates an AKA in the show's original country
            URL: /shows/:id/akas
            Example: http://api.tvmaze.com/shows/1/akas

    -   Show episode list
        -   complete list of episodes for the given show. Episodes are returned in their airing order
        -   URL: /shows/:id/episodes
            Example: http://api.tvmaze.com/shows/1/episodes
        -
    -   Responsive design

singleShowInfo.name
var imgsrc = (singleShowInfo.image) ? singleShowInfo.image.medium : NO_IMAGE_PLACEHOLDER_PATH;
singleShowInfo.summary

var nSeasons = singleShowInfo.\_embedded.seasons.length;
for (nSeasons) {
singleShowInfo.\_embedded.premiereDate + " - " + singleShowInfo.\_embedded.endDate
}

var crew = singleShowInfo.\_embedded.crew; //array of objs {type: "str", person: {}}
crew[i].name -> crew[i].person.name

var castList = singleShowInfo.\_embedded.cast; // an array
for (castList.length) {
singleShowInfo.\_embedded.cast.character + " played by" + singleShowInfo.\_embedded.cast.person
}

var akas = singleShowInfo.\_embedded.akas;
// AKA with its country set to null indicates an AKA in the show's original country
// array of objs in the format:

```
akas: Array(3)
0:
country: {name: "Russian Federation", code: "RU", timezone: "Asia/Kamchatka"}
name: "Под куполом"
__proto__: Object
1: {name: "A búra alatt", country: {…}}
2: {name: "Под купола", country: {…}}
length: 3
__proto__: Array(0)
```

var episodes = singleShowInfo.\_embedded.episodes; // array of objs
var episodeName = singleShowInfo.\_embedded.episodes[i].name
