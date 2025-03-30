export const DownloadFileDocs = {
  apiOperation: { summary: 'Download a file' },
  apiParam: { name: 'key', description: 'Key of the file to download' },
  apiResponseStatus200: {
    status: 200,
    description: 'File downloaded successfully.',
  },
  apiResponseStatus404: {
    status: 404,
    description: 'File not found.',
  },
};
