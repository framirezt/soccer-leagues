export const API_KEY = 'd41a5f5e4be7a3223cc493112918a062'; //original, quitar el 2

export const RESULTS_PER_PAGE = 5;

//to get scores, teams, logos, etc from the search.results array returns index of the match in results array
export const indexOfMatch = function (hashId) {
  return model.state.search.results.map(match => match.id).indexOf(hashId);
};
