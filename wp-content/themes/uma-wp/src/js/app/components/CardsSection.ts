/* 
  External Dependencies
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Swiper } from 'swiper';
import { SwiperOptions } from 'swiper/types';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

gsap.registerPlugin(ScrollTrigger);

/* 
  Internal Dependencies
 */
import { Component } from '../core/Component';
import EventBus from '../core/EventBus';

interface CardsSectionOptions {
  animationDuration: number;
  lazyLoad: boolean;
  swiperOptions: SwiperOptions; // Could be more specific with Swiper types
}

interface CardsSectionState {
  isSwiperActive: boolean;
}

export class CardsSection extends Component<CardsSectionOptions, CardsSectionState> {
  swiper: Swiper | null = null;
  swiperEl: HTMLElement | null = null;
  private resizeHandler?: () => void;

  get defaultOptions(): Partial<CardsSectionOptions> {
    return {
      animationDuration: 300,
      lazyLoad: true,
      swiperOptions: {
        modules: [Navigation, Pagination],
        slidesPerView: 1.03,
        spaceBetween: 18,
        loop: false,
        autoplay: {
          delay: 5000,
        },
        centeredSlides: true,
        centeredSlidesBounds: true,
        centerInsufficientSlides: true,
        pagination: {
          el: '.cards__pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        breakpoints: {
          640: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        },
      },
    };
  }

  init() {
    super.init();
    this.initSwiper();
    this.setupIntersectionObserver();
  }

  validateElement(): boolean {
    if (!this.element) {
      console.error('Testimonials: No element provided');
      return false;
    }

    this.swiperEl = this.element.querySelector('.swiper') as HTMLElement | null;

    if (!this.swiperEl) {
      console.error('Testimonials: No .swiper container found within element');
      return false;
    }

    return true;
  }

  checkScreenSize(): void {
    if (window.innerWidth < 640) {
      this.initSwiper();
    } else {
      this.destroySwiper();
    }
  }

  initSwiper(): void {
    this.swiperEl = this.element.querySelector('.swiper') as HTMLElement | null;

    if (!this.swiperEl || this.swiper) return;

    try {
      this.swiper = new Swiper(this.swiperEl, this.options.swiperOptions);

      EventBus.emit('cardsSection:initialized', {
        component: this,
        swiper: this.swiper,
      });
    } catch (error) {
      console.error('Failed to initialize Swiper:', error);
    }
  }

  destroySwiper(): void {
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = null;
      console.log('CardsSection Swiper destroyed for desktop');
    }
  }

  bindEvents(): void {
    EventBus.on('viewport:resize', this.handleResize.bind(this));

    this.resizeHandler = this.debounce(this.handleResize.bind(this), 250);
    window.addEventListener('resize', this.resizeHandler);

    // Handle visibility changes only if swiper exists
    document.addEventListener('visibilitychange', () => {
      if (this.swiper && this.swiper.autoplay) {
        if (document.hidden) {
          this.swiper.autoplay.stop();
        } else {
          this.swiper.autoplay.start();
        }
      }
    });
  }

  setupIntersectionObserver() {
    const cardContainer = this.element.querySelector('.desktop-cards') as HTMLElement | null;
    const cardColumns = this.element.querySelectorAll('[data-card-column]');

    if (!cardColumns || cardColumns.length === 0) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: cardContainer,
        start: 'top 120%',
        end: 'top 30%',
        scrub: true,
      },
    });

    tl.to(cardColumns, {
      duration: 1,
      autoAlpha: 1,
      y: 0,
      ease: 'easeOut',
    });
  }

  handleResize() {
    // Check screen size and init/destroy swiper accordingly
    this.checkScreenSize();

    if (this.swiper) {
      this.swiper.update();
    }
  }

  debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): (...args: Parameters<T>) => void {
    let timeout: number | undefined;

    return (...args: Parameters<T>) => {
      const later = () => {
        timeout = undefined;
        func(...args);
      };

      if (timeout !== undefined) {
        window.clearTimeout(timeout);
      }
      timeout = window.setTimeout(later, wait);
    };
  }

  destroy() {
    this.destroySwiper();
    window.removeEventListener('resize', this.handleResize);
    EventBus.off('viewport:resize', this.handleResize);
    super.destroy();
  }
}
