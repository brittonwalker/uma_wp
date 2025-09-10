/* 
  External Dependencies
 */
import Swiper from 'swiper';
import { SwiperOptions } from 'swiper/types';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/* 
  Internal Dependencies
 */
import { Component } from '../core/Component';
import EventBus from '../core/EventBus';

interface TestimonialsOptions {
  swiperOptions: SwiperOptions;
}

interface TestimonialsState {}

export class Testimonials extends Component<TestimonialsOptions, TestimonialsState> {
  swiper: Swiper | null = null;
  swiperEl: HTMLElement | null = null;

  get defaultOptions(): Partial<TestimonialsOptions> {
    return {
      swiperOptions: {
        modules: [Navigation, Pagination],
        spaceBetween: 30,
        centeredSlides: true,
        autoHeight: true,
        autoplay: {
          delay: 2500,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.testimonials__pagination',
          clickable: true,
        },
      },
    };
  }

  init(): void {
    super.init();
    this.validateElement();
    this.initSwiper();
  }

  validateElement(): boolean {
    if (!this.element) {
      console.error('Testimonials: No element provided');
      return false;
    }

    if (!this.swiperEl) {
      this.swiperEl = this.element.querySelector('.swiper') as HTMLElement | null;
    }

    if (!this.swiperEl) {
      console.error('Testimonials: No .swiper container found within element');
      return false;
    }

    return true;
  }

  initSwiper(): void {
    if (!this.validateElement()) return;

    try {
      if (!this.swiperEl || this.swiper) return;

      this.swiper = new Swiper(this.swiperEl, this.options.swiperOptions);

      EventBus.emit('testimonials:initialized', {
        component: this,
        swiper: this.swiper,
      });
    } catch (error) {
      console.error('Failed to initialize Swiper:', error);
    }
  }

  bindEvents(): void {
    // Listen for resize events to update Swiper
    EventBus.on('viewport:resize', this.handleResize.bind(this));

    document.addEventListener('visibilitychange', () => {
      if (this.swiper?.autoplay) {
        if (document.hidden) {
          this.swiper.autoplay.stop();
        } else {
          this.swiper.autoplay.start();
        }
      }
    });
  }

  handleResize(): void {
    if (this.swiper) {
      this.swiper.update();
    }
  }

  updateLayout(): void {
    if (this.swiper) {
      this.swiper.update();
    }
  }

  destroy(): void {
    if (this.swiper) {
      this.swiper.destroy(true, true);
      this.swiper = null;
    }
    EventBus.off('viewport:resize', this.handleResize);
    super.destroy();
  }
}
