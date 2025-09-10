class EventBus {
  private events: Map<string, Function[]>;

  constructor() {
    this.events = new Map();
  }

  on(event: string, callback: Function) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(callback);
  }

  emit(event: string, data: any) {
    if (this.events.has(event)) {
      this.events.get(event)!.forEach((callback) => callback(data));
    }
  }

  off(event: string, callback: Function) {
    if (this.events.has(event)) {
      const callbacks = this.events.get(event)!;
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  }
}

export default new EventBus();
