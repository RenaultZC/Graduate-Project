import finder from '@medv/finder'
const eventsToRecord = {
  CLICK: 'click',
  DBLCLICK: 'dblclick',
  CHANGE: 'change',
  KEYDOWN: 'keydown',
  SELECT: 'select',
  SUBMIT: 'submit',
  LOAD: 'load',
  UNLOAD: 'unload',
  MOUSEMOVE: 'mousemove',
}  
class EventRecorder {
  constructor () {
    this.eventLog = []
    this.previousEvent = null
    this.dataAttribute = null
    this.isTopFrame = (window.location === window.parent.location)
  }

  start () {
    this._initializeRecorder()
  }

  _initializeRecorder () {
    const events = Object.values(eventsToRecord)
    if (!window.pptRecorderAddedControlListeners) {
      this.addAllListeners(events)
      window.pptRecorderAddedControlListeners = true
    }

    if (this.isTopFrame) {
      this.sendMessage({selector: undefined, value: window.location.href, action: 'goto*'})
      this.sendMessage({selector: undefined, value: { width: window.innerWidth, height: window.innerHeight }, action: 'viewport*'})
    }
  }

  addAllListeners (events) {
    const boundedRecordEvent = this.recordEvent.bind(this)
    events.forEach(type => {
      if (type === 'mousemove'){
        window.addEventListener(type, this.debounce(boundedRecordEvent, 1000), true)
      } else {
        window.addEventListener(type, boundedRecordEvent, true)
      }
    })
  }

  sendMessage (msg) {
    console.debug('sending message', msg)
    try {
      if (chrome.runtime && chrome.runtime.onMessage) {
        chrome.runtime.sendMessage(msg)
      } else {
        this.eventLog.push(msg)
      }
    } catch (err) {
      console.debug('caught error', err)
    }
  }

  debounce(fn, interval = 300) {
    let timeout = null;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        fn.apply(this, arguments);
      }, interval);
    };
  }

  recordEvent (e) {
    if (this.previousEvent && this.previousEvent.timeStamp === e.timeStamp) return
    this.previousEvent = e
    try {
      const selector = this.dataAttribute && e.target.hasAttribute && e.target.hasAttribute(this.dataAttribute)
        ? formatDataSelector(e.target, this.dataAttribute)
        : finder(e.target, {seedMinLength: 5, optimizedMinLength: 10})

      const msg = {
        selector: selector,
        value: e.target && e.target.value,
        tagName: e.target && e.target.tagName,
        action: e.type,
        keyCode: e.keyCode ? e.keyCode : null,
        href: e.target.href ? e.target.href : null,
        coordinates: getCoordinates(e),
        clientRect: {
          x: e.clientX,
          y: e.clientY
        }
      }
      this.sendMessage(msg)
    } catch (e) { }
  }

  getEventLog () {
    return this.eventLog
  }

  clearEventLog () {
    this.eventLog = []
  }
}

function getCoordinates (evt) {
  const eventsWithCoordinates = {
    mouseup: true,
    mousedown: true,
    mousemove: true,
    mouseover: true
  }
  return eventsWithCoordinates[evt.type] ? { x: evt.clientX, y: evt.clientY } : null
}

function formatDataSelector (element, attribute) {
  return `[${attribute}="${element.getAttribute(attribute)}"]`
}

window.eventRecorder = new EventRecorder()
window.eventRecorder.start()