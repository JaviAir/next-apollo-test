import { useQuery, gql, Context } from "@apollo/client";
import Head from "next/head";

interface launch {
  rocket: {
    rocket_name: string;
  };
  mission_name: string;
}

const getPeople = gql`
  {
    launchesPast(limit: 3) {
      mission_name

      links {
        article_link
        video_link
      }
      rocket {
        rocket_name
      }
      ships {
        name
        image
      }
    }
  }
`;

interface RocketProps {
  launchesPast: {
    mission_name: string;

    links: {
      article_link: string;
      video_link: string;
    };
    rocket: {
      rocket_name: string;
    };
    ships: {
      name: string;
      image: string;
    };
  }[];
}

export default function Characters({ launchesPast }: RocketProps) {
  return (
    <div>
      <Head>
        <title>My Title</title>
      </Head>
      {launchesPast.map((launch: launch, index: number) => {
        return (
          <div key={index}>
            <p>{launch.mission_name}</p>
            <p>{launch.rocket.rocket_name}</p>
          </div>
        );
      })}
    </div>
  );
}

export async function getServerSideProps(context: Context) {
  const req = await fetch("https://api.spacex.land/graphql/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
          {
            launchesPast(limit: 3) {
              mission_name
        
              links {
                article_link
                video_link
              }
              rocket {
                rocket_name
              }
              ships {
                name
                image
              }
            }
          }
          `,
    }),
  });
  const result = await req.json();

  return {
    props: {
      launchesPast: result.data.launchesPast,
    },
  };
}
