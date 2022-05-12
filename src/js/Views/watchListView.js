import View from './View';

class WatchListView extends View {
  parentElement = document.querySelector('.bookmarks__list');

  generateMarkup() {
    return this.data
      .map(match => {
        //calculating the date of the match
        const date = match.date;
        const newDate = new Date(
          date.slice(0, 4),
          date.slice(5, 7) - 1,
          date.slice(8, 10),
          date.slice(11, 13),
          date.slice(14, 16)
        );

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

        return `
      <li class="preview">
      <a class="preview__link " href="#${match.id}">
        <div class="preview__upper">
          <div class="preview__team">
            <figure class="preview__fig">
              <img src="${match.home_team.logo}" alt="Team logo" />
            </figure>
            <h4>${match.home_team.name}</h4>
          </div>
          <div class="preview__data">
            <h5 class="preview__title">${match.home_team.goals ?? '-'} - ${
          match.away_team.goals ?? '-'
        }</h5>
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
export default new WatchListView();