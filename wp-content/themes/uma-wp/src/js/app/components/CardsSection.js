/* 
  External Dependencies
 */
import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
    this.initSwiper();
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

  initSwiper() {
    if (!this.validateElement()) return;

    try {
      // Initialize Swiper on the correct element
      this.swiper = new Swiper(this.swiperContainer, this.options.swiperOptions);

      console.log('Testimonials component initialized successfully');

      // Emit event for other components
      EventBus.emit('testimonials:initialized', {
        component: this,
        swiper: this.swiper,
      });
    } catch (error) {
      console.error('Failed to initialize Swiper:', error);
      this.fallbackToBasicCarousel();
    }
  }

  bindEvents() {
    // Listen for resize events to update Swiper
    EventBus.on('viewport:resize', this.handleResize.bind(this));

    // Handle visibility changes to pause/resume autoplay
    document.addEventListener('visibilitychange', () => {
      if (this.swiper && this.swiper.autoplay) {
        if (document.hidden) {
          this.swiper.autoplay.stop();
        } else {
          this.swiper.autoplay.start();
        }
      }
    });

    // Custom navigation if needed
    const prevBtn = this.element.querySelector('.testimonials__prev');
    const nextBtn = this.element.querySelector('.testimonials__next');

    if (prevBtn && this.swiper) {
      prevBtn.addEventListener('click', () => {
        this.swiper.slidePrev();
        // Restart autoplay after manual interaction if needed
        if (this.swiper.autoplay) {
          this.swiper.autoplay.start();
        }
      });
    }

    if (nextBtn && this.swiper) {
      nextBtn.addEventListener('click', () => {
        this.swiper.slideNext();
        // Restart autoplay after manual interaction if needed
        if (this.swiper.autoplay) {
          this.swiper.autoplay.start();
        }
      });
    }
  }

  handleResize() {
    if (this.swiper) {
      // Update Swiper on resize
      this.swiper.update();
    }
  }

  fallbackToBasicCarousel() {
    // Provide a basic carousel fallback if Swiper fails
    console.log('Using fallback carousel implementation');
    // Implement basic carousel logic here
  }

  updateLayout() {
    if (this.swiper) {
      this.swiper.update();
    }
  }

  destroy() {
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = null;
    }
    EventBus.off('viewport:resize', this.handleResize);
    super.destroy();
  }
}
