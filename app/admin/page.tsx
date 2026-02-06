'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/types';
import ProductLabelModal from '@/components/ProductLabelModal';
import { FiEye, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { AiOutlineTag } from 'react-icons/ai';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/verify');
      if (!response.ok) {
        router.push('/');
        return;
      }
      fetchProducts();
    } catch (error) {
      router.push('/');
    }
  };

  const fetchProducts = async (page = 1, search = '') => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(search && { search }),
      });

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      setProducts(data.products);
      setPagination(data.pagination);
      setCurrentPage(page);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts(1, searchQuery);
  };

  const handlePageChange = (newPage: number) => {
    fetchProducts(newPage, searchQuery);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDelete = async (productId: number, productName: string) => {
    const confirmed = confirm(
      `⚠️ Delete Product?\n\nAre you sure you want to delete "${productName}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/products?id=${productId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('✅ Product deleted successfully!');
        fetchProducts(currentPage, searchQuery); // Refresh the list
      } else {
        const error = await response.json();
        console.error('Delete error:', error);
        alert(`❌ Failed to delete product\n\n${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('❌ Failed to delete product\n\nPlease check your connection and try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/inquiries"
              className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors font-semibold"
            >
              📧 Inquiries
            </Link>
            <Link
              href="/admin/custom-fields"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors font-semibold"
            >
              Manage Fields
            </Link>
            <Link
              href="/admin/add-product"
              className="bg-[#7DD50B] text-white px-6 py-2 rounded-lg hover:bg-[#6BC509] transition-colors font-semibold"
            >
              Add Product
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors font-semibold"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#7DD50B]">
            <h3 className="text-gray-500 text-sm mb-2 font-semibold">Total Products</h3>
            <p className="text-3xl font-bold text-[#7DD50B]">{products.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-gray-500 text-sm mb-2 font-semibold">Recent Products</h3>
            <p className="text-3xl font-bold text-blue-500">
              {products.filter(p => {
                const created = new Date(p.created_at);
                const now = new Date();
                const diff = now.getTime() - created.getTime();
                return diff < 7 * 24 * 60 * 60 * 1000;
              }).length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
            <h3 className="text-gray-500 text-sm mb-2 font-semibold">Batch Numbers</h3>
            <p className="text-3xl font-bold text-purple-500">{products.length}</p>
          </div>
        </div>

        {/* Products List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">All Products</h2>
              <div className="text-sm text-gray-600">
                Total: <span className="font-bold text-[#7DD50B]">{pagination.total}</span> products
              </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Search by product name, batch number, or price..."
                className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7DD50B] focus:border-transparent text-gray-900 placeholder-gray-400"
              />
              <button
                type="submit"
                className="bg-[#7DD50B] text-white px-6 py-2 rounded-lg hover:bg-[#6BC509] transition-colors font-semibold"
              >
                Search
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    fetchProducts(1, '');
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
                >
                  Clear
                </button>
              )}
            </form>
          </div>
          <div className="overflow-x-auto">
            {products.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No products yet. Click &quot;Add Product&quot; to create your first product.
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Image
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Batch No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Pack Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {product.product_image ? (
                          <img
                            src={product.product_image}
                            alt={String(product.custom_data?.name || 'Product')}
                            className="w-12 h-12 object-cover rounded border border-gray-300"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-[#7DD50B] rounded flex items-center justify-center text-white font-bold">
                            {String(product.custom_data?.name || 'P').charAt(0)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {String(product.custom_data?.name || 'N/A')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {String(product.custom_data?.technical_name || '')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-900">
                          {product.batch_no}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {product.custom_data?.pack_size || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {product.custom_data?.price ? `₹${product.custom_data.price}` : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(product.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-3 items-center">
                          <Link
                            href={`/products/${product.slug}`}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            target="_blank"
                            title="View Product"
                          >
                            <FiEye size={20} />
                          </Link>
                          <button
                            onClick={() => setSelectedProduct(product)}
                            className="text-[#7DD50B] hover:text-[#6BC509] transition-colors"
                            title="Generate Label"
                          >
                            <AiOutlineTag size={20} />
                          </button>
                          <Link
                            href={`/admin/edit-product/${product.id}`}
                            className="text-orange-600 hover:text-orange-800 transition-colors"
                            title="Edit Product"
                          >
                            <FiEdit2 size={20} />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id, String(product.custom_data?.name || 'this product'))}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Delete Product"
                          >
                            <FiTrash2 size={20} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination Controls */}
          {products.length > 0 && (
            <div className="p-6 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  Showing {((currentPage - 1) * 20) + 1} to {Math.min(currentPage * 20, pagination.total)} of {pagination.total} products
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrev}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Previous
                  </button>

                  <div className="flex items-center gap-2">
                    {[...Array(pagination.totalPages)].map((_, idx) => {
                      const pageNum = idx + 1;
                      // Show first, last, current, and adjacent pages
                      if (
                        pageNum === 1 ||
                        pageNum === pagination.totalPages ||
                        (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                      ) {
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                              currentPage === pageNum
                                ? 'bg-[#7DD50B] text-white'
                                : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      } else if (
                        pageNum === currentPage - 2 ||
                        pageNum === currentPage + 2
                      ) {
                        return <span key={pageNum} className="px-2">...</span>;
                      }
                      return null;
                    })}
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNext}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Label Modal */}
      {selectedProduct && (
        <ProductLabelModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
