<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use function Laravel\Prompts\text;
use function Laravel\Prompts\info;

class MuxSetup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'mux:setup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Set up Mux credentials and configuration for the application';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('Setting up Mux integration...');
        $this->newLine();
        
        info('Hey! You can create and get your Mux credentials at: https://dashboard.mux.com/settings/access-tokens');
        $this->newLine();

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

        // Check if .env file exists
        $envPath = base_path('.env');
        if (!file_exists($envPath)) {
            $this->error('.env file not found. Please copy .env.example to .env first.');
            return 1;
        }

        // Read existing .env content
        $envContent = file_get_contents($envPath);
        
        // Check if MUX credentials already exist
        if (str_contains($envContent, 'MUX_CLIENT_ID=')) {
            if (!$this->confirm('Mux credentials already exist in .env file. Do you want to overwrite them?')) {
                $this->info('Setup cancelled.');
                return 0;
            }
            
            // Remove existing MUX credentials
            $envContent = preg_replace('/^MUX_CLIENT_ID=.*$/m', '', $envContent);
            $envContent = preg_replace('/^MUX_CLIENT_SECRET=.*$/m', '', $envContent);
            $envContent = preg_replace('/^VITE_PUBLIC_EVENT_ID=.*$/m', '', $envContent);
        }

        // Append credentials to .env file
        $muxConfig = PHP_EOL . PHP_EOL . 
            "MUX_CLIENT_ID={$clientId}" . PHP_EOL . 
            "MUX_CLIENT_SECRET={$clientSecret}" . PHP_EOL .
            "VITE_PUBLIC_EVENT_ID=2468" . PHP_EOL;

        file_put_contents($envPath, $envContent . $muxConfig);

        $this->newLine();
        info('✓ Mux credentials have been added to your .env file');
        $this->newLine();
        
        $this->info('Next steps:');
        $this->line('1. Set up a webhook at https://dashboard.mux.com/settings/webhooks');
        $this->line('2. Use ngrok or similar tool to expose your local server publicly');
        $this->line('3. The webhook URL that you paste into the Mux dashboard should look like:');
        $this->comment('   https://your-ngrok-url.ngrok.io/mux/webhook');
        
        $this->newLine();
        $this->info('Setup completed successfully! 🎉');

        return 0;
    }
}