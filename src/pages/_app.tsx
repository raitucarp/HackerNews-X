import {
  Avatar,
  Box,
  ChakraProvider,
  HStack,
  List,
  ListItem,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ClientContext, useSubscription } from "graphql-hooks";
import { useGraphQLClient } from "../lib/graphql-client";
import theme from "../theme";
import { AppProps } from "next/app";
import Head from "next/head";
import "../style.css";
import { STORY_SUBSCRIPTIONS } from "../graphql/subscriptions/stories";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { formatDistance, fromUnixTime } from "date-fns";

const RightSidebar = () => {
  const [story, setStory] = useState([]);
  useSubscription({ query: STORY_SUBSCRIPTIONS }, ({ data, errors }) => {
    if (errors && errors.length > 0) {
      // handle your errors
      // setError(errors[0])
      console.log(errors);
      return;
    }

    // all good, handle the gql result
    setStory(data.items);
  });

  return (
    <>
      {/* {JSON.stringify(story)} */}
      {story.map(({ id, by, text, user_info, time }) => (
        <HStack key={id} align="flex-start">
          <Avatar size="2xs" name={user_info.id} src={user_info.avatarUrl} />
          <VStack align="flex-start" spacing={0}>
            <HStack>
              <Text fontSize="xs" fontWeight="bold">
                {user_info.id}
              </Text>
              <Text fontSize="xs" as="span" color="grey">
                {formatDistance(fromUnixTime(time), new Date())}
              </Text>
            </HStack>
            <Box fontSize="xs">
              <ReactMarkdown>{text}</ReactMarkdown>
            </Box>
          </VStack>
        </HStack>
      ))}
    </>
  );
};

function MyApp({ Component, pageProps }: AppProps) {
  const graphQLClient = useGraphQLClient(pageProps.initialGraphQLState);
  return (
    <>
      <Head>
        <title>HackerNews X</title>
      </Head>
      <ClientContext.Provider value={graphQLClient}>
        <ChakraProvider resetCSS theme={theme}>
          <VStack>
            <HStack>
              <div>HackerNews X</div>
            </HStack>
            <HStack spacing={5} width="100vw" align="top" p={5}>
              <VStack position="sticky" top={0} align="flex-start" flex={1}>
                <List flex={1}>
                  <ListItem>top</ListItem>
                  <ListItem>new</ListItem>
                  <ListItem>ask</ListItem>
                  <ListItem>show</ListItem>
                  <ListItem>jobs</ListItem>
                </List>
              </VStack>
              <Box flex={4} width="50%">
                <Component {...pageProps} />
              </Box>
              <Stack flex={2}>
                <RightSidebar />
              </Stack>
            </HStack>
          </VStack>
        </ChakraProvider>
      </ClientContext.Provider>
    </>
  );
}

export default MyApp;
