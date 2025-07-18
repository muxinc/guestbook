import { useVideoContext } from '@/contexts/video-context';
import Grid from './grid';

export default function EntryList() {
    const { videos } = useVideoContext();

    return (
        <>
            {videos.length > 0 ? (
                <Grid entries={videos} />
            ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                    No entries yet. Be the first to record a message!
                </div>
            )}
        </>
    );
}