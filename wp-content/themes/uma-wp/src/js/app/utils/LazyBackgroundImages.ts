/**
 * Lazy Background Images Component
 * src/js/components/LazyBackgroundImages.ts
 */

interface LazyBackgroundOptions {
  selector?: string;
  rootMargin?: string;
  threshold?: number;
  loadingClass?: string;
  loadedClass?: string;
  errorClass?: string;
}

interface LazyBackgroundEventDetail {
  url: string;
  element: HTMLElement;
}

declare global {
  interface DocumentEventMap {
    lazyBgLoaded: CustomEvent<LazyBackgroundEventDetail>;
    lazyBgError: CustomEvent<LazyBackgroundEventDetail>;
  }
}

export class LazyBackgroundImages {
  private options: Required<LazyBackgroundOptions>;
  private observer: IntersectionObserver | null = null;
  private loadedImages: Set<string> = new Set();

  constructor(options: LazyBackgroundOptions = {}) {
    this.options = {
      selector: '[data-bg-image][data-lazy="pending"]',
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
      this.fallbackLoad();
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
          this.loadBackgroundImage(entry.target as HTMLElement);
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

  private loadBackgroundImage(element: HTMLElement): void {
    const bgImageUrl = element.dataset.bgImage;

    if (!bgImageUrl) {
      console.warn('No background image URL found for element:', element);
      return;
    }

    // Skip if already loaded
    if (this.loadedImages.has(bgImageUrl)) {
      this.applyLoadedState(element, bgImageUrl);
      return;
    }

    // Set loading state
    this.setLoadingState(element);

    // Preload the image
    const img = new Image();

    img.onload = () => {
      this.handleImageLoad(element, bgImageUrl);
    };

    img.onerror = () => {
      this.handleImageError(element, bgImageUrl);
    };

    img.src = bgImageUrl;
  }

  private setLoadingState(element: HTMLElement): void {
    element.dataset.lazy = 'loading';
    element.classList.add(this.options.loadingClass);
  }

  private handleImageLoad(element: HTMLElement, bgImageUrl: string): void {
    // Apply the background image
    element.style.backgroundImage = `url('${bgImageUrl}')`;

    // Update state
    this.applyLoadedState(element, bgImageUrl);

    // Cache the loaded image
    this.loadedImages.add(bgImageUrl);

    // Stop observing this element
    if (this.observer) {
      this.observer.unobserve(element);
    }

    // Dispatch custom event
    const event = new CustomEvent('lazyBgLoaded', {
      detail: { url: bgImageUrl, element },
    });
    document.dispatchEvent(event);
  }

  private applyLoadedState(element: HTMLElement, bgImageUrl: string): void {
    element.dataset.lazy = 'loaded';
    element.classList.remove(this.options.loadingClass);
    element.classList.add(this.options.loadedClass);
    element.style.backgroundImage = `url('${bgImageUrl}')`;

    if (this.observer) {
      this.observer.unobserve(element);
    }
  }

  private handleImageError(element: HTMLElement, bgImageUrl: string): void {
    element.dataset.lazy = 'error';
    element.classList.remove(this.options.loadingClass);
    element.classList.add(this.options.errorClass);

    console.error('Failed to load background image:', bgImageUrl);

    // Dispatch error event
    const event = new CustomEvent('lazyBgError', {
      detail: { url: bgImageUrl, element },
    });
    document.dispatchEvent(event);

    if (this.observer) {
      this.observer.unobserve(element);
    }
  }

  // Fallback for browsers without Intersection Observer
  private fallbackLoad(): void {
    const elements = document.querySelectorAll(this.options.selector);
    elements.forEach((element) => {
      this.loadBackgroundImage(element as HTMLElement);
    });
  }

  // Public method to manually trigger loading
  public loadElement(element: HTMLElement): void {
    if (element.dataset.lazy === 'pending') {
      this.loadBackgroundImage(element);
    }
  }

  // Add new elements to observe (for dynamic content)
  public addElements(elements: HTMLElement[] | NodeListOf<HTMLElement>): void {
    if (!this.observer) return;

    Array.from(elements).forEach((element) => {
      if (element.dataset.lazy === 'pending') {
        this.observer!.observe(element);
      }
    });
  }

  // Force reload of all pending images
  public loadAll(): void {
    const elements = document.querySelectorAll(this.options.selector);
    elements.forEach((element) => {
      this.loadBackgroundImage(element as HTMLElement);
    });
  }

  // Get loading statistics
  public getStats(): { loaded: number; pending: number; errors: number } {
    const pending = document.querySelectorAll('[data-lazy="pending"]').length;
    const loaded = document.querySelectorAll('[data-lazy="loaded"]').length;
    const errors = document.querySelectorAll('[data-lazy="error"]').length;

    return { loaded, pending, errors };
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
