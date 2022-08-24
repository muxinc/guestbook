import Head from "next/head";
import useHref from "utils/useHref";

type Props = {
  title?: string;
  description?: string;
  image?: string;
  video?: string;
};
const SEO = ({
  title = "Mux Video Guestbook",
  description = "For all those good memories, from your friends at Mux.",
  image = "https://mux.com/files/mux-video-logo-square.png",
  video,
}: Props) => {
  return (
    <Head>
      <title key="title">{title}</title>
      <meta key="description" name="description" content={description} />
      <link rel="icon" type="image/png" href="/favicon.png" />

      <meta
        key="twitter:card"
        name="twitter:card"
        content="summary_large_image"
      />
      <meta key="twitter:site" name="twitter:site" content="@MuxHQ" />

      <meta
        key="og:site_name"
        property="og:site_name"
        content="Mux Video Guestbook"
      />
      <meta key="og:url" property="og:url" content={useHref()} />
      <meta key="og:type" property="og:type" content="website" />
      <meta key="og:title" property="og:title" content={title} />
      <meta
        key="og:description"
        property="og:description"
        content={description}
      />
      <meta key="og:image" property="og:image" content={image} />
      {video && <meta key="og:video" property="og:video" content={video} />}
      <meta key="og:locale" property="og:locale" content="en_US" />
    </Head>
  );
};

export default SEO;
