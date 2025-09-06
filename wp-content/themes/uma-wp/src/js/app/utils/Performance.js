export class PerformanceManager {
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  static throttle(func, limit) {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  static lazyLoad(selector, callback) {
    const elements = document.querySelectorAll(selector);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            callback(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '50px' }
    );

    elements.forEach((el) => observer.observe(el));
  }

  static preloadCriticalResources() {
    // Preload critical images, fonts, etc.
    const criticalResources = document.querySelectorAll('[data-preload]');
    criticalResources.forEach((resource) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource.dataset.preload;
      link.as = resource.dataset.preloadAs || 'image';
      document.head.appendChild(link);
    });
  }
}
