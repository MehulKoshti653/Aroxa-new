'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CustomField } from '@/types';
import ProductLabel from '@/components/ProductLabel';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [formData, setFormData] = useState<Record<string, string | number | File | null>>({});
  const [batchNo, setBatchNo] = useState('');
  const [productImage, setProductImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [labelData, setLabelData] = useState<{
    batchNo: string;
    qrCode: string;
    qrData: Record<string, string>;
    productName: string;
    productUrl: string;
  } | null>(null);

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
      await fetchCustomFields();
    } catch (error) {
      router.push('/');
    }
  };

  const fetchCustomFields = async () => {
    try {
      const response = await fetch('/api/custom-fields');
      const data = await response.json();
      setCustomFields(data.fields);

      const initialData: Record<string, any> = {};
      data.fields.forEach((field: CustomField) => {
        initialData[field.field_name] = '';
      });
      setFormData(initialData);
    } catch (error) {
      console.error('Failed to fetch custom fields:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateBatchNumber = (name: string) => {
    const cleanName = name.replace(/[^a-zA-Z]/g, '').toUpperCase();
    const prefix = cleanName.substring(0, 4).padEnd(4, 'X');
    const randomNum = Math.floor(Math.random() * 90) + 10;
    return `${prefix}PB${randomNum}`;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 2MB recommended)
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      if (file.size > maxSize) {
        alert('⚠️ Image Too Large\n\nPlease select an image smaller than 2MB.\n\nCurrent size: ' + (file.size / (1024 * 1024)).toFixed(2) + 'MB');
        e.target.value = ''; // Clear the input
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('⚠️ Invalid File Type\n\nPlease select an image file (JPG, PNG, etc.)');
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setProductImage(base64);
        setImagePreview(base64);
      };
      reader.onerror = () => {
        console.error('Failed to read image file');
        alert('❌ Failed to Read Image\n\nPlease try a different image.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };

      if (name === 'name' && value && !batchNo) {
        setBatchNo(generateBatchNumber(value));
      }

      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Validate required fields
      for (const field of customFields) {
        if (field.is_required && !formData[field.field_name]) {
          alert(`⚠️ Required Field Missing\n\n"${field.field_label}" is required. Please fill it in.`);
          setSubmitting(false);
          return;
        }
      }

      // Validate batch number
      if (!batchNo) {
        alert('⚠️ Required Field Missing\n\nBatch Number is required.');
        setSubmitting(false);
        return;
      }

      // Validate product image
      if (!productImage) {
        alert('⚠️ Required Field Missing\n\nProduct Image is required.');
        setSubmitting(false);
        return;
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          batch_no: batchNo,
          product_image: productImage,
          custom_data: formData,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Set label data for download
        setLabelData({
          batchNo: data.batchNo,
          qrCode: data.qrCode,
          qrData: data.qrData,
          productName: String(formData.name || ''),
          productUrl: data.productUrl,
        });

        alert('✅ Product Added Successfully!\n\nYour product has been created. You can now download the label below.');
      } else {
        const error = await response.json();
        console.error('Backend Error:', error);

        // User-friendly error messages
        let errorMessage = '❌ Failed to Add Product\n\n';

        if (error.code === 'ER_NET_PACKET_TOO_LARGE') {
          errorMessage += 'The product image is too large.\n\nPlease:\n1. Use a smaller image (max 2MB recommended)\n2. Or increase MySQL max_allowed_packet setting';
        } else if (error.code === 'ER_DUP_ENTRY') {
          errorMessage += 'This batch number already exists.\n\nPlease use a different batch number.';
        } else if (error.details) {
          errorMessage += error.details;
        } else {
          errorMessage += error.error || 'Unknown error occurred';
        }

        alert(errorMessage);
      }
    } catch (error: unknown) {
      console.error('Frontend Error:', error);
      alert('❌ Network Error\n\nFailed to connect to server. Please check:\n1. Server is running\n2. Internet connection\n3. Browser console for details');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    const resetData: Record<string, string | number> = {};
    customFields.forEach((field) => {
      resetData[field.field_name] = '';
    });
    setFormData(resetData);
    setBatchNo('');
    setProductImage('');
    setImagePreview('');
    setLabelData(null);
  };

  const renderField = (field: CustomField, index: number) => {
    const fieldElement = renderFieldInput(field);

    if (index === 2) {
      return (
        <div key={`field-group-${field.id}`}>
          <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-200 mb-6">
            <label className="block text-gray-800 font-semibold mb-2">
              Batch Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={batchNo}
              onChange={(e) => setBatchNo(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7DD50B] focus:border-transparent text-gray-900 placeholder-gray-500"
              required
              placeholder="Auto-generated (e.g., ABPB10)"
            />
            <p className="text-sm text-gray-700 mt-2">
              ✓ Auto-generated from product name, but you can modify it
            </p>
          </div>
          {fieldElement}
        </div>
      );
    }

    return fieldElement;
  };

  const renderFieldInput = (field: CustomField) => {
    // Smart placeholder generation
    const generatePlaceholder = () => {
      if (field.placeholder) return field.placeholder;

      const fieldName = field.field_name.toLowerCase();
      const fieldLabel = field.field_label;

      // Custom placeholders based on field type
      if (fieldName.includes('name')) return `e.g., ${fieldLabel}`;
      if (fieldName.includes('price')) return 'e.g., 299';
      if (fieldName.includes('date')) return 'Select date';
      if (fieldName.includes('email')) return 'example@email.com';
      if (fieldName.includes('phone')) return 'e.g., 9876543210';
      if (fieldName.includes('url') || fieldName.includes('link')) return 'https://example.com';
      if (fieldName.includes('description') || fieldName.includes('recommendation')) {
        return `Enter detailed ${fieldLabel.toLowerCase()}...`;
      }

      return `Enter ${fieldLabel.toLowerCase()}`;
    };

    const fieldValue = formData[field.field_name];
    const stringValue = fieldValue instanceof File ? '' : String(fieldValue || '');

    const commonProps = {
      name: field.field_name,
      value: stringValue,
      onChange: handleChange,
      required: field.is_required,
      placeholder: generatePlaceholder(),
      className: 'w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7DD50B] focus:border-transparent text-gray-900 placeholder-gray-400',
    };

    let inputElement;
    switch (field.field_type) {
      case 'textarea':
        inputElement = <textarea {...commonProps} rows={4} maxLength={field.max_length || undefined} />;
        break;
      case 'number':
        inputElement = <input type="number" {...commonProps} step="0.01" />;
        break;
      case 'date':
        inputElement = <input type="date" {...commonProps} />;
        break;
      case 'url':
        inputElement = <input type="url" {...commonProps} maxLength={field.max_length || undefined} />;
        break;
      case 'email':
        inputElement = <input type="email" {...commonProps} maxLength={field.max_length || undefined} />;
        break;
      default:
        inputElement = <input type="text" {...commonProps} maxLength={field.max_length || undefined} />;
    }

    return (
      <div key={field.id}>
        <label className="block text-gray-800 font-semibold mb-2">
          {field.field_label}
          {field.is_required === true && <span className="text-red-500 ml-1">*</span>}
          {field.max_length && Number(field.max_length) > 0 && (
            <span className="text-sm text-gray-600 ml-2 font-normal">
              (Max {field.max_length} chars)
            </span>
          )}
        </label>
        {inputElement}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-700">Loading form...</div>
      </div>
    );
  }

  if (customFields.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h1 className="text-2xl font-bold mb-4 text-gray-900">No Custom Fields Found</h1>
            <p className="text-gray-600 mb-6">
              Create custom fields first before adding products.
            </p>
            <button
              onClick={() => router.push('/admin/custom-fields')}
              className="bg-[#7DD50B] text-white px-6 py-3 rounded-lg hover:bg-[#6BC509] transition-colors font-semibold"
            >
              Go to Custom Fields
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        <button
          onClick={() => router.push('/admin')}
          className="text-[#7DD50B] hover:text-[#6BC509] font-semibold mb-6 inline-flex items-center"
        >
          ← Back to Dashboard
        </button>

        {/* Form Section - Full Width */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2 text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mb-6">
            Fill in the form below. Fields marked with * are required.
          </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Image Upload */}
              <div className="bg-green-50 p-6 rounded-lg border-2 border-[#7DD50B]">
                <label className="block text-gray-800 font-semibold mb-2">
                  Product Image <span className="text-red-500">*</span>
                </label>
                <p className="text-sm text-gray-600 mb-3">
                  📷 Upload product image (Max size: 2MB, JPG/PNG recommended)
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7DD50B] focus:border-transparent text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#7DD50B] file:text-white hover:file:bg-[#6BC509]"
                />
                {imagePreview && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Preview:</p>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-w-xs rounded-lg border-2 border-gray-300"
                    />
                  </div>
                )}
              </div>

              {/* Dynamic Custom Fields */}
              {customFields.map((field, index) => renderField(field, index))}

              {/* Submit Buttons */}
              <div className="flex space-x-4 pt-6 border-t-2 border-gray-200">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#7DD50B] text-white py-3 rounded-lg font-bold text-lg hover:bg-[#6BC509] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  {submitting ? 'Adding Product...' : '✓ Add Product'}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/admin')}
                  className="px-8 py-3 border-2 border-gray-400 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
        </div>

        {/* Label Preview Section - Bottom */}
        {labelData && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6 bg-green-50 border-2 border-[#7DD50B] rounded-lg p-6 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                ✅ Product Added Successfully!
              </h3>
              <p className="text-gray-700 mb-4">
                📱 Scan QR code to open: <br />
                <a
                  href={labelData.productUrl}
                  target="_blank"
                  className="text-[#7DD50B] hover:underline font-semibold"
                >
                  {labelData.productUrl}
                </a>
              </p>
              <button
                onClick={resetForm}
                className="bg-white text-[#7DD50B] border-2 border-[#7DD50B] px-6 py-3 rounded-lg font-semibold hover:bg-[#7DD50B] hover:text-white transition-colors"
              >
                ➕ Add Another Product
              </button>
            </div>

            <ProductLabel
              batchNo={labelData.batchNo}
              mfg={labelData.qrData.mfg}
              exp={labelData.qrData.exp}
              mrp={labelData.qrData.mrp}
              unitPrice={labelData.qrData.unitPrice}
              qrCode={labelData.qrCode}
              productName={labelData.productName}
            />
          </div>
        )}
      </div>
    </div>
  );
}
