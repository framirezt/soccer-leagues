import * as model from './model.js';
import leagueNameView from './Views/leagueNameView.js';
import matchView from './Views/matchView.js';
import paginationView from './Views/paginationView.js';
import resultsView from './Views/resultsView';
import searchView from './Views/searchView.js';
import watchListView from './Views/watchListView.js';

/**
 * This function gets the query and renders all the data into the results view
 * If an error ocurrs renders a message to the results view
 */
const controlSearchResults = async function () {
  try {
    //emptying results before loading new ones
    model.state.search.results = [];

    resultsView.addBackground();
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    //guard clause
    if (!query) return;

    await model.loadSearchResults(query);
    leagueNameView.render(model.state.search.results[0]);
    resultsView.render(model.loadPageResults());
    paginationView.render(model.state.search);
    // matchView.render(model.state.match);
  } catch (err) {
    resultsView.renderErrorMessage();
  }
};

/**
 * Loads the results of the sliced array at the current state.search.page and renders the buttons on the pagination view
 * @param {number} [gotoPage = model.state.search.page] The current page of results
 */
const controlPagination = async function (gotoPage) {
  resultsView.render(model.loadPageResults(gotoPage));
  paginationView.render(model.state.search);
};

/**
 * Renders the match data into the matchView.
 */
const controlMatchRendered = async function () {
  try {
    matchView.renderSpinner();
    const hashId = window.location.hash.slice(1);
    await model.loadMatch(hashId);
    //check manana (no estaba loading el state.match)
    console.log(model.state.match);
    console.log(hashId);
    console.log(model.state.watchList);

    matchView.render([
      model.state.match,
      hashId,
      [...model.state.search.results, ...model.state.watchList],
    ]);
  } catch (err) {
    matchView.renderErrorMessage();
  }
};

/**
 * Adds the current match (from url hash) to the watch list when the bookmark button is clicked, and removes it from the list if the match is already bookmarked
 */
const controlWatchList = function () {
  //finding the current match in the results array
  const hashId = +window.location.hash.slice(1);
  const matchIndex = model.state.search.results.findIndex(
    match => match.id === hashId
  );
  const curMatch = model.state.search.results[matchIndex];
  if (!curMatch.watchListed) model.addToWatchList(curMatch);
  else if (curMatch.watchListed) model.removeFromWatchList(curMatch);

  watchListView.render(model.state.watchList);
};

/**
 * Loads the watchlisted matches to the watchList view as soon as the page loads
 */
const controlWatchListLoad = function () {
  watchListView.render(model.state.watchList);
};

/**
 * This function is called at the beginning so that all the other functions can be called whenever the event handler occurs
 */
const init = function () {
  //on website load, render watchlisted matches on watchlist view
  watchListView.addHandlerRender(controlWatchListLoad);
  //on form submit, load matches
  searchView.addHandlerSearch(controlSearchResults);
  //on click of pagination buttons, change page
  paginationView.addHandlerPages(controlPagination);
  //on selected match hash, render match
  matchView.addHandlerRenderMatch(controlMatchRendered);
  //on click of bookmark button, save/unsave from watch list
  matchView.addHandlerBookmark(controlWatchList);
};
init();

console.log('1434');

//tratar manana
console.log(model.state.watchList);
