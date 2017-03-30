/* globals FormData */

/**
 * Submit songs via <form>
 */
export default class SongsForm {
  /**
   * Create songsForm instance
   * @param {Object} options - options object
   * @param {HTMLElement} options.element - form element
   * @param {Object} options.messaging - cross-component messaging
   */
  constructor (options) {
    // Store properties
    this.form = options.element
    this.messaging = options.messaging
    // Add events
    this.form.addEventListener('submit', ::this.submit)
  }

  /**
   * Submit form data via AJAX
   * @param {Object} e - event object
   */
  submit (e) {
    e.preventDefault()
    fetch('/add-song', {
      method: 'POST',
      body: new FormData(this.form)
    })
      .then(response => response.json())
      .then(response => {
        if (response.msg) {
          this.messaging.emit('notification:show', response.msg)
        } else {
          throw new Error('Missing response message')
        }
      })
      .catch(msg => {
        console.error(msg)
      })
  }
}
