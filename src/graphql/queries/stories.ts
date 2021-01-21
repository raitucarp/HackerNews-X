export const TOP_STORIES = /* GraphQL */ `
  query {
    top_stories {
      # ... on Comment {
      #   text
      # }
      ... on Story {
        id
        title
        score
        text
        url
        score
        time
        user_info {
          id
          karma
          about
          avatarUrl
        }
        url_meta {
          title
          image
          description
        }
        comments {
          id
          by
          text
          replies {
            id
            by
            text
          }
        }
      }
    }
  }
`;
