import {
  listOfFiles,
  Paginator,
  UploadcareSimpleAuthSchema,
} from '@uploadcare/rest-client';

export default defineEventHandler(async (event) => {
  const { page = '0' } = getQuery<{ page: string }>(event);

  const LIMIT = 3;

  const uploadcareSimpleAuthSchema = new UploadcareSimpleAuthSchema({
    publicKey: 'ada58ca1bcd6b5d856ef',
    secretKey: 'c10e2d4a05c847b7483f',
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
    results: currentPage.results.map((file) => file.url),
  };
});
