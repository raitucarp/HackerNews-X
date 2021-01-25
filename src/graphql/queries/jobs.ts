export const JOBS_QUERY = /* GraphQL */ `
  query {
    jobs: job_stories(offset: 0, limit: 30) {
      # ... on Comment {
      #   text
      # }
      id
      deleted
      type
      by
      time
      dead
      kids
      text
      url
      title
    }
  }
`;
