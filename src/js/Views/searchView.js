import View from './View';

class SearchView extends View {
  parentElement = document.querySelector('.search');

  getQuery() {
    const query = this.parentElement.querySelector('.search__field').value;
    // query.value = '';
    this.clearSearchInput();
    return query;
  }

  clearSearchInput() {
    this.parentElement.querySelector('.search__field').value = '';
  }

  addHandlerSearch(handler) {
    this.parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
