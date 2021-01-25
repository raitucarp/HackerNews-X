export const TOP_STORIES = /* GraphQL */ `
  fragment comments on Comment {
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
    replies {
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

  query {
    top_stories(offset: 0, limit: 30) {
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
        descendants
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

        main_comments: comments(offset: 0, limit: 1) {
          ...comments
        }

        side_comments: comments(offset: 3) {
          ...comments
        }
      }
    }
  }
`;
