export const eventId = parseInt(process.env.NEXT_PUBLIC_EVENT_ID || "5");

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
    shareText: "Talking shop in the sun at #reactmiami – still no Will Smith sightings though.",
    utmCampaign: "react-miami-2023",
  },
  5: {
    title: "Reactathon 2023",
    shareText: "OMG! Having so much fun at #reactathon in SF",
    utmCampaign: "reactathon-2023",
  },
  2468: {
    title: "Developer Mode",
    shareText: "I'm running this app in #DeveloperMode",
    utmCampaign: "developer-mode",
  },
};
const event = events[eventId];

export default event;
