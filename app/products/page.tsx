'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-xl text-gray-700">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#7DD50B] to-[#6BC509] text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">Our Products</h1>
          <p className="text-xl">
            Comprehensive range of high-quality agricultural protection products
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {products.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
              <p className="text-xl text-gray-600 mb-4">
                No products available yet.
              </p>
              <p className="text-gray-500">
                Please check back later or contact us for more information.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-[#7DD50B] hover:shadow-xl transition-all group"
                >
                  {/* Product Image */}
                  {product.product_image ? (
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src={product.product_image}
                        alt={String(product.custom_data?.name || "Product")}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gradient-to-br from-[#7DD50B] to-[#6BC509] flex items-center justify-center">
                      <span className="text-white text-4xl font-bold">
                        {String(product.custom_data?.name || 'P').charAt(0)}
                      </span>
                    </div>
                  )}

                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-2 text-gray-900 group-hover:text-[#7DD50B] transition-colors">
                      {String(product.custom_data?.name || "Product")}
                    </h3>
                    {product.custom_data?.technical_name && (
                      <p className="text-sm text-gray-500 mb-3">
                        {String(product.custom_data.technical_name)}
                      </p>
                    )}
                    {product.custom_data?.pack_size && (
                      <p className="text-sm text-gray-700 mb-3">
                        📦 {product.custom_data.pack_size}
                      </p>
                    )}
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">Batch: {product.batch_no}</p>
                      {product.custom_data?.price && (
                        <p className="text-xl font-bold text-[#7DD50B]">
                          ₹{product.custom_data.price}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
