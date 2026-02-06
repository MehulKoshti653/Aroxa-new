'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products?page=1&limit=4');
      const data = await response.json();
      setProducts(data.products);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-[#7DD50B] to-[#6BC509] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">
              Welcome to Aroxa Crop Science Pvt. Ltd.
            </h1>
            <p className="text-xl mb-8">
              Source from our reputed company, impressive quality Organic Pesticides, Insecticides, Herbicides, Fungicides, Weedicides, etc.
            </p>
            <div className="flex space-x-4">
              <Link
                href="/products"
                className="bg-white text-[#7DD50B] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                View Products
              </Link>
              <Link
                href="/about"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-[#7DD50B] transition-colors"
              >
                About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-6">About Us</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              From a very long time, Aroxa Crop Science Pvt. Ltd., is giving surety to clients that in terms of being faithful, serving quality-assured agricultural products and remain customer-focused at all times. Due to quality-production, we have earned name and fame. Our customer-base has increased because of transparent business dealing and quality-focused product development.
            </p>
            <Link
              href="/about"
              className="inline-block bg-[#7DD50B] text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#6BC509] transition-colors shadow-md"
            >
              Read More About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Most Popular Products */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Most Popular Products</h2>
            <p className="text-lg text-gray-600">
              Discover our top-quality agricultural solutions
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="text-xl text-gray-600">Loading products...</div>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No products available yet.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow border-2 border-gray-200 hover:border-[#7DD50B]"
                  >
                    {product.product_image ? (
                      <div className="relative h-64 bg-gray-100">
                        <img
                          src={product.product_image}
                          alt={String(product.custom_data?.name || 'Product')}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="h-64 bg-gradient-to-br from-[#7DD50B] to-[#6BC509] flex items-center justify-center">
                        <span className="text-white text-6xl font-bold">
                          {String(product.custom_data?.name || 'P').charAt(0)}
                        </span>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {product.custom_data?.name || 'Product'}
                      </h3>
                      {product.custom_data?.technical_name && (
                        <p className="text-sm text-gray-600 mb-3">
                          {product.custom_data.technical_name}
                        </p>
                      )}
                      {product.custom_data?.price && (
                        <p className="text-2xl font-bold text-[#7DD50B] mb-4">
                          ₹{product.custom_data.price}
                        </p>
                      )}
                      <Link
                        href={`/products/${product.slug}`}
                        className="block w-full text-center bg-[#7DD50B] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#6BC509] transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <Link
                  href="/products"
                  className="inline-block bg-[#7DD50B] text-white px-12 py-4 rounded-lg font-bold text-lg hover:bg-[#6BC509] transition-colors shadow-lg"
                >
                  View All Products →
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-16 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-white mb-12">Why Choose Aroxa?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg border-l-4 border-[#7DD50B] hover:bg-gray-750 transition-colors">
              <div className="w-16 h-16 bg-[#7DD50B] rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Bulk Production</h3>
              <p className="text-gray-300">
                Modern manufacturing techniques help in preparing products in huge quantity with zero compromise in quality.
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-lg shadow-lg border-l-4 border-[#7DD50B] hover:bg-gray-750 transition-colors">
              <div className="w-16 h-16 bg-[#7DD50B] rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Swift Delivery</h3>
              <p className="text-gray-300">
                We have formed alliances with reputed logistics companies to deliver products from near to far places.
              </p>
            </div>

            <div className="bg-gray-800 p-8 rounded-lg shadow-lg border-l-4 border-[#7DD50B] hover:bg-gray-750 transition-colors">
              <div className="w-16 h-16 bg-[#7DD50B] rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3 text-white">Quality Packaging</h3>
              <p className="text-gray-300">
                Safe delivery with quality-marked packaging materials, sealed packed with all crucial information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-[#7DD50B] to-[#6BC509] text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Need Help Choosing the Right Product?
          </h2>
          <p className="text-xl mb-8">
            Our team of experts is here to assist you with product selection and recommendations.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-white text-[#7DD50B] px-12 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Contact Us Today
          </Link>
        </div>
      </section>
    </div>
  );
}
