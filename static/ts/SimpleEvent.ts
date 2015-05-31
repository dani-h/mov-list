module SimpleEvent {
  interface event_cache_type {
    [eventname: string]: { [id: string]: Function }
  }

  export class EventCls {
    id = 0
    events: event_cache_type = {}

    register(eventname: string, callback: Function) {
      let events_obj = this.events[eventname] || (this.events[eventname] = {})
      let id = this.generate_id()
      events_obj[id] = callback
      return id
    }
    unregister(id: string) {
      for (let eventname of Object.keys(this.events)) {
        if (id in this.events[eventname]) {
          delete this.events[eventname][id]
          return true
        }
      }
      return false
    }
    trigger(eventname: string, ...args) {
      if (this.events[eventname]) {
        for (let id of Object.keys(this.events[eventname])) {
          this.events[eventname][id].call(this)
        }
      }
    }
    generate_id() {
      return "ID_" + this.id++
    }
  }
}

export = SimpleEvent
