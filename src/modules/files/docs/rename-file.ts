export const RenameFileDocs = {
  apiOperation: { summary: 'Rename a file' },
  apiParam: { name: 'id', description: 'ID of the file to rename' },
  apiBody: {
    schema: { type: 'object', properties: { newName: { type: 'string' } } },
  },
  apiResponseStatus200: {
    status: 200,
    description: 'File renamed successfully.',
  },
  apiResponseStatus404: {
    status: 404,
    description: 'File not found.',
  },
};
