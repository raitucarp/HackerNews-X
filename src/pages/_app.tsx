import {
  Avatar,
  Box,
  ChakraProvider,
  Divider,
  HStack,
  List,
  ListIcon,
  ListItem,
  Skeleton,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ClientContext, useQuery, useSubscription } from "graphql-hooks";
import { useGraphQLClient } from "../lib/graphql-client";
import theme from "../theme";
import { AppProps } from "next/app";
import Head from "next/head";
import "../style.css";
import { STORY_SUBSCRIPTIONS } from "../graphql/subscriptions/stories";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { formatDistance, fromUnixTime } from "date-fns";
import {
  BiBriefcase,
  BiQuestionMark,
  BiRefresh,
  BiUpvote,
} from "react-icons/bi";
import { GiPartyPopper } from "react-icons/gi";
import Header from "../components/Header";
import Sticky from "react-stickynode";
import { JOBS_QUERY } from "../graphql/queries/jobs";

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

const Jobs = () => {
  const { loading, error, data } = useQuery(JOBS_QUERY, {
    variables: {},
  });

  if (error) return <div>Error loading post</div>;
  if (loading)
    return (
      <Stack>
        <Skeleton height="20px" />
      </Stack>
    );
  return (
    <VStack
      align="self-start"
      width="100%"
      p={3}
      overflowY="scroll"
      height="50vh"
    >
      {data.jobs.map(({ title, url, time }) => (
        <Box p={2} shadow="md" borderWidth="1px" width="100%">
          <Text color="grey" fontSize="xs">
            {formatDistance(fromUnixTime(time), new Date())}
          </Text>
          <Text fontWeight="bold" fontSize="xs">
            {title}
          </Text>
          <Text fontSize="xs" color="blue.500">
            {url}
          </Text>
        </Box>
      ))}
    </VStack>
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
          <Header />
          {/* <Sticky enabled={true} top={100} style={{ width: "15rem" }}>
            <VStack align="flex-start" flex={1} p={5}>
              <List flex={1}>
                <ListItem fontSize="2xl">
                  <ListIcon as={BiUpvote} />
                  top
                </ListItem>
                <ListItem fontSize="2xl">
                  <ListIcon as={BiRefresh} />
                  new
                </ListItem>
                <ListItem fontSize="2xl">
                  <ListIcon as={BiQuestionMark} />
                  ask
                </ListItem>
                <ListItem fontSize="2xl">
                  <ListIcon as={GiPartyPopper} />
                  show
                </ListItem>
                <ListItem fontSize="2xl">
                  <ListIcon as={BiBriefcase} />
                  jobs
                </ListItem>
              </List>
            </VStack>
          </Sticky> */}

          {/* <VStack overflow="hidden"> */}
          <HStack align="flex-start" spacing="0">
            <VStack flex={1} align="flex-start" width="15rem">
              <Sticky
                enabled={true}
                top={75}
                className="leftnav"
                activeClass="sticky-active"
              >
                <Box bg="white" p={3} borderBottom="1px solid black">
                  <List flex={1}>
                    <ListItem fontSize="2xl">
                      <ListIcon as={BiUpvote} />
                      top
                    </ListItem>
                    <ListItem fontSize="2xl">
                      <ListIcon as={BiRefresh} />
                      new
                    </ListItem>
                    <ListItem fontSize="2xl">
                      <ListIcon as={BiQuestionMark} />
                      ask
                    </ListItem>
                    <ListItem fontSize="2xl">
                      <ListIcon as={GiPartyPopper} />
                      show
                    </ListItem>
                    <ListItem fontSize="2xl">
                      <ListIcon as={BiBriefcase} />
                      jobs
                    </ListItem>
                  </List>
                </Box>
                <Jobs />
              </Sticky>
            </VStack>
            <HStack flex={6} align="flex-start">
              <Box bg="#F6F6EF" flex={3}>
                <Component {...pageProps} />
              </Box>

              <Sticky
                enabled={true}
                top={75}
                className="leftnav"
                activeClass="sticky-active"
              >
                <Text>Latest comment</Text>
                <Stack p={1} flex={1} height="80vh" overflowY="scroll">
                  <RightSidebar />
                </Stack>
              </Sticky>
            </HStack>
          </HStack>
          {/* </VStack> */}
        </ChakraProvider>
      </ClientContext.Provider>
    </>
  );
}

export default MyApp;
