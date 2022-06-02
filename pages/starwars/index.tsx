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

export default function Characters({ result, error }) {
  //   const { loading, error, data } = useQuery(getPeople);
  let data = result.data;

  if (error) return <div>error</div>;
  return (
    <div>
      <Head>
        <title>My Title</title>
      </Head>
      {data &&
        data.launchesPast.map((launch: launch, index: number) => {
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
  //fetch
  //   const { loading, error, data } = await useQuery(getPeople);
  let req;
  let data = false;
  let error = false;
  try {
    req = await fetch("https://api.spacex.land/graphql/", {
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
    data = await req.json();
    error = false;
    // await new Promise((r) => setTimeout(r, 3000));
    return {
      props: {
        result: data,
        error: error,
      },
    };
  } catch (error) {
    error = true;

    return {
      props: {
        result: data,
        error: error,
      },
    };
  }
}
