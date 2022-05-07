import icons from 'url:../../icons/icons.svg';

/**
 * Parent class of all the views. All the views will inherit these methods
 */
export default class View {
  data;

  /**
   * Renders the data markup into the view
   * @param {Object} data The data that will be used to display in the view
   * @returns Error message if it does not exist
   */
  render(data) {
    //guard clause to check if the recieved data exists or if the array is empty
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderErrorMessage();

    this.data = data;
    const html = this.generateMarkup();
    this.clear();
    this.parentElement.insertAdjacentHTML('afterbegin', html);
  }
  /**
   * Renders the error message html markup when an error occurs
   * @param {string} [message = this.errorMessage] The message that will be displayed. Default is the parent's error message
   */
  renderErrorMessage(message = this.errorMessage) {
    const html = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;

    this.parentElement.innerHTML = '';
    this.parentElement.insertAdjacentHTML('afterbegin', html);
  }
  /**
   * Renders the spinner html markup while loading
   */
  renderSpinner() {
    const html = `
    <div class="spinner">
      <svg>
        <use href="${icons}#icon-loader"></use>
      </svg>
    </div>
    `;
    this.parentElement.innerHTML = '';
    this.parentElement.insertAdjacentHTML('afterbegin', html);
  }
  /**
   * Clears the parent element before adding new html
   */
  clear() {
    this.parentElement.innerHTML = '';
  }
}
