class ApiService {
  constructor() {
    this.baseUrl = window.wpApiSettings?.root || '/wp-json/wp/v2/';
    this.nonce = window.wpApiSettings?.nonce || '';
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        'X-WP-Nonce': this.nonce,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  async getPosts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`posts?${queryString}`);
  }

  async getPages(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`pages?${queryString}`);
  }
}
