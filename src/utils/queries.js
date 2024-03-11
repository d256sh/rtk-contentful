export const tourItemCollectionQuery = `
  {
    tourItemCollection {
      items {
        date
        place 
        city 
        soldOut
        country
        ticketLink
        videoLink
        sys {
          id
        }
      }
    }
  }
`;

export const trackItemCollectionQuery = `
  {
    trackCollection {
      items {
        sys {
          id
        }
        date
        title
        link {
          url
        }
        cover {
          url
        }
      }
    }
  }
`;
