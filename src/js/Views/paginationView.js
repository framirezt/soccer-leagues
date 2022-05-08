import View from './View';
import icons from 'url:../../icons/icons.svg';

class PaginationView extends View {
  parentElement = document.querySelector('.pagination');

  generateMarkup() {
    const numPages = this.data.results.length / this.data.results_per_page;

    const currentPage = this.data.page;

    //Scenario 1: first page and there are more pages
    if (numPages > 1 && currentPage === 1) {
      return `
        <button class="btn--inline pagination__btn--next">
          <span>Page ${currentPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
      </button>
      `;
    }
    //Scenario 2: last page
    if (numPages > 1 && currentPage === numPages) {
      return `
      <button class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currentPage - 1}</span>
        </button>
        
      `;
    }
    //Scenario 3: page in between (not last or first)
    if (numPages > 1 && (currentPage !== 1 || currentPage !== numPages)) {
      return `
      <button class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currentPage - 1}</span>
        </button>
        <button class="btn--inline pagination__btn--next">
          <span>Page ${currentPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
      </button>
      `;
    }
    //Scenario 4: only 1 page
    if (numPages === 1) return ``;
  }
}

export default new PaginationView();
