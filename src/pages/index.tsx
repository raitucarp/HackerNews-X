import { initializeGraphQL } from "../lib/graphql-client";
import graphQLRequest from "../lib/graphql-request";
import { TOP_STORIES } from "../graphql/queries/stories";
import { useQuery } from "graphql-hooks";
import {
  Avatar,
  Box,
  Container,
  HStack,
  Image,
  Skeleton,
  Stack,
  Stat,
  StatArrow,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import Head from "next/head";
import TweetEmbed from "react-tweet-embed";
import { always, cond, match, T, test } from "ramda";
import ReactMarkdown from "react-markdown";

const Index = () => {
  const { loading, error, data } = useQuery(TOP_STORIES, {
    variables: {},
  });

  if (error) return <div>Error loading post</div>;
  if (loading)
    return (
      <Stack>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    );

  return (
    <>
      <Head>
        <title>HackerNews X | Top Stories</title>
      </Head>
      <VStack
        align="flex-start"
        spacing={0}
        borderLeft="1px solid #000"
        width="100%"
        borderRight="1px solid #000"
      >
        {data.top_stories.map(
          ({
            id,
            title,
            user_info,
            time,
            text,
            url_meta,
            url,
            comments,
            score,
          }) => (
            <VStack
              key={id}
              align="flex-start"
              width="100%"
              borderBottom="1px solid #000"
              p={3}
            >
              <HStack align="flex-start" width="100%">
                <Avatar name={user_info.id} src={user_info.avatarUrl} />
                <VStack align="flex-start" spacing={0} width="100%">
                  <HStack>
                    <Text fontSize="sm" fontWeight="bold" as="span">
                      {user_info.id}
                    </Text>
                    <Text fontSize="xs" as="span">
                      {time}
                    </Text>
                  </HStack>
                  <HStack width="100%" align="flex-start">
                    <VStack flex={1} align="flex-start" spacing={0} width="50%">
                      <Text fontSize="md">{title}</Text>
                      <Text>{text}</Text>
                      <Box width="100%">
                        {cond([
                          [
                            test(/twitter\.com/g),
                            always(
                              <TweetEmbed
                                id="1352960673978880000"
                                options={{ theme: "dark" }}
                              />
                            ),
                          ],
                          [T, always(null)],
                        ])(url)}
                      </Box>

                      {url_meta ? (
                        <VStack border="1px solid #000" width="100%">
                          {url_meta.image ? (
                            <Image src={url_meta.image} />
                          ) : null}
                          <Text>{url_meta.title}</Text>
                          <Text>{url}</Text>
                        </VStack>
                      ) : null}

                      <Stack>
                        <Stat>
                          <StatLabel>Point</StatLabel>
                          <StatNumber>
                            <StatArrow type="increase" /> {score}
                          </StatNumber>
                        </Stat>
                      </Stack>
                    </VStack>

                    <VStack flex={1} width="50%" align="flex-start">
                      {comments.map(({ id, by, text, user_info }) => (
                        <HStack key={id} align="flex-start">
                          <Avatar
                            size="xs"
                            name={user_info.id}
                            src={user_info.avatarUrl}
                          />
                          <VStack align="flex-start" spacing={0}>
                            <HStack>
                              <Text fontSize="xs">{user_info.id}</Text>
                            </HStack>
                            <Text fontSize="xs">
                              <ReactMarkdown>{text}</ReactMarkdown>
                            </Text>
                          </VStack>
                        </HStack>
                      ))}
                    </VStack>
                  </HStack>
                </VStack>
              </HStack>
            </VStack>
          )
        )}
      </VStack>
    </>
  );
};

export async function getStaticProps() {
  const client = initializeGraphQL();

  await graphQLRequest(client, TOP_STORIES, {});

  return {
    props: {
      initialGraphQLState: client.cache.getInitialState(),
    },
    revalidate: 1,
  };
}
export default Index;
