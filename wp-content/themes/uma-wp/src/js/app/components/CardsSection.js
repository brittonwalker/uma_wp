/* 
  External Dependencies
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

gsap.registerPlugin(ScrollTrigger);

/* 
  Internal Dependencies
 */
import { Component } from '../core/Component.js';
import EventBus from '../core/EventBus.js';

export class CardsSection extends Component {
  get defaultOptions() {
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
    this.validateElement();
    this.checkScreenSize();
    this.initSwiper();
    // this.setupIntersectionObserver();
  }

  validateElement() {
    if (!this.element) {
      console.error('Testimonials: No element provided');
      return false;
    }

    // Find the actual swiper container within the component
    this.swiperContainer = this.element.querySelector('.swiper');

    if (!this.swiperContainer) {
      console.error('Testimonials: No .swiper container found within element');
      return false;
    }

    return true;
  }

  checkScreenSize() {
    console.log('HEY NOW HEY NOW', window.innerWidth);

    if (window.innerWidth < 640) {
      this.initSwiper();
    } else {
      this.destroySwiper();
    }
  }

  initSwiper() {
    if (!this.validateElement() || this.swiper) return;

    try {
      this.swiper = new Swiper(this.swiperContainer, this.options.swiperOptions);
      console.log('CardsSection Swiper initialized for mobile');

      EventBus.emit('cardsSection:initialized', {
        component: this,
        swiper: this.swiper,
      });
    } catch (error) {
      console.error('Failed to initialize Swiper:', error);
    }
  }

  destroySwiper() {
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = null;
      console.log('CardsSection Swiper destroyed for desktop');
    }
  }

  bindEvents() {
    // Listen for resize events
    EventBus.on('viewport:resize', this.handleResize.bind(this));

    // Add window resize listener
    window.addEventListener('resize', this.debounce(this.handleResize.bind(this), 250));

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
    const cardContainer = this.element.querySelector('.desktop-cards');
    const cardColumns = this.element.querySelectorAll('[data-card-column]');
    if (!cardColumns) return;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: cardContainer,
        start: 'top 95%',
        end: 'top 50%',
        once: true,
      },
    });
    tl.to(cardColumns, {
      duration: 1,
      autoAlpha: 1,
      y: 0,
      ease: 'easeOut',
      onComplete: () => {
        console.log('first animation complete');
      },
    });
  }

  handleResize() {
    // Check screen size and init/destroy swiper accordingly
    this.checkScreenSize();

    if (this.swiper) {
      this.swiper.update();
    }
  }

  debounce(func, wait) {
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

  destroy() {
    this.destroySwiper();
    window.removeEventListener('resize', this.handleResize);
    EventBus.off('viewport:resize', this.handleResize);
    super.destroy();
  }
}
