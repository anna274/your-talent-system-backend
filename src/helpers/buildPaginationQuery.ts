export const buildPaginationQuery = ({ page, size }) => {
  if(page && size) {
    const skip = size * (page - 1);
    return {
      skip,
      limit: Number(size),
    }
  }
  return null;
}