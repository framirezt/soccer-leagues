import * as model from './model.js';
import leagueNameView from './Views/leagueNameView.js';
import matchView from './Views/matchView.js';
import paginationView from './Views/paginationView.js';
import resultsView from './Views/resultsView';
import searchView from './Views/searchView.js';
import watchListView from './Views/watchListView.js';

const controlSearchResults = async function () {
  try {
    //emptying results before loading new ones
    model.state.search.results = [];

    resultsView.addBackground();
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    //guard clause
    if (!query) return;
    console.log(query);

    await model.loadSearchResults(query);
    leagueNameView.render(model.state.search.results[0]);
    resultsView.render(model.loadPageResults());
    paginationView.render(model.state.search);
    // matchView.render(model.state.match);
  } catch (err) {
    resultsView.renderErrorMessage(err);
  }
};

const controlPagination = async function (gotoPage) {
  resultsView.render(model.loadPageResults(gotoPage));
  paginationView.render(model.state.search);
};

const controlMatchRendered = async function () {
  try {
    matchView.renderSpinner();
    const hashId = window.location.hash.slice(1);
    await model.loadMatch(hashId);

    matchView.render([model.state.match, hashId, model.state.search.results]);
  } catch (err) {
    console.log(err);
    matchView.renderErrorMessage();
  }
};

const controlWatchList = function () {
  //finding the current match in the results array
  const hashId = window.location.hash.slice(1);
  const matchIndex = model.state.search.results.findIndex(
    match => (match.id = hashId)
  );
  const curMatch = model.state.search.results[matchIndex];
  if (!curMatch.watchListed) model.addToWatchList(curMatch);
  else if (curMatch.watchListed) model.removeFromWatchList(curMatch);

  watchListView.render(model.state.watchList);

  console.log(model.state.watchList);
  console.log(curMatch);
};

const init = function () {
  //on form submit
  searchView.addHandlerSearch(controlSearchResults);
  //on click of pagination buttons
  paginationView.addHandlerPages(controlPagination);
  //on selected match hash
  matchView.addHandlerRenderMatch(controlMatchRendered);
  //on click of bookmark button, save/unsave from watch list
  matchView.addHandlerBookmark(controlWatchList);
};
init();

console.log('1434');
console.log('1434');
console.log('14930frf');
console.log('g4tg45');
