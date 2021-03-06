import { API_KEY, RESULTS_PER_PAGE } from './config';

// "https://v3.football.api-sports.io/fixtures?league=39&season=2019"

export const state = {
  match: {
    stats: [],
    lineups: [],
  },
  search: {
    query: '',
    results: [],
    page: 1,
    results_per_page: RESULTS_PER_PAGE,
  },
  watchList: [],
};

/**
 * Gets the searched league's matches from the API and adds the results to the state object to then be rendered. Sets starting page to 1 so they are rendered from the start. The results are sorted by date, with the latest match first, so the latest match is always first.
 * @param {string} query The queried 'name' of the league by the user
 */
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    //gets all matches from a league
    const leagues = await fetch('https://v3.football.api-sports.io/leagues', {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'v3.football.api-sports.io',
        'x-rapidapi-key': `${API_KEY}`,
      },
    })
      .then(response => {
        if (!response.ok) throw new Error('Please enter a valid League!');
        return response.json();
      })
      .then(data => data.response)
      .then(data => {
        //filter data to only get the data of the queried league
        const [league] = data.filter(league => {
          //convert search and league names to lower case in case user doesn't use upper cases
          const leagueName = league.league.name.toLowerCase();
          return leagueName.includes(`${query.toLowerCase()}`);
        });
        const seasons = league.seasons;
        //returns the id and the most previous season of the searched leage
        return [league.league.id, seasons[seasons.length - 1].year];
      })
      .then(([id, season]) => {
        //async function
        async function loadTeams() {
          try {
            const teams = await fetch(
              `https://v3.football.api-sports.io/fixtures?league=${id}&season=${season}`,
              {
                method: 'GET',
                headers: {
                  'x-rapidapi-host': 'v3.football.api-sports.io',
                  'x-rapidapi-key': `${API_KEY}`,
                },
              }
            )
              .then(response => response.json())
              .then(data => data.response);
            // console.log(id);
            // console.log(teams);
            return teams;
          } catch (err) {
            throw err;
          }
        }
        return loadTeams();
      });

    //passing the results to the state object to access the later
    state.search.results = leagues.map(match => {
      const date = match.fixture.date;
      const newDate = new Date(
        date.slice(0, 4),
        date.slice(5, 7) - 1,
        date.slice(8, 10),
        date.slice(11, 13),
        date.slice(14, 16)
      );
      return {
        date: match.fixture.date,
        date_time: newDate.getTime(),
        home_team: {
          goals: match.goals.home,
          name: match.teams.home.name,
          logo: match.teams.home.logo,
        },
        away_team: {
          goals: match.goals.away,
          name: match.teams.away.name,
          logo: match.teams.away.logo,
        },
        league: {
          league_name: match.league.name,
          league_logo: match.league.logo,
        },
        id: match.fixture.id,
        watchListed: false,
      };
    });
    state.search.results = state.search.results.sort(
      (a, b) => b.date_time - a.date_time
    );
    //set page to 1 to display queried matches from page 1
    state.search.page = 1;
  } catch (err) {
    throw err;
  }
};

/**
 * Loads the results page with only the results from each page
 * @param {number} [page = state.search.page] The page number that will be rendered
 * @returns The sliced array of matches for each page
 */
export const loadPageResults = function (page = state.search.page) {
  //setting the state's page to the input page
  state.search.page = page;
  //slicing the results array with start and end
  //start on page 2 would be (2-1)*5 = 5th element of the array
  const start = (page - 1) * state.search.results_per_page;
  //the slice method does not include the end parameter so must remove the -1
  const end = page * state.search.results_per_page;

  return state.search.results.slice(start, end);
};

/**
 * This function gets the statistics/lineups from the match clicked on to be loaded to the container
 * Sets the state.match to the match clicked on with their corresponding stats and lineups
 * @param {number} hashId The hash id
 */
export const loadMatch = async function (hashId) {
  try {
    //-------------------------- get the stats ----------------------------
    const match_stats = await fetch(
      `https://v3.football.api-sports.io/fixtures/statistics?fixture=${hashId}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'v3.football.api-sports.io',
          'x-rapidapi-key': `${API_KEY}`,
        },
      }
    )
      .then(response => response.json())
      .then(data => data.response);

    state.match.stats = match_stats.map(team => {
      return {
        shots_on_target: {
          stat_name: team.statistics[0].type,
          value: team.statistics[0].value,
        },
        total_shots: {
          stat_name: team.statistics[2].type,
          value: team.statistics[2].value,
        },
        fouls: {
          stat_name: team.statistics[6].type,
          value: team.statistics[6].value,
        },
        corner_kicks: {
          stat_name: team.statistics[7].type,
          value: team.statistics[7].value,
        },
        ball_possession: {
          stat_name: team.statistics[9].type,
          value: team.statistics[9].value,
        },
        yellow_cards: {
          stat_name: team.statistics[10].type,
          value: team.statistics[10].value,
        },
        red_cards: {
          stat_name: team.statistics[11].type,
          value: team.statistics[11].value,
        },
        total_passes: {
          stat_name: team.statistics[13].type,
          value: team.statistics[13].value,
        },
      };
    });

    //-------------------------- get the lineups -------------------------------
    const match_lineups = await fetch(
      `https://v3.football.api-sports.io/fixtures/lineups?fixture=${hashId}`,
      {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'v3.football.api-sports.io',
          'x-rapidapi-key': `${API_KEY}`,
        },
      }
    )
      .then(response => response.json())
      .then(data => data.response);

    state.match.lineups = match_lineups.map(lineup => {
      return {
        starting_players: lineup.startXI,
        substitutes: lineup.substitutes,
        formation: lineup.formation,
        team_info: {
          name: lineup.team.name,
          logo: lineup.team.logo,
        },
      };
    });
  } catch (err) {
    throw Error;
  }
};

/**
 * Persists the watchlist matches on the local storage so they can be re rendered when the user comes back
 */
const persistWatchList = function () {
  localStorage.setItem('watch_list', JSON.stringify(state.watchList));
};

/**
 * This function adds the current match to the watching list and updates the local storage to the current state.watchlist
 * @param {object} curMatch The current match rendered in the matchView and with the id of the url hash
 */
export const addToWatchList = function (curMatch) {
  state.watchList.push(curMatch);

  curMatch.watchListed = true;

  //updating the local storage
  persistWatchList();
};

/**
 * This function removes the current match form the watching list and updates the local storage to the current state.watchlist
 * @param {object} curMatch The current match rendered in the matchView and with the id of the url hash
 */
export const removeFromWatchList = function (curMatch) {
  const watchListIndex = state.watchList.findIndex(
    match => match.id === curMatch.id
  );

  state.watchList.splice(watchListIndex, 1);

  curMatch.watchListed = false;
  //updating the local storage
  persistWatchList();
};

/**
 * This function is called at the beginning so the matches saved on the local storage can be added to the watchList array to then be displayed
 */
const init = function () {
  const storage = localStorage.getItem('watch_list');
  if (storage) state.watchList = JSON.parse(storage);
};

init();
