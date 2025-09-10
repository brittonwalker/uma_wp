import { gsap } from 'gsap';

import { Component } from '../core/Component';
import EventBus from '../core/EventBus';

interface HeroSectionOptions {
  animationDuration: number;
  lazyLoad: boolean;
}

interface HeroSectionState {
  isAnimated: boolean;
}

export class HeroSection extends Component<HeroSectionOptions, HeroSectionState> {
  private resizeTimeout?: number;

  get defaultOptions(): Partial<HeroSectionOptions> {
    return {
      animationDuration: 1000,
      lazyLoad: true,
    };
  }

  init(): void {
    super.init();
    this.setState({ isAnimated: false });
    this.setupIntersectionObserver();
  }

  render(): void {
    console.log('RENDERING');
  }

  bindEvents(): void {
    const ctaButton = this.element.querySelector('.hero__cta') as HTMLElement;
    if (ctaButton) {
      ctaButton.addEventListener('click', this.handleCTAClick.bind(this));
    }

    EventBus.on('viewport:resize', this.handleResize.bind(this));
  }

  handleCTAClick(e: MouseEvent): void {
    e.preventDefault();

    const target = e.target as HTMLElement;

    // Track analytics
    EventBus.emit('analytics:track', {
      event: 'cta_click',
      section: 'hero',
      element: target.textContent,
    });

    const href = target.getAttribute('href');
    if (href) {
      this.scrollToSection(href);
    }
  }

  setupIntersectionObserver(): void {
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

  animateIn(): void {
    const leftContentContainer = this.element.querySelector(
      '.landing-hero__left'
    ) as HTMLElement | null;
    if (!leftContentContainer) return;

    const elementsToAnimate: HTMLElement[] = [];

    Array.from(leftContentContainer.children).forEach((child) => {
      if (child instanceof HTMLElement) {
        if (child.tagName === 'FORM') {
          Array.from(child.children).forEach((formChild) => {
            if (formChild instanceof HTMLElement) {
              elementsToAnimate.push(formChild);
            }
          });
        } else {
          elementsToAnimate.push(child);
        }
      }
    });

    const image = this.element.querySelector('.landing-hero__image') as HTMLElement | null;

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
      elementsToAnimate,
      { y: 50 },
      {
        opacity: 1,
        y: 0,
        ease: 'power2.out',
        stagger: 0.1,
      }
    );

    if (image) {
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

    this.setState({ isAnimated: true });
  }

  scrollToSection(selector: string): void {
    const target = document.querySelector(selector) as HTMLElement;
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }

  handleResize(): void {
    if (this.resizeTimeout) {
      window.clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = window.setTimeout(() => {
      this.updateLayout();
    }, 100);
  }

  updateLayout(): void {
    // Responsive adjustments
  }
}
