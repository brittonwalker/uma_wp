import Lenis from '@studio-freight/lenis';
import EventBus from './EventBus';

class ScrollManager {
  constructor() {
    this.lenis = null;
    this.isEnabled = true;
    this.rafId = null;
  }

  init() {
    // Don't initialize on mobile devices that have good native smooth scroll
    if (this.shouldDisableOnMobile() && window.innerWidth < 768) {
      console.log('Lenis disabled on mobile');
      return;
    }

    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false, // Usually better to keep native touch scroll
      touchMultiplier: 2,
      wheelMultiplier: 1,
      infinite: false,
    });

    this.bindEvents();
    this.startRaf();

    // Emit initialization event
    EventBus.emit('scroll:initialized', { lenis: this.lenis });

    console.log('Lenis smooth scroll initialized');
  }

  bindEvents() {
    if (!this.lenis) return;

    // Listen for scroll events and emit them
    this.lenis.on('scroll', (e) => {
      EventBus.emit('scroll:update', {
        scroll: e.scroll,
        limit: e.limit,
        velocity: e.velocity,
        direction: e.direction,
        progress: e.progress,
      });
    });

    // Handle anchor links
    document.addEventListener('click', this.handleAnchorClick.bind(this));

    // Handle resize
    window.addEventListener('resize', this.handleResize.bind(this));

    // Pause/resume on focus changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.stop();
      } else {
        this.start();
      }
    });
  }

  handleAnchorClick(e) {
    const target = e.target.closest('a[href^="#"]');
    if (!target) return;

    const href = target.getAttribute('href');
    if (href === '#') return;

    const element = document.querySelector(href);
    if (!element) return;

    e.preventDefault();
    this.scrollTo(element);
  }

  handleResize() {
    if (this.lenis) {
      this.lenis.resize();
    }
  }

  shouldDisableOnMobile() {
    // Detect iOS Safari and other browsers with good native smooth scroll
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    return isIOS || isSafari;
  }

  startRaf() {
    if (!this.lenis) return;

    const raf = (time) => {
      this.lenis.raf(time);
      this.rafId = requestAnimationFrame(raf);
    };

    this.rafId = requestAnimationFrame(raf);
  }

  stopRaf() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  // Public methods
  scrollTo(target, options = {}) {
    if (!this.lenis) return;

    const defaultOptions = {
      offset: 0,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      ...options,
    };

    this.lenis.scrollTo(target, defaultOptions);
  }

  start() {
    if (this.lenis) {
      this.lenis.start();
      this.startRaf();
    }
  }

  stop() {
    if (this.lenis) {
      this.lenis.stop();
      this.stopRaf();
    }
  }

  destroy() {
    if (this.lenis) {
      this.lenis.destroy();
      this.stopRaf();
      this.lenis = null;
    }

    document.removeEventListener('click', this.handleAnchorClick);
    window.removeEventListener('resize', this.handleResize);
  }

  // Utility methods for components
  disable() {
    if (this.lenis) {
      this.lenis.stop();
    }
  }

  enable() {
    if (this.lenis) {
      this.lenis.start();
    }
  }

  refresh() {
    if (this.lenis) {
      this.lenis.resize();
    }
  }
}

export default new ScrollManager();
