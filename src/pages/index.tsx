import { initializeGraphQL } from "../lib/graphql-client";
import graphQLRequest from "../lib/graphql-request";
import { TOP_STORIES } from "../graphql/queries/stories";
import { useQuery } from "graphql-hooks";
import {
  Avatar,
  Container,
  HStack,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";

const Index = () => {
  const { loading, error, data } = useQuery(TOP_STORIES, {
    variables: {},
  });

  if (error) return <div>Error loading post</div>;
  if (loading) return <div>Loading</div>;

  return (
    <VStack align="flex-start">
      {data.top_stories.map(({ title, user_info, time }) => (
        <VStack align="flex-start">
          <HStack align="center">
            <Avatar size="sm" name={user_info.id} src={user_info.avatarUrl} />
            <VStack align="flex-start" space={1}>
              <Text size="sm">{user_info.id}</Text>
              <Text size="xs">{time}</Text>
            </VStack>
          </HStack>
          <Text fontSize="xl">{title}</Text>
        </VStack>
      ))}
    </VStack>
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
