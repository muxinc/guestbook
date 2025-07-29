<?php

namespace App\Http\Controllers;

use MuxPhp\Api\DirectUploadsApi;
use MuxPhp\Models\CreateUploadRequest;
use MuxPhp\Models\CreateAssetRequest;
use MuxPhp\Models\InputSettings;
use MuxPhp\Models\InputSettingsOverlaySettings;
use MuxPhp\Models\PlaybackPolicy;
use Illuminate\Http\Request;

use App\Models\Entry;

class UploadController extends Controller
{
    protected DirectUploadsApi $uploads;

    public function __construct(DirectUploadsApi $uploads)
    {
        $this->uploads = $uploads;
    }

    public function create(Request $request)
    {

        try {
            $entry = Entry::create([
                'event_id' => env('VITE_PUBLIC_EVENT_ID'),
                'status' => 'INITIALIZING',
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Could not create record', 'message' => $e->getMessage()], 500);
        }

        $overlaySettings = new InputSettingsOverlaySettings([
            'vertical_align' => 'bottom',
            'vertical_margin' => '5%',
            'horizontal_align' => 'right', 
            'horizontal_margin' => '15%',
            'width' => '15%',
            'opacity' => '90%'
        ]);

        $input = new InputSettings([
            'url' => 'https://laracon.mux.community/logos/laracon.png',
            'overlay_settings' => $overlaySettings
        ]);

        $createAssetRequest = new CreateAssetRequest([
            'playback_policy' => [PlaybackPolicy::_PUBLIC],
            'mp4_support' => 'standard',
            'passthrough' => $entry->id ? json_encode(['entry_id' => $entry->id]) : null,
            'input' => [$input]
        ]);

        $createUploadRequest = new CreateUploadRequest([
            'cors_origin' => '*',
            'new_asset_settings' => $createAssetRequest
        ]);

        $upload = $this->uploads->createDirectUpload($createUploadRequest);

        return response()->json([
            'id' => $entry->id,
            'url' => $upload->getData()->getUrl(),
            'delete_key' => $upload->getData()->getId(),
        ], 201);
    }
}