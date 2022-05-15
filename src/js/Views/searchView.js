import View from './View';

/**
 * The view where the user searches for the league.
 */
class SearchView extends View {
  parentElement = document.querySelector('.search');

  /**
   * This method gets the query from the user input on the search form.
   * @returns The query from the user.
   */
  getQuery() {
    const query = this.parentElement.querySelector('.search__field').value;
    // query.value = '';
    this.clearSearchInput();
    return query;
  }

  clearSearchInput() {
    this.parentElement.querySelector('.search__field').value = '';
  }

  /**
   * When the form is submitted, display the sidebar for mobile devices, and execute the handler.
   * @param {function} handler The function that will execute when the event occurs
   */
  addHandlerSearch(handler) {
    this.parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      document.querySelector('.search-results').classList.add('sidebar_show');
      handler();
    });
  }
}

export default new SearchView();
