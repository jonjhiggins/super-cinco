/**
 * Show notifications
 */
export default class Notification {
  /**
   * Create instance
   * @param {Object} options - options object
   * @param {HTMLElement} options.element - form element
   * @param {Object} options.messaging - cross-component messaging
   */
  constructor (options) {
    // Store properties
    this.element = options.element
    this.messaging = options.messaging
    this.timeout = null
    // Add events
    this.element.addEventListener('click', ::this.clearMessage)
    this.messaging.on('notification:show', ::this.showMessage)
  }

  /**
   * Display a message and show
   * @param {String} msg - message to show
   */
  showMessage (msg) {
    // Show the message
    this.element.innerHTML = msg
    this.element.setAttribute('data-state', 'visible')
    this.element.setAttribute('aria-hidden', 'false')
    // Hide after delay
    window.clearTimeout(this.timeout)
    this.timeout = window.setTimeout(::this.clearMessage, 3000)
  }

  /**
   * Clear message content and hide
   */
  clearMessage () {
    this.element.innerHTML = ''
    this.element.setAttribute('data-state', 'hidden')
    this.element.setAttribute('aria-hidden', 'true')
  }
}
