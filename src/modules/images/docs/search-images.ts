export const SearchImagesDocs = {
  apiOperation: { summary: 'Search images' },
  apiQuery: {
    name: 'query',
    description: 'Search query for images',
    required: false,
  },
  apiResponseStatus200: {
    status: 200,
    description: 'Images retrieved successfully.',
    schema: {
      example: {
        data: {
          page: 1,
          per_page: 2,
          photos: [
            {
              id: 5212667,
              width: 3333,
              height: 5000,
              url: 'https://www.pexels.com/photo/a-woman-standing-in-the-classroom-5212667/',
              photographer: 'Max Fischer',
              photographer_url: 'https://www.pexels.com/@max-fischer',
              photographer_id: 3398482,
              avg_color: '#A59086',
              src: {
                original:
                  'https://images.pexels.com/photos/5212667/pexels-photo-5212667.jpeg',
                large2x:
                  'https://images.pexels.com/photos/5212667/pexels-photo-5212667.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                large:
                  'https://images.pexels.com/photos/5212667/pexels-photo-5212667.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
                medium:
                  'https://images.pexels.com/photos/5212667/pexels-photo-5212667.jpeg?auto=compress&cs=tinysrgb&h=350',
                small:
                  'https://images.pexels.com/photos/5212667/pexels-photo-5212667.jpeg?auto=compress&cs=tinysrgb&h=130',
                portrait:
                  'https://images.pexels.com/photos/5212667/pexels-photo-5212667.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
                landscape:
                  'https://images.pexels.com/photos/5212667/pexels-photo-5212667.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
                tiny: 'https://images.pexels.com/photos/5212667/pexels-photo-5212667.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280',
              },
              liked: false,
              alt: 'A teacher interacts with students in a modern classroom setting.',
            },
            {
              id: 301926,
              width: 3022,
              height: 2016,
              url: 'https://www.pexels.com/photo/teach-dice-ornament-on-table-301926/',
              photographer: 'Pixabay',
              photographer_url: 'https://www.pexels.com/@pixabay',
              photographer_id: 2659,
              avg_color: '#90715E',
              src: {
                original:
                  'https://images.pexels.com/photos/301926/pexels-photo-301926.jpeg',
                large2x:
                  'https://images.pexels.com/photos/301926/pexels-photo-301926.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
                large:
                  'https://images.pexels.com/photos/301926/pexels-photo-301926.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
                medium:
                  'https://images.pexels.com/photos/301926/pexels-photo-301926.jpeg?auto=compress&cs=tinysrgb&h=350',
                small:
                  'https://images.pexels.com/photos/301926/pexels-photo-301926.jpeg?auto=compress&cs=tinysrgb&h=130',
                portrait:
                  'https://images.pexels.com/photos/301926/pexels-photo-301926.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
                landscape:
                  'https://images.pexels.com/photos/301926/pexels-photo-301926.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
                tiny: 'https://images.pexels.com/photos/301926/pexels-photo-301926.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280',
              },
              liked: false,
              alt: "Close-up of dice spelling 'TEACH' amidst stacked books on a wooden table.",
            },
          ],
          total_results: 8000,
          next_page:
            'https://api.pexels.com/v1/search?page=2&per_page=2&query=school',
        },
      },
    },
  },
};
