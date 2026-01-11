type Props = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ page, pageSize, total, onPageChange }: Props) => {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-end gap-2 mt-4">
      <button
        className="px-3 py-1 border rounded text-sm disabled:opacity-50"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>

      <span className="text-sm px-2 py-1">
        Page {page} of {totalPages}
      </span>

      <button
        className="px-3 py-1 border rounded text-sm disabled:opacity-50"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
