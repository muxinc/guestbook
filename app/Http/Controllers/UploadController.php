<?php

namespace App\Http\Controllers;

use App\Models\Entry;
use Illuminate\Http\Request;
use MuxPhp\Api\DirectUploadsApi;
use MuxPhp\Models\CreateAssetRequest;
use MuxPhp\Models\CreateUploadRequest;
use MuxPhp\Models\PlaybackPolicy;

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

        $createAssetRequest = new CreateAssetRequest([
            'playback_policy' => [PlaybackPolicy::_PUBLIC],
            'mp4_support' => 'standard',
            'passthrough' => $entry->id ? json_encode(['entry_id' => $entry->id]) : null,
        ]);

        $createUploadRequest = new CreateUploadRequest([
            'cors_origin' => '*',
            'new_asset_settings' => $createAssetRequest,
        ]);

        $upload = $this->uploads->createDirectUpload($createUploadRequest);

        return response()->json([
            'id' => $entry->id,
            'url' => $upload->getData()->getUrl(),
            'delete_key' => $upload->getData()->getId(),
        ], 201);
    }
}
