'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Product } from '@/types';

export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.slug) {
      fetchProduct();
    }
  }, [params.slug]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${params.slug}`);
      const data = await response.json();
      setProduct(data.product);
    } catch (error) {
      console.error('Failed to fetch product:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center bg-gray-50 min-h-screen">
        <div className="text-xl text-gray-700">Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-gray-900">Product Not Found</h1>
        <Link href="/products" className="text-[#7DD50B] hover:underline font-semibold">
          ← Back to Products
        </Link>
      </div>
    );
  }

  const data = product.custom_data || {};

  return (
    <div className="bg-white min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <Link
            href="/products"
            className="text-[#7DD50B] hover:text-[#6BC509] font-semibold inline-flex items-center"
          >
            ← Back to All Products
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Product Image & Info */}
          <div>
            {/* Product Image */}
            {product.product_image ? (
              <div className="mb-8 rounded-xl overflow-hidden shadow-2xl border-4 border-gray-200">
                <img
                  src={product.product_image}
                  alt={String(data.name || 'Product')}
                  className="w-full h-[500px] object-cover"
                />
              </div>
            ) : (
              <div className="mb-8 h-[500px] bg-gradient-to-br from-[#7DD50B] to-[#6BC509] rounded-xl flex items-center justify-center shadow-2xl">
                <span className="text-white text-9xl font-bold">
                  {String(data.name || 'P').charAt(0)}
                </span>
              </div>
            )}

            <div className="mb-8">
              <h1 className="text-5xl font-bold mb-4 text-gray-900">{String(data.name || 'Product')}</h1>
              {data.technical_name && (
                <p className="text-2xl text-gray-600 font-medium">{String(data.technical_name)}</p>
              )}
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-xl shadow-lg border-2 border-gray-200 mb-6">
              <h2 className="text-2xl font-bold mb-6 text-gray-900 flex items-center">
                <span className="mr-3">📋</span> Product Details
              </h2>
              <div className="space-y-4">
                {Object.entries(data).map(([key, value]) => {
                  if (
                    !value ||
                    key === 'recommendation' ||
                    key === 'how_to_use'
                  ) {
                    return null;
                  }

                  const label = key
                    .replace(/_/g, ' ')
                    .replace(/\b\w/g, (l) => l.toUpperCase());

                  let displayValue = value;
                  if (key.includes('date')) {
                    displayValue = new Date(value as string).toLocaleDateString('en-IN');
                  }

                  return (
                    <div key={key} className="flex justify-between items-center bg-white p-4 rounded-lg border border-gray-200">
                      <span className="text-gray-700 font-semibold">{label}:</span>
                      <span className="font-bold text-gray-900">{displayValue}</span>
                    </div>
                  );
                })}

                <div className="flex justify-between items-center bg-green-50 p-4 rounded-lg border-2 border-[#7DD50B]">
                  <span className="text-gray-700 font-semibold">Batch No:</span>
                  <span className="font-bold text-[#7DD50B] text-lg">{product.batch_no}</span>
                </div>
              </div>
            </div>

            {(data.price || data.unit_price) && (
              <div className="p-8 rounded-xl shadow-2xl mb-6" style={{ background: 'linear-gradient(to right, #7DD50B, #6BC509)', color: '#ffffff' }}>
                <h2 className="text-2xl font-bold mb-6 flex items-center" style={{ color: '#ffffff' }}>
                  <span className="mr-3">💰</span> Pricing
                </h2>
                <div className="space-y-4">
                  {data.price && (
                    <div className="flex justify-between items-center p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff' }}>
                      <span className="font-semibold text-lg">MRP:</span>
                      <span className="text-4xl font-bold">
                        ₹{data.price}
                      </span>
                    </div>
                  )}
                  {data.unit_price && (
                    <div className="flex justify-between items-center p-4 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: '#ffffff' }}>
                      <span className="font-semibold text-lg">Unit Price:</span>
                      <span className="text-3xl font-bold">
                        ₹{data.unit_price}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {data.web_link && (
              <a
                href={String(data.web_link)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full text-center bg-[#7DD50B] text-white px-6 py-3 rounded-lg font-bold text-lg hover:bg-[#6BC509] transition-colors shadow-md"
              >
                🔗 Visit Product Website
              </a>
            )}
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">

            {data.recommendation && (
              <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
                  <span className="mr-3">💡</span> Recommendation
                </h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed text-lg">
                  {data.recommendation}
                </p>
              </div>
            )}

            {data.how_to_use && (
              <div className="bg-gradient-to-br from-green-50 to-white border-2 border-[#7DD50B] p-8 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold mb-4 text-gray-900 flex items-center">
                  <span className="mr-3">📖</span> How to Use
                </h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed text-lg">
                  {data.how_to_use}
                </p>
              </div>
            )}

            {/* Contact CTA */}
            <div className="bg-gray-900 text-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-3">Need More Information?</h3>
              <p className="text-gray-300 mb-6">
                Our team is ready to assist you with detailed product information and recommendations.
              </p>
              <a
                href="/contact"
                className="inline-block bg-[#7DD50B] text-white px-8 py-3 rounded-lg font-bold hover:bg-[#6BC509] transition-colors shadow-md"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
