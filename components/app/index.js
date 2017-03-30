import 'dom4'
import domready from 'domready'
import SongsForm from '../songs-form'
import Notification from '../notification'
import EventEmitter from 'events'

/**
 * @var {Object} messaging - for cross-component messaging
 */
const messaging = new EventEmitter()




domready(() => {
  // Songs Forms
  const songsForms = document.querySelectorAll('[data-component="songs-form"]')
  for (const element of songsForms) {
    new SongsForm({
      element: element,
      messaging: messaging
    })
  }
  // Notification (only one)
  const notification = document.querySelector('[data-component="notification"]')
  if (notification) {
    new Notification({
      element: notification,
      messaging: messaging
    })
  }
  messaging.emit('test')
})
