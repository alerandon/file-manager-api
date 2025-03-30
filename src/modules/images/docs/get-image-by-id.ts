export const GetImageByIdDocs = {
  apiOperation: { summary: 'Get image by ID' },
  apiParam: { name: 'id', description: 'ID of the image to retrieve' },
  apiResponseStatus200: {
    status: 200,
    description: 'Image retrieved successfully.',
    schema: {
      example: {
        data: {
          id: 12496779,
          width: 2310,
          height: 2717,
          url: 'https://www.pexels.com/photo/a-coffee-cup-and-a-vase-on-a-suitcase-12496779/',
          photographer: 'Nikolaeva Nastia',
          photographer_url: 'https://www.pexels.com/@nikolaeva-nastia-3312562',
          photographer_id: 3312562,
          avg_color: '#262B24',
          src: {
            original:
              'https://images.pexels.com/photos/12496779/pexels-photo-12496779.jpeg',
            large2x:
              'https://images.pexels.com/photos/12496779/pexels-photo-12496779.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
            large:
              'https://images.pexels.com/photos/12496779/pexels-photo-12496779.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
            medium:
              'https://images.pexels.com/photos/12496779/pexels-photo-12496779.jpeg?auto=compress&cs=tinysrgb&h=350',
            small:
              'https://images.pexels.com/photos/12496779/pexels-photo-12496779.jpeg?auto=compress&cs=tinysrgb&h=130',
            portrait:
              'https://images.pexels.com/photos/12496779/pexels-photo-12496779.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1200&w=800',
            landscape:
              'https://images.pexels.com/photos/12496779/pexels-photo-12496779.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200',
            tiny: 'https://images.pexels.com/photos/12496779/pexels-photo-12496779.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280',
          },
          liked: false,
          alt: 'A vintage suitcase topped with a floral vase and tea cup outdoors, embracing rustic charm.',
        },
      },
    },
  },
  apiResponseStatus404: {
    status: 404,
    description: 'Image not found.',
    schema: {
      example: {
        message: 'Image not found',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  },
};
