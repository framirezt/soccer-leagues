import View from './View';

/**
 * This is the view where the league matches results will be displayed
 */
class ResultsView extends View {
  parentElement = document.querySelector('.results');
  errorMessage = 'League not found! Please try again.';

  /**
   * This generates the markup for the match previews
   * @returns The markup to be inserted into the resultsView
   * @todo Get the active match using the window hash
   */
  generateMarkup() {
    return this.data
      .map(match => {
        //calculating the date of the match
        const date = new Date(match.date);
        const days = [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ];
        const months = [
          'January',
          'February',
          'March',
          'April',
          'Mayo',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December',
        ];
        const matchDate = `${days[date.getDay()]} ${date.getDate()} ${
          months[date.getMonth()]
        } ${date.getFullYear()}`;

        //markup for each match preview of search results
        return `
      <li class="preview">
      <a class="preview__link preview__link--active" href="#${match.id}">
        <div class="preview__upper">
          <div class="preview__team">
            <figure class="preview__fig">
              <img src="${match.home_team.logo}" alt="Team logo" />
            </figure>
            <h4>${match.home_team.name}</h4>
          </div>
          <div class="preview__data">
            <h5 class="preview__title">${match.home_team.goals} - ${match.away_team.goals}</h5>
          </div>
          <div class="preview__team">
            <figure class="preview__fig">
              <img src="${match.away_team.logo}" alt="Team logo" />
            </figure>
            <h4>${match.away_team.name}</h4>
          </div>
        </div>
        <div class="preview__lower">
          <h6>${matchDate}</h6>
        </div>
      </a>
    </li>
      `;
      })
      .join('');
  }
}

export default new ResultsView();