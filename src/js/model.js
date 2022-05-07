export const state = {
  match: {},
  search: {
    query: '',
    results: [],
  },
};

import { API_KEY } from './config';

/**
 * gets the searched league's matches from the API
 * @param {string} query The queried 'name' of the league by the user
 * @returns {string} id of the league
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

    //passing the results to the state object
    state.search.results = leagues.map(match => {
      return {
        date: match.fixture.timestamp,
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
  } catch (err) {
    throw err;
  }
};

// "https://v3.football.api-sports.io/fixtures?league=39&season=2019"

// fixture:
// date: "2020-06-24T17:00:00+00:00"
// id: 157321
// periods: {first: 1593018000, second: 1593021600}
// referee: "Andy Madley, England"
// status: {long: 'Match Finished', short: 'FT', elapsed: 90}
// timestamp: 1593018000
// timezone: "UTC"
// venue: {id: 565, name: 'Carrow Road', city: 'Norwich, Norfolk'}
// [[Prototype]]: Object
// goals: {home: 0, away: 1}
// league:
// country: "England"
// flag: "https://media.api-sports.io/flags/gb.svg"
// id: 39
// logo: "https://media.api-sports.io/football/leagues/39.png"
// name: "Premier League"
// round: "Regular Season - 31"
// season: 2019
// [[Prototype]]: Object
// score:
// extratime: {home: null, away: null}
// fulltime: {home: 0, away: 1}
// halftime: {home: 0, away: 0}
// penalty: {home: null, away: null}
// [[Prototype]]: Object
// teams:
// away: {id: 45, name: 'Everton', logo: 'https://media.api-sports.io/football/teams/45.png', winner: true}
// home: {id: 71, name: 'Norwich', logo: 'https://media.api-sports.io/football/teams/71.png', winner: false}

// "https://v3.football.api-sports.io/leagues?name=premier league"
