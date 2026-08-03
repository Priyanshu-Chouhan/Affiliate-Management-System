export const parsePagination = (query: Record<string, unknown>) => {
  const page = Math.max(1, parseInt(String(query.page ?? '1'), 10));
  const limit = Math.min(100, Math.max(1, parseInt(String(query.limit ?? '20'), 10)));
  return { skip: (page - 1) * limit, take: limit, page, limit };
};

export const paginatedResponse = <T>(data: T[], total: number, page: number, limit: number) => ({
  data,
  meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
});
