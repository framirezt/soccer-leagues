import View from './View';
import icons from 'url:../../icons/icons.svg';

class PaginationView extends View {
  parentElement = document.querySelector('.pagination');

  /**
   * Generates the markup depending on the number of pages and the current page.
   * The this.data passed must be the state.search so it can access the results array and page number
   * @returns The markup for the pagination view
   */
  generateMarkup() {
    const numPages = Math.ceil(
      this.data.results.length / this.data.results_per_page
    );

    const currentPage = this.data.page;

    //Scenario 1: first page and there are more pages
    if (numPages > 1 && currentPage === 1) {
      return `
        <button class="btn--inline pagination__btn--next" data-goto="${
          currentPage + 1
        }">
          <span>Page ${currentPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
      </button>
      <h3 id="num_pages" style="position: absolute; margin-left: 13rem; margin-top: 2rem;">Page ${currentPage} of ${numPages}</h2>
      `;
    }
    //Scenario 2: last page
    if (numPages > 1 && currentPage === numPages) {
      return `
      <button class="btn--inline pagination__btn--prev" data-goto="${
        currentPage - 1
      }">
        <svg class="search__icon">
          <use href="${icons}#icon-arrow-left"></use>
        </svg>
        <span>Page ${currentPage - 1}</span>
      </button>
      <h3 id="num_pages" style="position: absolute; margin-left: 13rem; margin-top: 2rem;">Page ${currentPage} of ${numPages}</h2>
      `;
    }
    //Scenario 3: page in between (not last or first)
    if (numPages > 1 && (currentPage !== 1 || currentPage !== numPages)) {
      return `
      <button class="btn--inline pagination__btn--prev" data-goto="${
        currentPage - 1
      }">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currentPage - 1}</span>
        </button>
        <button class="btn--inline pagination__btn--next" data-goto="${
          currentPage + 1
        }">
          <span>Page ${currentPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
      </button>
      <h3 id="num_pages" style="position: absolute; margin-left: 13rem; margin-top: 2rem;">Page ${currentPage} of ${numPages}</h2>
      `;
    }
    //Scenario 4: only 1 page
    if (numPages === 1) return ``;
  }

  /**
   * This method creates an event listener on the next and prev buttons.
   * Every time a button is clicked, it lowers or increases the page number.
   * @param {function} handler Function that will be called on click of the buttons
   */
  addHandlerPages(handler) {
    this.parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      //guard clause so only works when click on button
      if (!btn) return;

      const gotoPage = +btn.dataset.goto;

      handler(gotoPage);
    });
  }
}

export default new PaginationView();
