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
        setlistCollection(limit: 100) {
          items {
            sys {
              id
            }
            title
            note
            videoLink
          }
        }
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
