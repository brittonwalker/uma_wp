<?php
/**
 * Implements Enqueue class for tktk-theme assets with proper HMR CSS handling
 *
 * @package tktk-theme
 */

namespace Tktk;

class Enqueue {

    /**
     * @var string $version
     */
    public $version = '';

    /**
     * @var string $url
     */
    public $url = '';

    /**
     * @var string $namespace
     */
    public $namespace;

    /**
     * @var bool $is_development
     */
    private $is_development = false;

    /**
     * @var string $hmr_server_url
     */
    private $hmr_server_url = 'http://localhost:8080';

    /**
     * @var bool $hmr_available
     */
    private $hmr_available = false;

    /**
     * Public constructor
     */
    public function __construct( $namespace ) {
        $this->namespace = $namespace;
        $this->url       = get_stylesheet_directory_uri();

        // Check if we're in development mode
        $this->is_development = defined('WP_DEBUG') && WP_DEBUG && !is_admin();
        
        // Check if HMR server is available
        if ( $this->is_development ) {
            $this->hmr_available = $this->check_hmr_server();
        }

        // Ensure asset file exists before including
        $asset_path = get_stylesheet_directory() . '/build/index.asset.php';
        if ( file_exists( $asset_path ) ) {
            $asset = include $asset_path;
        } else {
            $asset = [];
        }

        // Determine versioning strategy
        if ( strpos( get_site_url(), '.test' ) !== false || $this->hmr_available ) {
            $this->version = time(); // Cache bust in dev
        } else {
            $theme         = wp_get_theme();
            $this->version = is_array( $asset ) && isset( $asset['version'] ) ? $asset['version'] : $theme->get( 'Version' );
        }

        // Hooks
        add_action( 'admin_enqueue_scripts', [ $this, 'admin_styles' ] );
        add_action( 'wp_enqueue_scripts', [ $this, 'site_styles' ] );
        add_action( 'wp_enqueue_scripts', [ $this, 'site_scripts' ] );
        
        // Add HMR support if available
        if ( $this->hmr_available ) {
            add_action( 'wp_head', [ $this, 'hmr_support_script' ] );
        }
    }

    /**
     * Check if HMR server is running
     *
     * @return bool
     */
    private function check_hmr_server() {
        $context = stream_context_create([
            'http' => [
                'timeout' => 1,
                'ignore_errors' => true
            ]
        ]);
        
        $result = @file_get_contents( $this->hmr_server_url . '/webpack-dev-server', false, $context );
        return $result !== false;
    }

    /**
     * Admin Styles
     */
    public function admin_styles() {
        wp_enqueue_style(
            "{$this->namespace}-admin",
            "{$this->url}/admin-css/css/admin.css",
            [],
            $this->version,
            'screen'
        );
    }

    /**
     * Site Styles
     */
    public function site_styles() {
        if ( $this->hmr_available ) {
            // In HMR mode with style-loader, CSS is injected via JavaScript
            // But we should still check if there's a built CSS file as fallback
            // This handles the case where wp-scripts might still extract CSS
            
            $css_file = get_template_directory() . '/build/index.css';
            if ( ! file_exists( $css_file ) ) {
                // No CSS file means it's being injected by webpack (style-loader)
                return;
            }
            
            // If CSS file exists but HMR is active, still skip it
            // because style-loader will inject updated styles
            return;

                    wp_enqueue_style(
            $this->namespace,
            $this->hmr_server_url . '/index.css',
            [],
            $this->version,
            'screen, print'
            );
        }

        // Production mode - load extracted CSS file
        wp_enqueue_style(
            $this->namespace,
            get_theme_file_uri( '/build/index.css' ),
            [],
            $this->version,
            'screen, print'
        );
    }

    /**
     * Site Scripts
     */
    public function site_scripts() {
        if ( $this->hmr_available ) {
            // Load from HMR server
            wp_enqueue_script(
                $this->namespace,
                $this->hmr_server_url . '/index.js',
                [],
                null,
                true
            );
            
            // Add any additional entry points if you have them
            if ( $this->has_styleguide_entry() ) {
                wp_enqueue_script(
                    "{$this->namespace}-styleguide",
                    $this->hmr_server_url . '/styleguide.js',
                    [],
                    null,
                    true
                );
            }
        } else {
            // Load built files
            wp_enqueue_script(
                $this->namespace,
                get_theme_file_uri( '/build/index.js' ),
                [ 'jquery' ],
                $this->version,
                true
            );
        }
    }

    /**
     * Check if styleguide entry exists in webpack config
     *
     * @return bool
     */
    private function has_styleguide_entry() {
        return isset( $_GET['styleguide'] ) || is_page( 'styleguide' );
    }

    /**
     * Add HMR support script to head
     */
    public function hmr_support_script() {
        ?>
        <script>
        console.log('🔥 HMR: Hot Module Replacement enabled');
        
        // HMR Support for WordPress
        if (typeof module !== 'undefined' && module.hot) {
            module.hot.accept();
            console.log('🔥 HMR: Module hot acceptance enabled');
        }
        
        // Enhanced webpack-dev-server connection with better error handling
        if (typeof window !== 'undefined') {
            try {
                // Connect to webpack-dev-server for live updates
                const eventSource = new EventSource('<?php echo esc_js( $this->hmr_server_url ); ?>/webpack-dev-server');
                
                eventSource.onopen = function() {
                    console.log('🔥 HMR: Connected to webpack-dev-server');
                };
                
                eventSource.onmessage = function(event) {
                    try {
                        const data = event.data;
                        if (data.includes('invalid')) {
                            console.log('🔥 HMR: Compiling...');
                            document.body.style.borderTop = '3px solid #ff6b35';
                        } else if (data.includes('hash')) {
                            console.log('🔥 HMR: Compilation complete');
                            document.body.style.borderTop = '';
                        } else if (data.includes('ok')) {
                            console.log('🔥 HMR: Build successful');
                        } else if (data.includes('errors')) {
                            console.warn('🔥 HMR: Build errors detected');
                        }
                    } catch (e) {
                        console.warn('🔥 HMR: Error parsing server message:', e);
                    }
                };
                
                eventSource.onerror = function(error) {
                    console.warn('🔥 HMR: Connection error, but this is normal when the dev server restarts');
                };
                
                // Cleanup on page unload
                window.addEventListener('beforeunload', function() {
                    eventSource.close();
                });
                
            } catch (error) {
                console.warn('🔥 HMR: Could not connect to webpack-dev-server:', error);
            }
        }
        </script>
        <style>
        /* HMR Development Indicator */
        body::before {
            content: "🔥 HMR Active";
            position: fixed;
            top: 0;
            right: 0;
            background: #ff6b35;
            color: white;
            padding: 4px 8px;
            font-size: 12px;
            font-family: monospace;
            z-index: 999999;
            border-bottom-left-radius: 4px;
            opacity: 0.8;
        }
        
        /* Hide indicator on mobile */
        @media (max-width: 768px) {
            body::before {
                display: none;
            }
        }
        </style>
        <?php
    }

    /**
     * Get HMR server status for debugging
     *
     * @return array
     */
    public function get_hmr_status() {
        return [
            'is_development' => $this->is_development,
            'hmr_available' => $this->hmr_available,
            'hmr_server_url' => $this->hmr_server_url,
            'version' => $this->version,
            'css_file_exists' => file_exists( get_template_directory() . '/build/index.css' ),
        ];
    }
}