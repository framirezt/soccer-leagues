import View from './View';
import icons from 'url:../../icons/icons.svg';
import { indexOfMatch } from '../config';

class MatchView extends View {
  parentElement = document.querySelector('.matches');
  errorMessage = 'Match not found. Please try again!';

  addHandlerRenderMatch(handler) {
    window.addEventListener('hashchange', function () {
      if (this.window.innerWidth < 600) {
        document
          .querySelector('.search-results')
          .classList.remove('sidebar_show');
      }
      handler();
    });
    //clean the hash id on reload, because the matches queried will be gone and returns match not found
    window.addEventListener('load', function () {
      this.history.pushState(
        '',
        this.document.title,
        this.window.location.pathname + this.window.location.search
      );
    });
    this.parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.toggle_results');
      if (!btn) return;
      document
        .querySelector('.search-results')
        .classList.toggle('sidebar_show');
    });
  }

  addHandlerBookmark(handler) {
    this.parentElement.addEventListener('click', function (e) {
      //setting it to only happen when the btn--round button is clickec
      const btn = e.target.closest('.btn--round');
      if (!btn) return;
      handler();
    });
  }

  generateMarkup() {
    const indexOfMatch = this.data[2]
      .map(match => match.id)
      .indexOf(+this.data[1]);

    const matchResult = this.data[2][indexOfMatch];

    const statsTeam1 = this.data[0].stats[0];
    const statsTeam2 = this.data[0].stats[1];

    const date = matchResult.date;

    const newDate = new Date(
      date.slice(0, 4),
      date.slice(5, 7) - 1,
      date.slice(8, 10),
      date.slice(11, 13),
      date.slice(14, 16)
    );

    const days = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const matchDate = `${days[newDate.getDay() - 1]} ${newDate.getDate()} ${
      months[newDate.getMonth()]
    } ${newDate.getFullYear()}`;

    const vw = window.innerWidth;

    console.log(this.data[0].lineups);

    return `
    ${
      vw > 600
        ? ''
        : '<button class="toggle_results"><span>&#9776;</span></button>'
    }
    <div class="preview">
          <div class="match_container">
            <div class="preview__lower">
              <h4 class="match_date">${matchDate}</h4>

              <div class="watchlist_btn">
                <button class="btn--round">
                  <svg class="">
                    <use href="${icons}#icon-bookmark-fill"></use>
                  </svg>
                </button>
              </div>
            </div>
            <div class="preview__upper">
              <div class="preview__team">
                <figure class="preview__fig2">
                  <img src="${matchResult.home_team.logo}" alt="Team 1" />
                </figure>
                <h2>${matchResult.home_team.name}</h2>
              </div>
              <div class="preview__data">
                <h1 class="match_score">${matchResult.home_team.goals} - ${
      matchResult.away_team.goals
    }</h1>
              </div>
              <div class="preview__team">
                <figure class="preview__fig2">
                  <img src="${matchResult.away_team.logo}" alt="Team 2" />
                </figure>
                <h2>${matchResult.away_team.name}</h2>
              </div>
            </div>
          </div>
        </div>

        <div class="matches__stats">
          <h2 class="heading--2">game statistics</h2>
          <div class="game_stats">
            <div class="stat">
              <label>${String(
                statsTeam1.shots_on_target.stat_name
              ).toUpperCase()}</label> <br />
              <div class="prog_bar">
                <p id="p1">${statsTeam1.shots_on_target.value}</p>
                <progress id="bar" max="${
                  (statsTeam1.shots_on_target.value ?? 0) +
                  (statsTeam2.shots_on_target.value ?? 0)
                }" value="${statsTeam2.shots_on_target.value ?? 0}"></progress>
                <progress id="bar2" max="${
                  (statsTeam1.shots_on_target.value ?? 0) +
                  (statsTeam2.shots_on_target.value ?? 0)
                }" value="${statsTeam2.shots_on_target.value ?? 0}"></progress>
                <p id="p2">${statsTeam2.shots_on_target.value ?? 0}</p>
              </div>
            </div>
            <div class="stat">
              <label>${String(
                statsTeam1.total_shots.stat_name
              ).toUpperCase()}</label> <br />
              <div class="prog_bar">
              <p id="p1">${statsTeam1.total_shots.value ?? 0}</p>
              <progress id="bar" max="${
                (statsTeam1.total_shots.value ?? 0) +
                statsTeam2.total_shots.value
              }" value="${statsTeam2.total_shots.value ?? 0}"></progress>
              <progress id="bar2" max="${
                (statsTeam1.total_shots.value ?? 0) +
                (statsTeam2.total_shots.value ?? 0)
              }" value="${statsTeam2.total_shots.value ?? 0}"></progress>
              <p id="p2">${statsTeam2.total_shots.value ?? 0}</p>
              </div>
            </div>
            <div class="stat">
              <label>${String(
                statsTeam1.fouls.stat_name
              ).toUpperCase()}</label> <br />
              <div class="prog_bar">
              <p id="p1">${statsTeam1.fouls.value ?? 0}</p>
              <progress id="bar" max="${
                (statsTeam1.fouls.value ?? 0) + (statsTeam2.fouls.value ?? 0)
              }" value="${statsTeam2.fouls.value ?? 0}"></progress>
              <progress id="bar2" max="${
                (statsTeam1.fouls.value ?? 0) + (statsTeam2.fouls.value ?? 0)
              }" value="${statsTeam2.fouls.value ?? 0}"></progress>
              <p id="p2">${statsTeam2.fouls.value ?? 0}</p>
              </div>
            </div>
            <div class="stat">
              <label>${String(
                statsTeam1.corner_kicks.stat_name
              ).toUpperCase()}</label> <br />
              <div class="prog_bar">
              <p id="p1">${statsTeam1.corner_kicks.value ?? 0}</p>
              <progress id="bar" max="${
                (statsTeam1.corner_kicks.value ?? 0) +
                (statsTeam2.corner_kicks.value ?? 0)
              }" value="${statsTeam2.corner_kicks.value ?? 0}"></progress>
              <progress id="bar2" max="${
                (statsTeam1.corner_kicks.value ?? 0) +
                (statsTeam2.corner_kicks.value ?? 0)
              }" value="${statsTeam2.corner_kicks.value ?? 0}"></progress>
              <p id="p2">${statsTeam2.corner_kicks.value ?? 0}</p>
              </div>
            </div>
            <div class="stat">
              <label>${String(
                statsTeam1.ball_possession.stat_name
              ).toUpperCase()}</label> <br />
              <div class="prog_bar">
              <p id="p1">${statsTeam1.ball_possession.value ?? 0}</p>
              <progress id="bar" max="100" value="${+statsTeam2.ball_possession.value.slice(
                0,
                2
              )}"></progress>
              <progress id="bar2" max="100" value="${+statsTeam2.ball_possession.value.slice(
                0,
                2
              )}"></progress>
              <p id="p2">${statsTeam2.ball_possession.value ?? 0}</p>
              </div>
            </div>
            <div class="stat">
              <label>${String(
                statsTeam1.yellow_cards.stat_name
              ).toUpperCase()}</label> <br />
              <div class="prog_bar">
              <p id="p1">${statsTeam1.yellow_cards.value ?? 0}</p>
              <progress id="bar" max="${
                (statsTeam1.yellow_cards.value ?? 0) +
                (statsTeam2.yellow_cards.value ?? 0)
              }" value="${statsTeam2.yellow_cards.value ?? 0}"></progress>
              <progress id="bar2" max="${
                (statsTeam1.yellow_cards.value ?? 0) +
                (statsTeam2.yellow_cards.value ?? 0)
              }" value="${statsTeam2.yellow_cards.value ?? 0}"></progress>
              <p id="p2">${statsTeam2.yellow_cards.value ?? 0}</p>
              </div>
            </div>
            <div class="stat">
              <label>${String(
                statsTeam1.red_cards.stat_name
              ).toUpperCase()}</label> <br />
              <div class="prog_bar">
              <p id="p1">${statsTeam1.red_cards.value ?? 0}</p>
              <progress id="bar" max="${
                (statsTeam1.red_cards.value ?? 0) +
                (statsTeam2.red_cards.value ?? 0)
              }" value="${statsTeam2.red_cards.value ?? 0}"></progress>
              <progress id="bar2" max="${
                (statsTeam1.red_cards.value ?? 0) +
                (statsTeam2.red_cards.value ?? 0)
              }" value="${statsTeam2.red_cards.value ?? 0}"></progress>
              <p id="p2">${statsTeam2.red_cards.value ?? 0}</p>
              </div>
            </div>
            <div class="stat">
              <label>${String(
                statsTeam1.total_passes.stat_name
              ).toUpperCase()}</label> <br />
              <div class="prog_bar">
              <p id="p1">${statsTeam1.total_passes.value ?? 0}</p>
              <progress id="bar" max="${
                (statsTeam1.total_passes.value ?? 0) +
                (statsTeam2.total_passes.value ?? 0)
              }" value="${statsTeam2.total_passes.value ?? 0}"></progress>
              <progress id="bar2" max="${
                (statsTeam1.total_passes.value ?? 0) +
                (statsTeam2.total_passes.value ?? 0)
              }" value="${statsTeam2.total_passes.value ?? 0}"></progress>
              <p id="p2">${statsTeam2.total_passes.value ?? 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="matches__lineup">
          <h2 class="heading--2">Lineups</h2>
          <div class="lineups">
          ${this.data[0].lineups.map(this.createLineup).join('')}
          </div>
        </div>
    `;
  }

  createLineup(lineup, index) {
    return `
    <div class="team_lineup">
              <div class="team_formation${index}">
                <div class="team_title">
                  <p id="team_name"><b>${String(
                    lineup.team_info.name
                  ).toUpperCase()}</b></p>
                  <p id="team_formation"><b> ${lineup.formation}</b></p>
                </div>
                <div>
                  <figure class="preview__fig">
                    <img src="${lineup.team_info.logo}" alt="" />
                  </figure>
                </div>
              </div>
              <ul>
                <li id="lineup_title">
                  <p><b>STARTING</b></p>
                  ${lineup.starting_players
                    .map(players => {
                      return `
                      <li>
                          <p>${String(
                            players.player.number
                          )} &nbsp; &nbsp; &nbsp;${players.player.name}</p>
                      </li>
                      `;
                    })
                    .join('')}
                </li>
                
                <li id="lineup_title">
                  <p><b>SUBSTITUTES</b></p>
                  ${lineup.substitutes
                    .map(players => {
                      return `
                      <li>
                          <p>${String(
                            players.player.number
                          )}&nbsp; &nbsp; &nbsp;${players.player.name}</p>
                      </li>
                      `;
                    })
                    .join('')}
                </li>
                

              </ul>
            </div>
    `;
  }

  addStartingPlayers(players) {
    console.log(
      `${String(players.player.number).padEnd(5, ' ')} ${players.player.name}`
    );
    return `
    <li>
        <p>${String(players.player.number).padEnd(5, ' ')} ${
      players.player.name
    }</p>
    </li>
    `;
  }
  addSubstitutes(players) {
    return `
    <li>
        <p>${String(players.player.number).padEnd(5, ' ')} ${
      players.player.name
    }</p>
    </li>
    `;
  }
}

export default new MatchView();

// ${lineup.starting_players.map(this.addStartingPlayers).join('')}
// ${lineup.substitutes.map(this.addSubstitutes).join('')}

//arreglar
