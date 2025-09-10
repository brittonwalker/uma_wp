import EventBus from './core/EventBus';
import { Testimonials } from './components/Testimonials';
import { CardsSection } from './components/CardsSection';
import { PerformanceManager } from './utils/Performance';
import { HeroSection } from './components/HeroSection';
import ScrollManager from './core/ScrollManager';

// import ApiService from './services/ApiService.js';

class App {
  constructor() {
    this.components = new Map();
    this.init();
  }

  init() {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Looks like we are in development mode!');
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.bootstrap());
    } else {
      this.bootstrap();
    }
  }

  bootstrap() {
    ScrollManager.init();
    this.setupGlobalEvents();
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
  }

  initializeComponents() {
    // Auto-initialize components based on data attributes
    const componentMap = {
      // 'hero-section': HeroSection,
      'landing-hero': HeroSection,
      testimonials: Testimonials,
      'cards-section': CardsSection,
      // Add more components as needed
    };

    Object.entries(componentMap).forEach(([name, ComponentClass]) => {
      const elements = document.querySelectorAll(`[data-component="${name}"]`);
      elements.forEach((element) => {
        const options = this.parseComponentOptions(element);
        const instance = new ComponentClass(element, options);
        this.components.set(element, instance);
      });
    });
  }

  parseComponentOptions(element) {
    const optionsAttr = element.dataset.componentOptions;
    return optionsAttr ? JSON.parse(optionsAttr) : {};
  }

  handleScroll() {
    EventBus.emit('viewport:scroll', {
      scrollY: window.scrollY,
      scrollDirection: this.getScrollDirection(),
    });
  }

  handleResize() {
    ScrollManager.refresh();

    EventBus.emit('viewport:resize', {
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }

  disableScroll() {
    ScrollManager.disable();
  }

  enableScroll() {
    ScrollManager.enable();
  }

  scrollToElement(selector, options = {}) {
    ScrollManager.scrollTo(selector, options);
  }

  handleFormSubmit(data) {
    // Handle form submissions with proper validation and AJAX
    console.log('Form submitted:', data);
  }

  setupAnalytics() {
    // Initialize analytics tracking
    // EventBus.on('analytics:track', (data) => {
    //   // Send to Google Analytics, etc.
    //   if (typeof gtag !== 'undefined') {
    //     gtag('event', data.event, {
    //       event_category: data.category || 'engagement',
    //       event_label: data.label,
    //     });
    //   }
    // });
  }

  getScrollDirection() {
    // Implementation for scroll direction detection
  }
}

// Initialize the application
new App();
