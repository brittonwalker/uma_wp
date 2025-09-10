/**
 * Text Reveal
 * src/js/utils/TextReveal.ts
 */

import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(SplitText);

interface TextRevealOptions {
  selector?: string;
  rootMargin?: string;
  threshold?: number;
  loadingClass?: string;
  loadedClass?: string;
  errorClass?: string;
}

interface TextRevealEventDetail {
  url: string;
  element: HTMLElement;
}

declare global {
  interface DocumentEventMap {
    lazyBgLoaded: CustomEvent<TextRevealEventDetail>;
    lazyBgError: CustomEvent<TextRevealEventDetail>;
  }
}

export class TextReveal {
  private options: Required<TextRevealOptions>;
  private observer: IntersectionObserver | null = null;
  private loadedImages: Set<string> = new Set();

  constructor(options: TextRevealOptions = {}) {
    this.options = {
      selector: '[data-text-reveal]',
      rootMargin: '50px',
      threshold: 0.1,
      loadingClass: 'bg-loading',
      loadedClass: 'bg-loaded',
      errorClass: 'bg-error',
      ...options,
    };

    this.init();
  }

  private init(): void {
    // Check for Intersection Observer support
    if (!('IntersectionObserver' in window)) {
      return;
    }

    this.createObserver();
    this.observeElements();
  }

  private createObserver(): void {
    const observerOptions: IntersectionObserverInit = {
      root: null,
      rootMargin: this.options.rootMargin,
      threshold: this.options.threshold,
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animate(entry.target as HTMLElement);
        }
      });
    }, observerOptions);
  }

  private observeElements(): void {
    const elements = document.querySelectorAll(this.options.selector);
    elements.forEach((element) => {
      if (this.observer) {
        this.observer.observe(element);
      }
    });
  }

  private animate(element: HTMLElement): void {
    let split = SplitText.create(element, {
      type: 'lines',
      mask: 'lines',
      linesClass: 'lines-child',
    });

    gsap.fromTo(
      split.lines,
      { yPercent: 100, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.5,
        ease: 'power4.out',
        stagger: 0.1,
        onComplete: () => {
          split.revert();
        },
      }
    );

    if (this.observer) {
      this.observer.unobserve(element);
    }
  }

  // Cleanup method
  public destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }
    this.loadedImages.clear();
  }
}
