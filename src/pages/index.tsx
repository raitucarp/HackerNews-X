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
  StatGroup,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import Head from "next/head";
import TweetEmbed from "react-tweet-embed";
import { always, cond, equals, isNil, match, T, test } from "ramda";
import ReactMarkdown from "react-markdown";
import { formatDistance, fromUnixTime } from "date-fns";

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
        flex={1}
        borderLeft="1px solid #000"
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
            side_comments,
            main_comments,
            score,
            descendants,
          }) => (
            <VStack
              key={id}
              align="flex-start"
              borderBottom="1px solid #000"
              p={3}
              width="100%"
            >
              <HStack align="flex-start">
                <Avatar name={user_info.id} src={user_info.avatarUrl} />
                <VStack align="flex-start" spacing={0}>
                  <HStack>
                    <Text fontSize="sm" fontWeight="bold" as="span">
                      {user_info.id}
                    </Text>
                    <Text fontSize="xs" color="grey" as="span">
                      {formatDistance(fromUnixTime(time), new Date())}
                    </Text>
                  </HStack>
                  <HStack align="flex-start" width="100%">
                    <VStack flex={1} width="50%" align="flex-start">
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
                          [
                            T,
                            always(
                              cond([
                                [isNil, always(<Box width="100%">-</Box>)],
                                [
                                  T,
                                  (meta) => (
                                    <VStack
                                      border="1px solid #000"
                                      width="100%"
                                      borderRadius={7}
                                      spacing={0}
                                      p={0}
                                      overflow="hidden"
                                    >
                                      {meta.image && (
                                        <Image src={meta.image} width="100%" />
                                      )}
                                      <VStack
                                        p={2}
                                        backgroundColor="grey"
                                        width="100%"
                                        spacing={1}
                                        align="flex-start"
                                      >
                                        {meta.title && (
                                          <Text fontSize="xs" fontWeight="bold">
                                            {meta.title}
                                          </Text>
                                        )}
                                        {meta.description && (
                                          <Text fontSize="xs">
                                            {meta.description}
                                          </Text>
                                        )}
                                        <Text fontSize="xs">{url}</Text>
                                      </VStack>
                                    </VStack>
                                  ),
                                ],
                              ])(url_meta)
                            ),
                          ],
                        ])(url)}
                      </Box>
                      <Stat>
                        <StatLabel>Point</StatLabel>
                        <StatNumber>{score}</StatNumber>
                      </Stat>
                      <Stat>
                        <StatLabel>Comments</StatLabel>
                        <StatNumber>{descendants}</StatNumber>
                      </Stat>
                      {main_comments.map(
                        ({ id, by, text, user_info, replies }) => (
                          <HStack key={id} align="flex-start">
                            <Avatar
                              size="xs"
                              name={user_info.id}
                              src={user_info.avatarUrl}
                            />
                            <VStack align="flex-start" spacing={0}>
                              <HStack>
                                <Text fontSize="xs" fontWeight="bold">
                                  {user_info.id}
                                </Text>
                                <Text fontSize="xs" as="span" color="grey">
                                  {formatDistance(
                                    fromUnixTime(time),
                                    new Date()
                                  )}
                                </Text>
                              </HStack>
                              <VStack fontSize="xs">
                                <ReactMarkdown>{text}</ReactMarkdown>
                                {replies.map(({ id, by, text, user_info }) => (
                                  <HStack key={id} align="flex-start">
                                    <Avatar
                                      size="2xs"
                                      name={user_info.id}
                                      src={user_info.avatarUrl}
                                    />
                                    <VStack align="flex-start" spacing={0}>
                                      <HStack>
                                        <Text fontSize="xs" fontWeight="bold">
                                          {user_info.id}
                                        </Text>
                                        <Text
                                          fontSize="xs"
                                          as="span"
                                          color="grey"
                                        >
                                          {formatDistance(
                                            fromUnixTime(time),
                                            new Date()
                                          )}
                                        </Text>
                                      </HStack>
                                      <Box fontSize="xs">
                                        <ReactMarkdown>{text}</ReactMarkdown>
                                      </Box>
                                    </VStack>
                                  </HStack>
                                ))}
                              </VStack>
                            </VStack>
                          </HStack>
                        )
                      )}
                    </VStack>

                    <VStack flex={1} width="50%" align="flex-start" p={2}>
                      {side_comments.map(
                        ({ id, by, text, user_info, replies }) => (
                          <HStack key={id} align="flex-start">
                            <Avatar
                              size="xs"
                              name={user_info.id}
                              src={user_info.avatarUrl}
                            />
                            <VStack align="flex-start" spacing={0}>
                              <HStack>
                                <Text fontSize="xs" fontWeight="bold">
                                  {user_info.id}
                                </Text>
                                <Text fontSize="xs" as="span" color="grey">
                                  {formatDistance(
                                    fromUnixTime(time),
                                    new Date()
                                  )}
                                </Text>
                              </HStack>
                              <VStack fontSize="xs">
                                <ReactMarkdown>{text}</ReactMarkdown>
                                {replies.map(({ id, by, text, user_info }) => (
                                  <HStack key={id} align="flex-start">
                                    <Avatar
                                      size="2xs"
                                      name={user_info.id}
                                      src={user_info.avatarUrl}
                                    />
                                    <VStack align="flex-start" spacing={0}>
                                      <HStack>
                                        <Text fontSize="xs" fontWeight="bold">
                                          {user_info.id}
                                        </Text>
                                        <Text
                                          fontSize="xs"
                                          as="span"
                                          color="grey"
                                        >
                                          {formatDistance(
                                            fromUnixTime(time),
                                            new Date()
                                          )}
                                        </Text>
                                      </HStack>
                                      <Box fontSize="xs">
                                        <ReactMarkdown>{text}</ReactMarkdown>
                                      </Box>
                                    </VStack>
                                  </HStack>
                                ))}
                              </VStack>
                            </VStack>
                          </HStack>
                        )
                      )}
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
