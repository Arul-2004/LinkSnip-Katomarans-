import { useState, useEffect } from 'react';
import { urlAPI } from '../../services/api';
import LinkCard from '../../components/LinkCard';
import SearchBar from '../../components/SearchBar';
import Pagination from '../../components/Pagination';
import EmptyState from '../../components/EmptyState';
import ConfirmDialog from '../../components/ConfirmDialog';
import LoadingSpinner from '../../components/LoadingSpinner';
import { FiLink } from 'react-icons/fi';
import toast from 'react-hot-toast';

const LinksPage = () => {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('-createdAt');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Delete dialog state
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const fetchUrls = async () => {
    setLoading(true);
    try {
      const res = await urlAPI.getAll({
        page: currentPage,
        limit: 10,
        search,
        sort
      });

      if (res.data?.success) {
        setUrls(res.data.data.urls);
        setTotalPages(res.data.data.pagination.pages);
      }
    } catch (err) {
      console.error('Error fetching URLs:', err);
      toast.error('Failed to load links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, [currentPage, search, sort]);

  const handleDeleteTrigger = (id) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    try {
      const res = await urlAPI.delete(deleteId);
      if (res.data?.success) {
        toast.success('Link deleted successfully');
        // Refresh page, go back to page 1 if current page has no links left
        if (urls.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          fetchUrls();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete link');
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
        <div>
          <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800 }}>Links</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
            Manage and view all your shortened links.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
        <SearchBar
          placeholder="Search original URL, short code, title, alias..."
          onSearch={(val) => {
            setSearch(val);
            setCurrentPage(1);
          }}
          value={search}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <label className="form-label" style={{ margin: 0, whiteSpace: 'nowrap' }}>Sort by:</label>
          <select 
            value={sort} 
            onChange={(e) => {
              setSort(e.target.value);
              setCurrentPage(1);
            }} 
            className="form-input"
            style={{ width: '180px', padding: 'var(--space-2) var(--space-3)' }}
          >
            <option value="-createdAt">Newest Created</option>
            <option value="createdAt">Oldest Created</option>
            <option value="-totalClicks">Most Clicked</option>
            <option value="totalClicks">Least Clicked</option>
          </select>
        </div>
      </div>

      {/* Content Container */}
      {loading ? (
        <LoadingSpinner size="lg" />
      ) : urls.length === 0 ? (
        <EmptyState
          title="No links found"
          message={search ? "We couldn't find any links matching your search terms." : "Create your first shortened link now!"}
          actionText={search ? "" : "Create Link"}
          actionLink={search ? "" : "/dashboard/create"}
          icon={<FiLink />}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 'var(--space-4)' }}>
            {urls.map((url) => (
              <LinkCard
                key={url.id || url._id}
                url={url}
                onDelete={handleDeleteTrigger}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Shortened Link"
        message="Are you sure you want to delete this link? All associated click analytics data will be permanently deleted. This action cannot be undone."
        confirmText="Yes, delete link"
      />
    </div>
  );
};

export default LinksPage;
