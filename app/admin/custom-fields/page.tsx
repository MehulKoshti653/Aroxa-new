'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CustomField } from '@/types';

export default function CustomFieldsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState<CustomField[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  const [formData, setFormData] = useState<{
    field_name: string;
    field_label: string;
    field_type: 'text' | 'number' | 'date' | 'textarea' | 'url' | 'email';
    is_required: boolean;
    max_length: string;
    placeholder: string;
  }>({
    field_name: '',
    field_label: '',
    field_type: 'text',
    is_required: false,
    max_length: '',
    placeholder: '',
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
      fetchFields();
    } catch (error) {
      router.push('/');
    }
  };

  const fetchFields = async () => {
    try {
      const response = await fetch('/api/custom-fields');
      const data = await response.json();
      setFields(data.fields);
    } catch (error) {
      console.error('Failed to fetch fields:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingField) {
        // Update existing field
        const response = await fetch(`/api/custom-fields/${editingField.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            field_label: formData.field_label,
            field_type: formData.field_type,
            is_required: formData.is_required,
            max_length: formData.max_length ? parseInt(formData.max_length) : null,
            placeholder: formData.placeholder,
          }),
        });

        if (response.ok) {
          alert('Field updated successfully!');
        } else {
          const error = await response.json();
          alert(`Failed: ${error.error}`);
        }
      } else {
        // Create new field
        const response = await fetch('/api/custom-fields', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            max_length: formData.max_length ? parseInt(formData.max_length) : null,
          }),
        });

        if (response.ok) {
          alert('Field created successfully!');
        } else {
          const error = await response.json();
          alert(`Failed: ${error.error}`);
        }
      }

      setShowModal(false);
      setEditingField(null);
      setFormData({
        field_name: '',
        field_label: '',
        field_type: 'text',
        is_required: false,
        max_length: '',
        placeholder: '',
      });
      fetchFields();
    } catch (error) {
      console.error('Submit error:', error);
      alert('Failed to save field');
    }
  };

  const handleEdit = (field: CustomField) => {
    setEditingField(field);
    setFormData({
      field_name: field.field_name,
      field_label: field.field_label,
      field_type: field.field_type,
      is_required: field.is_required,
      max_length: field.max_length?.toString() || '',
      placeholder: field.placeholder || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this field?')) {
      return;
    }

    try {
      const response = await fetch(`/api/custom-fields/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Field deleted successfully!');
        fetchFields();
      } else {
        alert('Failed to delete field');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete field');
    }
  };

  const openNewFieldModal = () => {
    setEditingField(null);
    setFormData({
      field_name: '',
      field_label: '',
      field_type: 'text',
      is_required: false,
      max_length: '',
      placeholder: '',
    });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Custom Fields Management</h1>
            <p className="text-gray-600 mt-2">
              Manage product fields - add, edit, or delete custom fields
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={openNewFieldModal}
              className="bg-[#7DD50B] text-white px-6 py-2 rounded-lg hover:bg-[#6BC509] transition-colors"
            >
              Add New Field
            </button>
            <button
              onClick={() => router.push('/admin')}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Fields List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">All Custom Fields ({fields.length})</h2>
          </div>
          <div className="overflow-x-auto">
            {fields.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No custom fields yet. Click &quot;Add New Field&quot; to create one.
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Field Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Label
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Required
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Max Length
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {fields.map((field) => (
                    <tr key={field.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {field.field_order}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {field.field_name}
                        </code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {field.field_label}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {field.field_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {field.is_required ? (
                          <span className="text-red-600 font-semibold">Required</span>
                        ) : (
                          <span className="text-gray-500">Optional</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {field.max_length || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <button
                          onClick={() => handleEdit(field)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(field.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingField ? 'Edit Field' : 'Add New Field'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Field Name (only for new fields) */}
              {!editingField && (
                <div>
                  <label className="block text-gray-900 font-semibold mb-2">
                    Field Name (Database Column) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.field_name}
                    onChange={(e) =>
                      setFormData({ ...formData, field_name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7DD50B]"
                    placeholder="e.g., product_weight"
                    pattern="[a-z][a-z0-9_]*"
                    title="Must start with lowercase letter, only letters, numbers, and underscores"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Lowercase letters, numbers, and underscores only (e.g., product_weight)
                  </p>
                </div>
              )}

              {/* Field Label */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2">
                  Field Label (Display Name) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.field_label}
                  onChange={(e) =>
                    setFormData({ ...formData, field_label: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7DD50B]"
                  placeholder="e.g., Product Weight"
                  required
                />
              </div>

              {/* Field Type */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2">
                  Field Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.field_type}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      field_type: e.target.value as 'text' | 'number' | 'date' | 'textarea' | 'url' | 'email',
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7DD50B]"
                  required
                >
                  <option value="text">Text (Short)</option>
                  <option value="textarea">Text Area (Long)</option>
                  <option value="number">Number</option>
                  <option value="date">Date</option>
                  <option value="url">URL</option>
                  <option value="email">Email</option>
                </select>
              </div>

              {/* Required */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_required"
                  checked={formData.is_required}
                  onChange={(e) =>
                    setFormData({ ...formData, is_required: e.target.checked })
                  }
                  className="mr-2"
                />
                <label htmlFor="is_required" className="text-gray-900 font-semibold">
                  Required Field
                </label>
              </div>

              {/* Max Length */}
              {(formData.field_type === 'text' || formData.field_type === 'textarea') && (
                <div>
                  <label className="block text-gray-900 font-semibold mb-2">
                    Maximum Length (characters)
                  </label>
                  <input
                    type="number"
                    value={formData.max_length}
                    onChange={(e) =>
                      setFormData({ ...formData, max_length: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7DD50B]"
                    placeholder="e.g., 255"
                    min="1"
                  />
                </div>
              )}

              {/* Placeholder */}
              <div>
                <label className="block text-gray-900 font-semibold mb-2">
                  Placeholder Text
                </label>
                <input
                  type="text"
                  value={formData.placeholder}
                  onChange={(e) =>
                    setFormData({ ...formData, placeholder: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7DD50B]"
                  placeholder="e.g., Enter product weight"
                />
              </div>

              {/* Buttons */}
              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#7DD50B] text-white py-3 rounded-lg font-semibold hover:bg-[#6BC509] transition-colors"
                >
                  {editingField ? 'Update Field' : 'Create Field'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-8 py-3 border-2 border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
