/**
 * Metadata pagination yang dikembalikan bersama data.
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Bentuk response standar untuk endpoint yang ter-paginasi.
 */
export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

/**
 * Hitung jumlah record yang di-skip untuk Prisma `skip`.
 */
export function getSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}

/**
 * Bangun objek metadata pagination dari total record.
 */
export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number,
): PaginationMeta {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}
