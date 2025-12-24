import { describe, it, expect, vi } from 'vitest';
import { render, screen, userEvent } from '@/__tests__/utils/test-utils';
import { Pagination, PaginationInfo } from '../pagination';

describe('Pagination Component', () => {
  describe('Rendering', () => {
    it('should render pagination controls', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={vi.fn()}
        />
      );

      expect(screen.getByLabelText('Previous page')).toBeInTheDocument();
      expect(screen.getByLabelText('Next page')).toBeInTheDocument();
    });

    it('should not render when totalPages is 1 or less', () => {
      const { container } = render(
        <Pagination
          currentPage={1}
          totalPages={1}
          onPageChange={vi.fn()}
        />
      );

      expect(container.firstChild).toBeNull();
    });

    it('should show all page numbers when total is small', () => {
      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={vi.fn()}
        />
      );

      expect(screen.getByLabelText('Page 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Page 2')).toBeInTheDocument();
      expect(screen.getByLabelText('Page 3')).toBeInTheDocument();
      expect(screen.getByLabelText('Page 4')).toBeInTheDocument();
      expect(screen.getByLabelText('Page 5')).toBeInTheDocument();
    });

    it('should show ellipsis for large page counts', () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={20}
          onPageChange={vi.fn()}
        />
      );

      const ellipsis = screen.getAllByText('...');
      expect(ellipsis.length).toBeGreaterThan(0);
    });
  });

  describe('Current Page Highlighting', () => {
    it('should highlight current page', () => {
      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={vi.fn()}
        />
      );

      const currentPageButton = screen.getByLabelText('Page 3');
      expect(currentPageButton).toHaveClass('bg-blue-600');
      expect(currentPageButton).toHaveAttribute('aria-current', 'page');
    });
  });

  describe('Navigation', () => {
    it('should call onPageChange when page number clicked', async () => {
      const handlePageChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={handlePageChange}
        />
      );

      await user.click(screen.getByLabelText('Page 3'));

      expect(handlePageChange).toHaveBeenCalledWith(3);
    });

    it('should call onPageChange when Next clicked', async () => {
      const handlePageChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Pagination
          currentPage={2}
          totalPages={5}
          onPageChange={handlePageChange}
        />
      );

      await user.click(screen.getByLabelText('Next page'));

      expect(handlePageChange).toHaveBeenCalledWith(3);
    });

    it('should call onPageChange when Previous clicked', async () => {
      const handlePageChange = vi.fn();
      const user = userEvent.setup();

      render(
        <Pagination
          currentPage={3}
          totalPages={5}
          onPageChange={handlePageChange}
        />
      );

      await user.click(screen.getByLabelText('Previous page'));

      expect(handlePageChange).toHaveBeenCalledWith(2);
    });

    it('should disable Previous on first page', () => {
      render(
        <Pagination
          currentPage={1}
          totalPages={5}
          onPageChange={vi.fn()}
        />
      );

      expect(screen.getByLabelText('Previous page')).toBeDisabled();
    });

    it('should disable Next on last page', () => {
      render(
        <Pagination
          currentPage={5}
          totalPages={5}
          onPageChange={vi.fn()}
        />
      );

      expect(screen.getByLabelText('Next page')).toBeDisabled();
    });
  });
});

describe('PaginationInfo Component', () => {
  it('should display correct range information', () => {
    render(
      <PaginationInfo
        currentPage={1}
        pageSize={10}
        totalCount={50}
      />
    );

    expect(screen.getByText(/Showing/)).toHaveTextContent('Showing 1 to 10 of 50 results');
  });

  it('should handle last page correctly', () => {
    render(
      <PaginationInfo
        currentPage={5}
        pageSize={10}
        totalCount={47}
      />
    );

    expect(screen.getByText(/Showing/)).toHaveTextContent('Showing 41 to 47 of 47 results');
  });

  it('should handle single item', () => {
    render(
      <PaginationInfo
        currentPage={1}
        pageSize={10}
        totalCount={1}
      />
    );

    expect(screen.getByText(/Showing/)).toHaveTextContent('Showing 1 to 1 of 1 results');
  });
});
