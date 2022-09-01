export const eventId = parseInt(process.env.NEXT_PUBLIC_EVENT_ID || "2");

type Event = {
  title: string;
  shareText: string;
};
const events: { [eventId: number]: Event } = {
  2: {
    title: "CascadiaJS 2022 Family Reunion",
    shareText: "OMG! We had so much fun at #CascadiaJS 2022!",
  },
  2468: {
    title: "Developer Mode",
    shareText: "I'm running this app in #DeveloperMode",
  },
};
const event = events[eventId];

export default event;
