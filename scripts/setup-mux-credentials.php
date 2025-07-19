<?php

require __DIR__ . '/../vendor/autoload.php';

use function Laravel\Prompts\text;
use function Laravel\Prompts\info;

info('Hey! You can create and get your Mux credentials at: https://dashboard.mux.com/settings/access-tokens');

// Get Mux credentials from user input
$clientId = text(
    label: 'Enter your MUX_CLIENT_ID',
    required: 'The Mux Client ID is required to continue',
    validate: fn (string $value) => 
        strlen($value) < 1 ? 'The MUX Client ID cannot be empty.' : null
);

$clientSecret = text(
    label: 'Enter your MUX_CLIENT_SECRET',
    required: 'The Mux Client Secret is required to continue',
    validate: fn (string $value) => 
        strlen($value) < 1 ? 'The Mux Client Secret cannot be empty.' : null
);

// Append credentials to .env file
file_put_contents(
    __DIR__ . '/../.env', 
    PHP_EOL . PHP_EOL . 
    "MUX_CLIENT_ID={$clientId}" . PHP_EOL . 
    "MUX_CLIENT_SECRET={$clientSecret}" . PHP_EOL .
    "VITE_PUBLIC_EVENT_ID=2468" . PHP_EOL,
    FILE_APPEND
);

info('✓ Mux credentials have been added to your .env file');
info('Next steps:');
info('1. Set up a webhook at https://dashboard.mux.com/settings/webhooks');
info('2. Use ngrok or similar tool to expose your local server publicly');
info('3. The webhook URL that you paste into the Mux dashboard should look like: https://your-ngrok-url.ngrok.io/mux/webhook');