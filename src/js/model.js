import { API_KEY, RESULTS_PER_PAGE } from './config';

// "https://v3.football.api-sports.io/fixtures?league=39&season=2019"

export const state = {
  match: {},
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
        const [league] = data.filter(league =>
          league.league.name.includes(`${query}`)
        );
        return league.league.id;
      })
      .then(id => {
        //async function
        async function loadTeams() {
          try {
            const teams = await fetch(
              `https://v3.football.api-sports.io/fixtures?league=${id}&season=2020`,
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
      return {
        date: match.fixture.date,
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
