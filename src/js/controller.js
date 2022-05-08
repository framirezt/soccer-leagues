import * as model from './model.js';
import leagueNameView from './Views/leagueNameView.js';
import paginationView from './Views/paginationView.js';
import resultsView from './Views/resultsView';
import searchView from './Views/searchView.js';

const controlSearchResults = async function () {
  try {
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
  } catch (err) {
    resultsView.renderErrorMessage(err);
  }
};

const init = function () {
  searchView.addHandlerSearch(controlSearchResults);
  console.log('ghet');
};
init();

console.log('grewg');
