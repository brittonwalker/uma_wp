<?php
/*
 * Template Name: Landing Page
 * Description: A custom landing page template.
 */


$context         = Timber::context();
$timber_post     = Timber::get_post();
$context['post'] = $timber_post;

Timber::render( array( 'landing-page.twig' ), $context );