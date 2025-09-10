export class Component<TOptions = {}, TState = {}> {
  element: HTMLElement;
  options: TOptions & Record<string, any>;
  state: TState & Record<string, any>;

  constructor(element: HTMLElement, options: Partial<TOptions> = {}) {
    this.element = element;
    this.options = { ...this.defaultOptions, ...options } as TOptions & Record<string, any>;
    this.state = {} as TState & Record<string, any>;
    this.init();
  }

  get defaultOptions(): Partial<TOptions> {
    return {} as Partial<TOptions>;
  }

  init() {
    this.bindEvents();
    this.render();
  }

  setState(newState: Partial<TState>): void {
    const prevState = { ...this.state };
    this.state = { ...this.state, ...newState } as TState & Record<string, any>;
    this.onStateChange(prevState, this.state);
  }

  onStateChange(
    prevState: TState & Record<string, any>,
    newState: TState & Record<string, any>
  ): void {
    // Override in subclasses
  }

  bindEvents(): void {
    // Override in subclasses
  }

  render(): void {
    // Override in subclasses
  }

  destroy(): void {
    // Clean up event listeners, etc.
    this.element = null as any;
  }
}
