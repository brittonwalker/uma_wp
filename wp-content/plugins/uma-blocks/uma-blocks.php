<?php
/**
 * Plugin Name:       UMA Blocks
 * Description:       A collection of custom blocks for UMA website.
 * Version:           0.1.0
 * Requires at least: 6.7
 * Requires PHP:      7.4
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       uma-blocks
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if ( ! defined( 'UMA_BLOCKS_URL' ) ) {
    define( 'UMA_BLOCKS_URL', plugin_dir_url( __FILE__ ) );
}

if ( ! defined( 'UMA_BLOCKS_PATH' ) ) {
    define( 'UMA_BLOCKS_PATH', plugin_dir_path( __FILE__ ) );
}

/**
 * Register the blocks.
 *
 * @return void
 */
function register_blocks() {
   $build_dir = __DIR__ . '/build/blocks';
   $manifest  = __DIR__ . '/build/blocks-manifest.php';

   // WP 6.8+: one-call convenience.
   if ( function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
       wp_register_block_types_from_metadata_collection( $build_dir, $manifest );
       return;
   }

   // WP 6.7: index the collection, then loop and register each block from metadata.
   if ( function_exists( 'wp_register_block_metadata_collection' ) ) {
       wp_register_block_metadata_collection( $build_dir, $manifest );
       $manifest_data = require $manifest;
       foreach ( array_keys( $manifest_data ) as $block_type ) {
           register_block_type_from_metadata( $build_dir . '/' . $block_type );
       }
       return;
   }

   // WP 5.5-6.6: no collection APIs; just loop the manifest directly.
   if ( function_exists( 'register_block_type_from_metadata' ) ) {
       $manifest_data = require $manifest;
       foreach ( array_keys( $manifest_data ) as $block_type ) {
           register_block_type_from_metadata( $build_dir . '/' . $block_type );
       }
       return;
   }
}
add_action( 'init', 'register_blocks' );

/**
 * Enqueue editor styles for gutenberg editor.
 */
function uma_blocks_editor_styles() {
	if ( is_admin() ) {
		$css_file = UMA_BLOCKS_URL . 'build/editor-styles.css';
		$assets_path = UMA_BLOCKS_PATH . 'build/editor-styles.asset.php';

		if ( ! file_exists( $assets_path ) ) {
			error_log( 'Assets file not found: ' . $assets_path );
			return;
		}

		$assets = include $assets_path;

		wp_enqueue_style(
			'uma-styles-editor',
			$css_file,
			$assets['dependencies'],
			$assets['version']
		);
	}
}

add_action('enqueue_block_assets', 'uma_blocks_editor_styles');
