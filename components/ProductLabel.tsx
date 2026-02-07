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

      {/* Label Preview - Same Design as ProductLabelModal */}
      <div
        ref={labelRef}
        className="border-4 border-gray-800 bg-white p-4 mb-6"
        style={{ width: '600px', height: '300px' }}
      >
        <div className="flex items-center justify-between h-full px-6">
          {/* Left Side - Values Only (No Labels) - All 5xl fonts */}
          <div className="flex-1 pr-2 flex flex-col justify-center items-center">
            {/* Batch Number */}
            <div className="text-5xl font-bold text-black">
              {batchNo}
            </div>

            {/* MFG Date */}
            <div className="text-5xl font-bold text-black">
              {mfg}
            </div>

            {/* EXP Date */}
            <div className="text-5xl font-bold text-black">
              {exp}
            </div>

            {/* MRP */}
            <div className="text-5xl font-bold text-black">
              {mrp}
            </div>

            {/* Unit Price */}
            <div className="text-5xl font-bold text-black">
              {unitPrice}
            </div>
          </div>

          {/* Right Side - QR Code */}
          <div className="flex items-center justify-center">
            <div className="bg-white">
              <img
                src={qrCode}
                alt="QR Code"
                className="w-64 h-64"
              />
            </div>
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
