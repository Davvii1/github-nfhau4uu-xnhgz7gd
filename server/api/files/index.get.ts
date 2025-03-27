import {
  listOfFiles,
  Paginator,
  UploadcareSimpleAuthSchema,
} from '@uploadcare/rest-client';

export default defineEventHandler(async (event) => {
  const { page = '0', limit = '40' } = getQuery<{
    page: string;
    limit: string;
  }>(event);

  const LIMIT = parseInt(limit);

  const uploadcareSimpleAuthSchema = new UploadcareSimpleAuthSchema({
    publicKey: 'a0d86b82269d9922c222',
    secretKey: 'acadc01c98a7bc3d3217',
  });

  const paginator = new Paginator(
    listOfFiles,
    {
      limit: LIMIT,
    },
    { authSchema: uploadcareSimpleAuthSchema }
  );

  let i = 0;
  for (i; i <= parseInt(page); i++) {
    await paginator.next();
  }

  const currentPage = paginator.getCurrentPage();

  if (!currentPage) return {};

  return {
    next: paginator.hasNextPage(),
    prev: paginator.hasPrevPage(),
    total: currentPage.total,
    perPage: currentPage.perPage,
    results: currentPage.results.map((file) => file.originalFileUrl),
  };
});
