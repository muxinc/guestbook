export const eventId = parseInt(import.meta.env.VITE_PUBLIC_EVENT_ID || "8");

type Event = {
  title: string;
  shareText: string;
  utmCampaign: string;
};
const events: { [eventId: number]: Event } = {
  2: {
    title: "CascadiaJS 2022 Family Reunion",
    shareText: "OMG! We had so much fun at #CascadiaJS 2022!",
    utmCampaign: "cascadiajs",
  },
  3: {
    title: "Jamstack Conf 2022",
    shareText: "Having all the fun at #JamstackConf 2022!",
    utmCampaign: "jamstack-2022",
  },
  4: {
    title: "React Miami 2023",
    shareText:
      "Talking shop in the sun at #reactmiami – still no Will Smith sightings though.",
    utmCampaign: "react-miami-2023",
  },
  5: {
    title: "Reactathon 2023",
    shareText: "OMG! Having so much fun at #reactathon in SF",
    utmCampaign: "reactathon-2023",
  },
  6: {
    title: "Reactathon 2023",
    shareText: "Living my best life at #RenderATL23",
    utmCampaign: "renderatl-2023",
  },
  7: {
    title: "CascadiaJS 2024",
    shareText: "Hangin' with my besties at #CascadiaJS 2024",
    utmCampaign: "cascadiajs-2024",
  },
  8: {
    title: "Laracon US 2025",
    shareText: "Having a blast at #LaraconUS 2025",
    utmCampaign: "laracon-us-2025",
  },
  2468: {
    title: "Developer Mode",
    shareText: "I'm running this app in #DeveloperMode",
    utmCampaign: "developer-mode",
  },
};
const event = events[eventId];

export default event;
