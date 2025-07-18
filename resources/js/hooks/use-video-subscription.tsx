import { useVideoContext } from "@/contexts/video-context";
import { useEventStream } from "@laravel/stream-react";

export default function useVideoSubscription() {
    const { setVideo, setOpenVideo } = useVideoContext();
    
    // Set up the event stream for real-time updates
    const { message } = useEventStream('/events', {
        eventName: 'update',
        onMessage: (event) => {
            try {
                const newEntry = JSON.parse(event.data);
                console.log(newEntry);
                setVideo(newEntry);
            } catch (error) {
                console.error('Error parsing event data:', error);
            }
        }
    });
}
