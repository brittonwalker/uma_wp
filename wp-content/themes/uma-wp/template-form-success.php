<?php
/*
 * Template Name: Form Success
 * Description: A custom form success template.
 */


$context         = Timber::context();
$timber_post     = Timber::get_post();
$context['post'] = $timber_post;

Timber::render( array( 'form-success.twig' ), $context );