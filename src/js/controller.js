import * as model from './model';
import resultsView from './Views/resultsView';

// model.loadTeams();
// model.loadSearchResults('Euro Championship');

async function loadState() {
  model.loadSearchResults('Euro Championship');
  console.log(model.state);
}
// loadState();

const controlSearchResults = async function () {
  resultsView.renderSpinner();

  await model.loadSearchResults('Euro Championship');
  console.log(model.state.search.results);
};

const init = function () {
  controlSearchResults();
};

init();
