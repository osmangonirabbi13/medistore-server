type IOptions = {
  page?: number | string;
  limit?: number | string;
  sortOrder?: "asc" | "desc";
  sortBy?: string;
};

type IOptionsResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy?: string;
  sortOrder: "asc" | "desc";
};

const paginationSortingHelper = (options: IOptions): IOptionsResult => {
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.max(1, Number(options.limit) || 10);
  const skip = (page - 1) * limit;

  const sortBy = options.sortBy || "createdAt";
  const sortOrder: "asc" | "desc" =
    options.sortOrder === "asc" ? "asc" : "desc";

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export default paginationSortingHelper;
