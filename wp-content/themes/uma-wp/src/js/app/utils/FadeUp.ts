/**
 * Text Reveal
 * src/js/utils/FadeUp.ts
 */

import gsap from 'gsap';

interface FadeUpOptions {
  selector?: string;
  rootMargin?: string;
  threshold?: number;
  loadingClass?: string;
  loadedClass?: string;
  errorClass?: string;
}

interface FadeUpEventDetail {
  url: string;
  element: HTMLElement;
}

declare global {
  interface DocumentEventMap {
    lazyBgLoaded: CustomEvent<FadeUpEventDetail>;
    lazyBgError: CustomEvent<FadeUpEventDetail>;
  }
}

export class FadeUp {
  private options: Required<FadeUpOptions>;
  private observer: IntersectionObserver | null = null;
  private loadedImages: Set<string> = new Set();

  constructor(options: FadeUpOptions = {}) {
    this.options = {
      selector: '[data-fade-up]',
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
    this.observeElements();
  }

  private observeElements(): void {
    const elements = document.querySelectorAll(this.options.selector);
    elements.forEach((element) => {
      this.animate(element as HTMLElement);
    });
  }

  private animate(element: HTMLElement): void {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: 'top 100%',
        end: 'top 40%',
        scrub: 1,
      },
    });

    tl.fromTo(element, { y: 50 }, { y: -50, duration: 0.6, ease: 'power2.out' });
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
