<?php

namespace App\Listeners;

use MartinBean\Laravel\Mux\Events\WebhookReceived;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

use Illuminate\Support\Str;

use App\Models\Entry;

class MuxEventListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(WebhookReceived $event): void
    {
        match ($event->payload['type']) {
            'video.asset.errored' => $this->handleVideoAssetErrored($event->payload),
            'video.asset.ready' => $this->handleVideoAssetSharedEvents($event->payload),
            'video.asset.created' => $this->handleVideoAssetSharedEvents($event->payload),
            default => null, // unhandled event
        };
    }

    protected function handleVideoAssetErrored(array $payload): void
    {
        $passthrough = $payload['data']['passthrough'] ?? null;
        $metadata = $passthrough ? json_decode($passthrough, true) : [];
        
        if (isset($metadata['entry_id'])) {
            $updatePayload = [
                'id' => $metadata['entry_id'],
                'status' => 'ERROR',
            ];

            // Update the entry status to ERROR
            Entry::upsert(
                [$updatePayload],
                ['id'],
                ['status']
            );
        }
    }

    protected function handleVideoAssetSharedEvents(array $payload): void
    {
        $passthrough = $payload['data']['passthrough'] ?? null;
        $status = $payload['data']['status'];
        $playbackIds = $payload['data']['playback_ids'];
        $aspectRatio = $payload['data']['aspect_ratio'] ?? null;

        $metadata = $passthrough ? json_decode($passthrough, true) : [];

        $updatePayload = [
            'id' => $metadata['entry_id'] ?? null,
            'playback_id' => $playbackIds[0]['id'],
            'status' => Str::upper($status),
        ];

        if ($aspectRatio) {
            $updatePayload['aspect_ratio'] = $aspectRatio;
        }

        // Check if entry exists and is already ready
        $entry = Entry::find($metadata['entry_id']);
        
        if ($entry && $entry->status === 'READY') {
            return;
        }

        // Update or create entry
        Entry::upsert(
            [$updatePayload],
            ['id'],
            ['playback_id', 'status', 'aspect_ratio']
        );

        // Store activity
        // DB::table('activity')->insert([
        //     'entry_id' => $metadata['entry_id'],
        //     'payload' => json_encode($payload['data'])
        // ]);
    }
}
