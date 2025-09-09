<?php
use Timber\Timber;

if (!class_exists('Timber')) {
    return '<p>Timber is required for this block to work.</p>';
}

$context = Timber::context();;
$context['post'] = Timber::get_post();
$context['block'] = $block ?? [];
$context['attributes'] = $attributes ?? [];

$template_path = plugin_dir_path(__FILE__) . '/template.twig';

// Ensure the template exists
if (!file_exists($template_path)) {
    error_log('Template not found tktk: ' . $template_path);
	error_log(('Dir path: ' . plugin_dir_path(__DIR__)));
    return '<p>Error: Template file not found at ' . $template_path . '</p>';
}

// Compile the template to check if it's returning content
$output = Timber::compile($template_path, $context);

if (!$output) {
    error_log('Timber render returned empty output.');
    return '<p>Error: Timber did not render the template.</p>';
}

echo $output;
