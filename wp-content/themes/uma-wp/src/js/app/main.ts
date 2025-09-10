import EventBus from './core/EventBus';
import { Testimonials, CardsSection, HeroSection } from './components';
import { PerformanceManager, LazyBackgroundImages, TextReveal, FadeUp } from './utils';
import ScrollManager from './core/ScrollManager';

// import ApiService from './services/ApiService.js';

type ComponentInstance = HeroSection | Testimonials | CardsSection;
type UtilityInstance = LazyBackgroundImages | TextReveal | FadeUp;

class App {
  components: Map<HTMLElement, ComponentInstance>;
  utilities: Map<string, UtilityInstance>;

  constructor() {
    this.components = new Map();
    this.utilities = new Map();
    this.init();
  }

  init() {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Looks like we are in development mode!');
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.bootstrap());
    } else {
      this.bootstrap();
    }
  }

  bootstrap() {
    ScrollManager.init();
    this.setupGlobalEvents();
    this.initializeUtilities();
    this.initializeComponents();
    this.setupAnalytics();
    PerformanceManager.preloadCriticalResources();
  }

  setupGlobalEvents() {
    // Throttled scroll events
    window.addEventListener(
      'scroll',
      PerformanceManager.throttle(this.handleScroll.bind(this), 16)
    );

    // Debounced resize events
    window.addEventListener(
      'resize',
      PerformanceManager.debounce(this.handleResize.bind(this), 100)
    );

    // Form submissions
    EventBus.on('form:submit', this.handleFormSubmit.bind(this));

    // Listen for dynamic content updates (for AJAX-loaded content)
    EventBus.on('content:updated', this.handleDynamicContent.bind(this));
  }

  initializeUtilities() {
    // Initialize utility components that don't need specific DOM elements
    const lazyBgImages = new LazyBackgroundImages({
      selector: '[data-bg-image]',
      rootMargin: '100px',
      threshold: 0.1,
      loadingClass: 'bg-loading',
      loadedClass: 'bg-loaded',
      errorClass: 'bg-error',
    });

    this.utilities.set('lazyBackgrounds', lazyBgImages);

    const textReveal = new TextReveal({
      selector: '[data-text-reveal]',
      rootMargin: '50px',
      threshold: 0.4,
      loadingClass: 'text-loading',
      loadedClass: 'text-loaded',
      errorClass: 'text-error',
    });

    this.utilities.set('textReveal', textReveal);

    // const fadeUp = new FadeUp({
    //   selector: '[data-fade-up]',
    //   rootMargin: '50px',
    //   threshold: 0.4,
    //   loadingClass: 'fade-loading',
    //   loadedClass: 'fade-loaded',
    //   errorClass: 'fade-error',
    // });

    // this.utilities.set('fadeUp', fadeUp);

    // Listen for lazy loading events
    document.addEventListener('lazyBgLoaded', this.handleLazyBgLoaded.bind(this));
    document.addEventListener('lazyBgError', this.handleLazyBgError.bind(this));
  }

  initializeComponents() {
    // Auto-initialize components based on data attributes
    const componentMap = {
      'landing-hero': HeroSection,
      testimonials: Testimonials,
      'cards-section': CardsSection,
    };

    Object.entries(componentMap).forEach(([name, ComponentClass]) => {
      const elements = Array.from(
        document.querySelectorAll(`[data-component="${name}"]`)
      ) as HTMLElement[];
      elements.forEach((element: HTMLElement) => {
        const options = this.parseComponentOptions(element);
        const instance = new ComponentClass(element, options);
        this.components.set(element, instance);
      });
    });
  }

  parseComponentOptions(element: HTMLElement) {
    const optionsAttr = element.dataset.componentOptions;
    return optionsAttr ? JSON.parse(optionsAttr) : {};
  }

  handleScroll(): void {
    EventBus.emit('viewport:scroll', {
      scrollY: window.scrollY,
      scrollDirection: this.getScrollDirection(),
    });
  }

  handleResize(): void {
    ScrollManager.refresh();

    EventBus.emit('viewport:resize', {
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  handleDynamicContent(data: { container?: HTMLElement } = {}): void {
    // When new content is loaded via AJAX, reinitialize lazy backgrounds
    const lazyBgImages = this.utilities.get('lazyBackgrounds') as LazyBackgroundImages;
    if (lazyBgImages) {
      const container = data.container || document;
      const newElements = Array.from(
        container.querySelectorAll('[data-bg-image][data-lazy="pending"]')
      ) as HTMLElement[];

      if (newElements.length > 0) {
        lazyBgImages.addElements(newElements);
        console.log(`🔄 Added ${newElements.length} new lazy background images`);
      }
    }
  }

  handleLazyBgLoaded(event: CustomEvent): void {
    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ Background image loaded:', event.detail.url);
    }

    // Optional: Track for analytics
    EventBus.emit('analytics:track', {
      event: 'image_loaded',
      category: 'performance',
      label: 'lazy_background',
      value: event.detail.url,
    });
  }

  handleLazyBgError(event: CustomEvent): void {
    console.error('❌ Background image failed:', event.detail.url);

    // Optional: Track errors for analytics
    EventBus.emit('analytics:track', {
      event: 'image_error',
      category: 'performance',
      label: 'lazy_background_error',
      value: event.detail.url,
    });
  }

  disableScroll(): void {
    ScrollManager.disable();
  }

  enableScroll(): void {
    ScrollManager.enable();
  }

  scrollToElement(selector: string, options = {}) {
    ScrollManager.scrollTo(selector, options);
  }

  handleFormSubmit(data: any) {
    // Handle form submissions with proper validation and AJAX
    // console.log('Form submitted:', data);
  }

  setupAnalytics() {
    // Initialize analytics tracking
    // EventBus.on('analytics:track', (data) => {
    //   // Send to Google Analytics, etc.
    //   if (typeof gtag !== 'undefined') {
    //     gtag('event', data.event, {
    //       event_category: data.category || 'engagement',
    //       event_label: data.label,
    //       custom_parameter_1: data.value
    //     });
    //   }
    // });
  }

  getScrollDirection() {
    // Implementation for scroll direction detection
  }

  // Public method to manually refresh lazy images (useful for AJAX content)
  refreshLazyImages(container?: HTMLElement): void {
    this.handleDynamicContent({ container });
  }

  // Cleanup method for SPA-like behavior or HMR
  destroy(): void {
    // Clean up utilities
    this.utilities.forEach((utility) => {
      if (utility && typeof utility.destroy === 'function') {
        utility.destroy();
      }
    });
    this.utilities.clear();

    // Clean up components
    this.components.forEach((component) => {
      if (component && typeof component.destroy === 'function') {
        component.destroy();
      }
    });
    this.components.clear();
  }
}

// Initialize the application
const app = new App();

// Export for global access (useful for debugging or external integrations)
if (process.env.NODE_ENV !== 'production') {
  (window as any).UmaApp = app;
}
