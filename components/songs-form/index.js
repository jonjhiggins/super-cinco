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
    const url = this.form.getAttribute('action')
    const requestBody = JSON.stringify({
      'artist-1': this.form.querySelector('[name="artist-1"]').value,
      'song-1': this.form.querySelector('[name="song-1"]').value
    })
    fetch(url, {
      method: 'POST',
      body: requestBody,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
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
