import { useState } from 'react';

export const usePagination = (initial = 1) => {
  const [page, setPage] = useState(initial);
  const next = () => setPage((p) => p + 1);
  const prev = () => setPage((p) => Math.max(1, p - 1));
  const reset = () => setPage(1);
  return { page, setPage, next, prev, reset };
};
