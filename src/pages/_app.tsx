import {
  Box,
  ChakraProvider,
  HStack,
  List,
  ListItem,
  Stack,
  VStack,
} from "@chakra-ui/react";
import { ClientContext } from "graphql-hooks";
import { useGraphQLClient } from "../lib/graphql-client";
import theme from "../theme";
import { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  const graphQLClient = useGraphQLClient(pageProps.initialGraphQLState);
  return (
    <ClientContext.Provider value={graphQLClient}>
      <ChakraProvider resetCSS theme={theme}>
        <VStack>
          <HStack>
            <div>erer</div>
            <div>erer</div>
          </HStack>
          <HStack spacing={5} width="100vw" align="top" p={10}>
            <VStack position="sticky" top={0} align="flex-start" flex={1}>
              <List flex={1}>
                <ListItem>top</ListItem>
                <ListItem>new</ListItem>
                <ListItem>ask</ListItem>
                <ListItem>show</ListItem>
                <ListItem>jobs</ListItem>
              </List>
            </VStack>
            <Box flex={4}>
              <Component {...pageProps} />
            </Box>
            <Stack flex={2}>
              <div>rerer</div>
            </Stack>
          </HStack>
        </VStack>
      </ChakraProvider>
    </ClientContext.Provider>
  );
}

export default MyApp;
