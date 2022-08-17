import type { NextPage } from "next";
import Head from "next/head";
import { gql, useQuery } from "@apollo/client";
import { AwesomeLink } from "../components/AwesomeLink";
import Link from "next/link";

const AllLinksQuery = gql`
  query allLinksQuery($first: Int, $after: String) {
    links(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          title
          description
          imgUrl
          url
          category
        }
      }
    }
  }
`;

const Home: NextPage = () => {
  const { data, error, loading, fetchMore } = useQuery(AllLinksQuery, {
    variables: {
      first: 2,
    },
  });

  if (loading) return <p>Loading ...</p>;

  if (error) return <p>Oops, something went wrong {error.message}</p>;

  const { endCursor, hasNextPage } = data.links.pageInfo;

  return (
    <div>
      <Head>
        <title>Awesome Links</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto max-w-5xl my-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data?.links.edges.map(({ node }) => (
            <Link href={`/link/${node.id}`} key={node.id}>
              <a>
                <AwesomeLink
                  key={node.id}
                  id={node.id}
                  title={node.title}
                  url={node.url}
                  imgUrl={node.imgUrl}
                  category={node.category}
                  description={node.description}
                />
              </a>
            </Link>
          ))}
        </div>
        {hasNextPage ? (
          <button
            className="px-4 py-2 bg-blue-500 hover:bg-blue-800 text-white rounded my-10"
            onClick={() => {
              fetchMore({
                variables: { after: endCursor },
                updateQuery: (prevResult, { fetchMoreResult }) => {
                  fetchMoreResult.links.edges = [
                    ...prevResult.links.edges,
                    ...fetchMoreResult.links.edges,
                  ];
                  return fetchMoreResult;
                },
              });
            }}
          >
            More
          </button>
        ) : (
          <p className="my-10 text-center font-medium">
            You've reached the end!
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
