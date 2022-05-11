import * as model from './model.js';
import leagueNameView from './Views/leagueNameView.js';
import matchView from './Views/matchView.js';
import paginationView from './Views/paginationView.js';
import resultsView from './Views/resultsView';
import searchView from './Views/searchView.js';

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
    console.log(model.state.search.results);
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
    matchView.renderErrorMessage();
  }
};

const init = function () {
  //on form submit
  searchView.addHandlerSearch(controlSearchResults);
  //on click of pagination buttons
  paginationView.addHandlerPages(controlPagination);
  //on selected match hash
  matchView.addHandlerRenderMatch(controlMatchRendered);
};
init();

console.log('1434');
console.log('g4tg45');
