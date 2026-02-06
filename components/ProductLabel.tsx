'use client';

import { useRef } from 'react';
import { toPng } from 'html-to-image';

interface ProductLabelProps {
  batchNo: string;
  mfg: string;
  exp: string;
  mrp: string;
  unitPrice: string;
  qrCode: string;
  productName: string;
}

export default function ProductLabel({
  batchNo,
  mfg,
  exp,
  mrp,
  unitPrice,
  qrCode,
  productName,
}: ProductLabelProps) {
  const labelRef = useRef<HTMLDivElement>(null);

  const downloadLabel = async () => {
    if (!labelRef.current) return;

    try {
      const dataUrl = await toPng(labelRef.current, {
        quality: 1,
        pixelRatio: 3,
        backgroundColor: '#ffffff',
      });

      const link = document.createElement('a');
      link.download = `${productName.replace(/\s+/g, '-')}-${batchNo}-label.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to download label:', error);
      alert('Failed to download label. Please try again.');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900">
        📄 Product Label
      </h2>

      {/* Label Preview */}
      <div
        ref={labelRef}
        className="border-4 border-gray-800 bg-white p-8 mb-6"
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
                  {batchNo}
                </span>
              </div>

              <div className="flex items-center">
                <span className="text-lg font-bold text-gray-700 w-32">
                  MFG:
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  {mfg}
                </span>
              </div>

              <div className="flex items-center">
                <span className="text-lg font-bold text-gray-700 w-32">
                  EXP:
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  {exp}
                </span>
              </div>

              <div className="flex items-center">
                <span className="text-lg font-bold text-gray-700 w-32">
                  MRP:
                </span>
                <span className="text-2xl font-extrabold text-[#7DD50B]">
                  {mrp}
                </span>
              </div>

              <div className="flex items-center">
                <span className="text-lg font-bold text-gray-700 w-32">
                  Unit Price:
                </span>
                <span className="text-xl font-bold text-gray-900">
                  {unitPrice}
                </span>
              </div>
            </div>
          </div>

          {/* Right Side - QR Code */}
          <div className="flex flex-col items-center justify-center border-l-4 border-gray-300 pl-6">
            <div className="bg-white p-3 border-4 border-gray-800 rounded-lg">
              <img
                src={qrCode}
                alt="QR Code"
                className="w-48 h-48"
              />
            </div>
            <p className="text-sm font-bold text-gray-600 mt-2">
              SCAN ME
            </p>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={downloadLabel}
        className="w-full bg-[#7DD50B] text-white py-3 px-6 rounded-lg font-bold text-lg hover:bg-[#6BC509] transition-colors shadow-md flex items-center justify-center space-x-2"
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
        <span>Download Label (PNG)</span>
      </button>

      <p className="text-sm text-gray-600 mt-4 text-center">
        💡 This label will be downloaded as a high-quality PNG image.
        <br />
        Print and attach to your product packaging.
      </p>
    </div>
  );
}
