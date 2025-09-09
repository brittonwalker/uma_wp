<?php
/**
 * The tktk theme functions and definitions
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package tktk
 */

use Timber\Timber;
use Tktk\Setup;
use Tktk\Enqueue;
use Tktk\TimberContext;
use Tktk\CustomRoutes;
use Tktk\StyleguideRoutes;
use Tktk\BlockOverrides;


// Load Composer dependencies
if ( file_exists(__DIR__ . '/vendor/autoload.php') ) {
    require_once __DIR__ . '/vendor/autoload.php';
}

// Initialize Timber if available
if ( class_exists(Timber::class) ) {
    Timber::init();
} else {
    add_action('admin_notices', function () {
        echo '<div class="error"><p>Timber is not installed. Please run <code>composer install</code>.</p></div>';
    });
}

new Setup();
new Enqueue( 'tktk' );
new TimberContext();
new CustomRoutes();
new StyleguideRoutes();
new BlockOverrides();

// add_action('wp_footer', function() {
//     if (current_user_can('manage_options')) {
//         global $wp_scripts, $wp_styles;
        
//         // Get the Enqueue instance
//         $enqueue_classes = get_declared_classes();
//         $enqueue_instance = null;
//         foreach ($GLOBALS as $key => $value) {
//             if ($value instanceof \Tktk\Enqueue) {
//                 $enqueue_instance = $value;
//                 break;
//             }
//         }
        
//         echo '<div style="position:fixed;bottom:0;left:0;background:#000;color:#fff;padding:10px;font-size:11px;z-index:99999;max-width:500px;max-height:400px;overflow:auto;border:2px solid #ff6b35;">';
//         echo '<strong>🔥 Debug Info:</strong><br>';
        
//         if ($enqueue_instance) {
//             $status = $enqueue_instance->get_hmr_status();
//             echo 'HMR Available: ' . ($status['hmr_available'] ? 'YES' : 'NO') . '<br>';
//             echo 'Development: ' . ($status['is_development'] ? 'YES' : 'NO') . '<br>';
//             echo 'Server URL: ' . $status['hmr_server_url'] . '<br>';
//             echo 'WP_DEBUG: ' . (defined('WP_DEBUG') && WP_DEBUG ? 'YES' : 'NO') . '<br>';
//             echo 'is_admin(): ' . (is_admin() ? 'YES' : 'NO') . '<br><br>';
//         }
        
//         echo '<strong>Scripts:</strong><br>';
//         foreach($wp_scripts->queue as $script) {
//             $src = $wp_scripts->registered[$script]->src ?? 'No src';
//             echo $script . ': ' . $src . '<br>';
//         }
        
//         echo '<br><strong>Styles:</strong><br>';
//         foreach($wp_styles->queue as $style) {
//             $src = $wp_styles->registered[$style]->src ?? 'No src';
//             echo $style . ': ' . $src . '<br>';
//         }
//         echo '</div>';
//     }
// }, 999);