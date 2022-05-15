import View from './View';

/**
 * The view were the queried league name will be displayed.
 */
class LeagueNameView extends View {
  parentElement = document.querySelector('.league_results');

  generateMarkup() {
    return `
    <div class="league_name">
      <figure class="league_fig">
        <img src="${this.data.league.league_logo}" alt="League_logo" />
      </figure>
      <h2>${this.data.league.league_name}</h2>
    </div>
    `;
  }
}

export default new LeagueNameView();
