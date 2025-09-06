export class Component {
  constructor(element, options = {}) {
    this.element = element;
    this.options = { ...this.defaultOptions, ...options };
    this.state = {};
    this.init();
  }

  get defaultOptions() {
    return {};
  }

  init() {
    this.bindEvents();
    this.render();
  }

  setState(newState) {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...newState };
    this.onStateChange(prevState, this.state);
  }

  onStateChange(prevState, newState) {
    // Override in subclasses
  }

  bindEvents() {
    // Override in subclasses
  }

  render() {
    // Override in subclasses
  }

  destroy() {
    // Clean up event listeners, etc.
    this.element = null;
  }
}
