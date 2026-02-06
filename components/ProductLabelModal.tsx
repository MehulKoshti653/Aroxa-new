'use client';

import { useRef, useEffect, useState } from 'react';
import { toPng } from 'html-to-image';
import { Product } from '@/types';

interface ProductLabelModalProps {
  product: Product;
  onClose: () => void;
}

export default function ProductLabelModal({ product, onClose }: ProductLabelModalProps) {
  const labelRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const data = product.custom_data || {};
  const productName = String(data.name || 'Product');

  // Format date helper
  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = String(d.getFullYear()).slice(-2);
    return `${day}/${month}/${year}`;
  };

  const downloadLabel = async () => {
    if (!labelRef.current) return;

    setDownloading(true);
    try {
      const dataUrl = await toPng(labelRef.current, {
        quality: 1,
        pixelRatio: 3,
        backgroundColor: '#ffffff',
      });

      const link = document.createElement('a');
      link.download = `${productName.replace(/\s+/g, '-')}-${product.batch_no}-label.png`;
      link.href = dataUrl;
      link.click();

      alert('✅ Label downloaded successfully!');
    } catch (error) {
      console.error('Failed to download label:', error);
      alert('❌ Failed to download label. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              🏷️ Product Label
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {productName} - Batch: {product.batch_no}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-3xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Label Preview */}
        <div className="p-6">
          <div className="flex justify-center mb-6">
            <div
              ref={labelRef}
              className="border-4 border-gray-800 bg-white p-8"
              style={{ width: '600px', height: '300px' }}
            >
              <div className="flex items-center justify-between h-full">
                {/* Left Side - Product Info */}
                <div className="flex-1 pr-6 flex flex-col justify-center space-y-3">
                  <div className="mb-2">
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">
                      {productName}
                    </h3>
                    <div className="h-1 w-16 bg-[#7DD50B]"></div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-gray-700 w-32">
                        Batch No:
                      </span>
                      <span className="text-xl font-extrabold text-[#7DD50B]">
                        {product.batch_no}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <span className="text-lg font-bold text-gray-700 w-32">
                        MFG:
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        {formatDate(String(data.mfg_date || ""))}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <span className="text-lg font-bold text-gray-700 w-32">
                        EXP:
                      </span>
                      <span className="text-lg font-semibold text-gray-900">
                        {formatDate(String(data.exp_date || ""))}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <span className="text-lg font-bold text-gray-700 w-32">
                        MRP:
                      </span>
                      <span className="text-2xl font-extrabold text-[#7DD50B]">
                        {data.price ? `₹${data.price}` : 'N/A'}
                      </span>
                    </div>

                    <div className="flex items-center">
                      <span className="text-lg font-bold text-gray-700 w-32">
                        Unit Price:
                      </span>
                      <span className="text-xl font-bold text-gray-900">
                        {data.unit_price ? `₹${data.unit_price}` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Side - QR Code */}
                <div className="flex flex-col items-center justify-center border-l-4 border-gray-300 pl-6">
                  <div className="bg-white p-3 border-4 border-gray-800 rounded-lg">
                    {product.qr_code ? (
                      <img
                        src={product.qr_code}
                        alt="QR Code"
                        className="w-48 h-48"
                      />
                    ) : (
                      <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No QR</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm font-bold text-gray-600 mt-2">
                    SCAN ME
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700">
              <strong>💡 Tip:</strong> This label is optimized for printing.
              The QR code will open: <br />
              <code className="bg-white px-2 py-1 rounded text-[#7DD50B] font-mono text-xs">
                {process.env.NEXT_PUBLIC_APP_URL}/products/{product.slug}
              </code>
            </p>
          </div>

          {/* Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={downloadLabel}
              disabled={downloading}
              className="flex-1 bg-[#7DD50B] text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-[#6BC509] transition-colors shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              <span>
                {downloading ? 'Downloading...' : 'Download Label (PNG)'}
              </span>
            </button>

            <button
              onClick={onClose}
              className="px-8 py-3 border-2 border-gray-400 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
