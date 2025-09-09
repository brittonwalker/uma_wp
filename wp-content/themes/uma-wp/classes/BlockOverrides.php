<?php
/**
 * Implements Project class
 *
 * @package tktk-theme
 */

namespace Tktk;

use Timber\Timber;

class BlockOverrides {
    /**
     * @var string $version
     */
    public $block_map = [
        'uma-blocks/hero-lander' => 'handle_hero_lander',
        'uma-blocks/testimonials' => 'handle_testimonials',
        'uma-blocks/cta-form' => 'handle_cta_form',
        'uma-blocks/cards-section' => 'handle_cards_section',
    ];

    /**
     * Constructor
     */
    public function __construct() {
        add_filter('render_block', [$this, 'override_block_render'], 10, 2);
    }

    /**
     * Override block rendering
     *
     * @param string $block_content The block content.
     * @param array  $block        The block data.
     *
     * @return string Modified block content.
     */
    public function override_block_render($block_content, $block) {
        if (isset($this->block_map[$block['blockName']])) {
            $handler = $this->block_map[$block['blockName']];
            if (method_exists($this, $handler)) {
                return $this->$handler($block, $block_content);
            }
        }

        return $block_content;
    }

    public function handle_hero_lander($block) {
        $title = $block['attrs']['title'] ?? '';
        $subtitle = $block['attrs']['subtitle'] ?? '';
        $text = $block['attrs']['text'] ?? '';
        $bg_image_id = $block['attrs']['bgImage']['id'] ?? null;
        $image_id = $block['attrs']['heroImage']['id'] ?? null;
        
        $bg_image = $bg_image_id ? Timber::get_image($bg_image_id) : null;
        $image = $image_id ? Timber::get_image($image_id) : null;

        return Timber::compile('components/landing-hero/index.twig', [
            'title' => $title,
            'subtitle' => $subtitle,
            'text' => $text,
            'bg_image' => $bg_image,
            'image' => $image,
        ]);
    }

    public function handle_cards_section($block) {
        $title = $block['attrs']['title'] ?? '';
        $cards = [];
        $inner_blocks = $block['innerBlocks'] ?? [];
        foreach ($inner_blocks as $inner_block) {
            if ($inner_block['blockName'] === 'uma-blocks/cards-section-card') {
                $bg_image_id = $inner_block['attrs']['bgImage']['id'] ?? null;
                
                $cards[] = [
                    'title' => $inner_block['attrs']['title'] ?? '',
                    'content' => $inner_block['attrs']['content'] ?? '',
                    'bg_image' => $bg_image_id ? Timber::get_image($bg_image_id) : null,
                ];
            }
        }
        return Timber::compile('components/cards-section/index.twig', [
            'title' => $title,
            'cards' => $cards,
        ]);
    }

    public function handle_testimonials($block, $block_content) {
        $testimonials = [];
        $inner_blocks = $block['innerBlocks'] ?? [];
        foreach ($inner_blocks as $inner_block) {
            if ($inner_block['blockName'] === 'uma-blocks/testimonial') {
                  $content = '';
                  if (!empty($inner_block['innerBlocks'])) {
                      foreach ($inner_block['innerBlocks'] as $nested_block) {
                          $content .= render_block($nested_block);
                      }
                  }
                $testimonials[] = [
                    'slide_author' => $inner_block['attrs']['author'] ?? '',
                    'content' => $content,
                ];
            }
        }
        return Timber::compile('components/testimonials/index.twig', [
            'testimonials' => $testimonials,
        ]);
    }

    public function handle_cta_form($block) {
        $title = $block['attrs']['title'] ?? '';
        $subtitle = $block['attrs']['subtitle'] ?? '';
        $text = $block['attrs']['text'] ?? '';
        $form_shortcode = $block['attrs']['formShortcode'] ?? '';

        return Timber::compile('components/cta/index.twig', [
            'title' => $title,
            'subtitle' => $subtitle,
            'text' => $text,
            'form_shortcode' => $form_shortcode,
        ]);
    }
}
