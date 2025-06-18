import { type SharedData } from '@/types';
import { Head, Link, usePage, Deferred } from '@inertiajs/react';
import { useEventStream } from "@laravel/stream-react";

import Grid from '@/components/guestbook/grid';
import Navbar from '@/components/guestbook/nav-bar';
import Recorder from '@/components/guestbook/recorder/recorder';
import VideoStore from '@/contexts/video-store';
import { useState } from 'react';

export default function Welcome() {
    const { entries: initialEntries } = usePage<SharedData>().props;
    const [entries, setEntries] = useState(initialEntries);
    
    // Set up the event stream for real-time updates
    const { message } = useEventStream('/events', {
        eventName: 'update',
        onMessage: (event) => {
            try {
                const newEntry = JSON.parse(event.data);
                console.log(newEntry);
                setEntries(prevEntries => {
                    // Check if entry already exists
                    const exists = prevEntries.some(entry => entry.id === newEntry.id);
                    if (exists) {
                        // Update existing entry
                        return prevEntries.map(entry => 
                            entry.id === newEntry.id ? { ...entry, ...newEntry } : entry
                        );
                    } else {
                        // Add new entry
                        return [newEntry, ...prevEntries];
                    }
                });
            } catch (error) {
                console.error('Error parsing event data:', error);
            }
        }
    });

    return (
        <>
            <Head title="Welcome">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
                <main className="h-[100vh] h-[100svh] flex flex-col">
                    <Navbar subheading={`Leave a 3 second video in the Guestbook!`} />
                    <VideoStore initialVideos={[]}>
                        <Recorder />
                    </VideoStore>
                    {/* <Confetti /> */}

                    {entries.length > 0 ? (
                        <Grid entries={entries} />
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500">
                            No entries yet. Be the first to record a message!
                        </div>
                    )}
                </main>
        </>
    );
}
