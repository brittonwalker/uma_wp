import { gsap } from 'gsap';

import { Component } from '../core/Component.js';
import EventBus from '../core/EventBus.js';

export class HeroSection extends Component {
  get defaultOptions() {
    return {
      animationDuration: 1000,
      lazyLoad: true,
    };
  }

  init() {
    super.init();
    this.setupIntersectionObserver();
  }

  bindEvents() {
    const ctaButton = this.element.querySelector('.hero__cta');
    if (ctaButton) {
      ctaButton.addEventListener('click', this.handleCTAClick.bind(this));
    }

    // Listen for global events
    EventBus.on('viewport:resize', this.handleResize.bind(this));
  }

  handleCTAClick(e) {
    e.preventDefault();

    // Track analytics
    EventBus.emit('analytics:track', {
      event: 'cta_click',
      section: 'hero',
      element: e.target.textContent,
    });

    // Handle navigation
    this.scrollToSection(e.target.getAttribute('href'));
  }

  setupIntersectionObserver() {
    if (!this.options.lazyLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.animateIn();
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(this.element);
  }

  animateIn() {
    const leftContent = Array.from(this.element.querySelector('.landing-hero__left').children);
    const form = leftContent.pop();
    if (form) leftContent.push(form.children);

    const image = this.element.querySelector('.landing-hero__image');
    const tl = gsap.timeline({
      defaults: {
        duration: this.options.animationDuration / 1000,
        ease: 'power2.out',
        delay: 0.3,
      },
      onComplete() {
        this.kill();
      },
    });

    const imgDuration = 1.5;

    tl.fromTo(
      leftContent,
      { y: 50 },
      {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        stagger: 0.1,
      }
    );
    tl.fromTo(
      image,
      { y: 50 },
      {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        delay: 0.2,
        duration: imgDuration,
      },
      '0'
    );
  }

  scrollToSection(selector) {
    const target = document.querySelector(selector);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  handleResize() {
    // Debounced resize handling
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.updateLayout();
    }, 100);
  }

  updateLayout() {
    // Responsive adjustments
  }
}
