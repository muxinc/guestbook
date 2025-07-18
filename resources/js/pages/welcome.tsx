import { Head } from '@inertiajs/react';

import Navbar from '@/components/guestbook/nav-bar';
import Recorder from '@/components/guestbook/recorder/recorder';
import VideoStore from '@/contexts/video-store';
import Confetti from '@/components/guestbook/confetti';
import EntryList from '@/components/guestbook/entry-list';

import useVideoSubscription from '@/hooks/use-video-subscription';

export default function Welcome() {

    // useVideoSubscription();

    return (
        <>
            <Head title="Sign the video guestbook!">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <main className="flex h-[100vh] h-[100svh] flex-col">
                <Navbar subheading={`Leave a 3 second video in the Guestbook!`} />
                <VideoStore>
                    <Recorder />
                    <Confetti />
                    <EntryList />
                </VideoStore>
            </main>
        </>
    );
}
