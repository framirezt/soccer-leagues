import { API_KEY, indexOfMatch, RESULTS_PER_PAGE } from './config';

// "https://v3.football.api-sports.io/fixtures?league=39&season=2019"

export const state = {
  match: [],
  search: {
    query: '',
    results: [],
    page: 1,
    results_per_page: RESULTS_PER_PAGE,
  },
};

/**
 * Gets the searched league's matches from the API and adds the results to the state object to then be rendered. Sets starting page to 1 so they are rendered from the start.
 * @param {string} query The queried 'name' of the league by the user
 * @todo add season input
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
            console.log(err);
          }
        }
        return loadTeams();
      });

    // console.log(leagues);

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
      };
    });
    state.search.results = state.search.results.sort(
      (a, b) => b.date_time - a.date_time
    );
    console.log(state.search.results);
    // state.search.results = state.search.results.sort((a,b) => a.date -b.date)
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
 * This function gets the statistics from the match clicked on to be loaded to the container
 * Sets the state.match to the match clicked on with their corresponding stats
 * @param {number} hashId The hash id
 */
export const loadMatch = async function (hashId) {
  try {
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

    state.match = match_stats.map(team => {
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
    console.log(state.match); //try it
  } catch (err) {
    throw Error;
  }
};
