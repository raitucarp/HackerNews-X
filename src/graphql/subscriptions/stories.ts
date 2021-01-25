export const STORY_SUBSCRIPTIONS = /* GraphQL */ `
  subscription TotalCount {
    items {
      ... on Comment {
        id
        by
        text
        time
        score
        user_info {
          id
          karma
          about
          avatarUrl
        }
      }
      ... on Story {
        id
        by
        text
        time
        score
        user_info {
          id
          karma
          about
          avatarUrl
        }
      }
    }
  }
`;
