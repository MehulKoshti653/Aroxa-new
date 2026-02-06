'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminInquiriesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

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
      fetchInquiries();
    } catch (error) {
      router.push('/');
    }
  };

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/contact');
      const data = await response.json();
      setInquiries(data.inquiries);
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-IN');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-700">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Customer Inquiries</h1>
          <button
            onClick={() => router.push('/admin')}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors font-semibold"
          >
            ← Back
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#7DD50B]">
            <h3 className="text-gray-500 text-sm mb-2 font-semibold">Total Inquiries</h3>
            <p className="text-3xl font-bold text-[#7DD50B]">{inquiries.length}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">All Inquiries</h2>
          </div>
          <div className="overflow-x-auto">
            {inquiries.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No inquiries yet.</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {inquiries.map((inquiry) => (
                    <tr key={inquiry.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(inquiry.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {inquiry.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {inquiry.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {inquiry.phone || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {inquiry.subject || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => setSelectedInquiry(inquiry)}
                          className="text-[#7DD50B] hover:text-[#6BC509] font-semibold"
                        >
                          View Details
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

      {selectedInquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b-2 border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Inquiry Details</h2>
              <button onClick={() => setSelectedInquiry(null)} className="text-gray-500 hover:text-gray-700 text-3xl">×</button>
            </div>
            <div className="p-6 space-y-4">
              <div><strong className="text-gray-900">Name:</strong> {selectedInquiry.name}</div>
              <div><strong className="text-gray-900">Email:</strong> <a href={`mailto:${selectedInquiry.email}`} className="text-[#7DD50B]">{selectedInquiry.email}</a></div>
              {selectedInquiry.phone && <div><strong className="text-gray-900">Phone:</strong> {selectedInquiry.phone}</div>}
              {selectedInquiry.subject && <div><strong className="text-gray-900">Subject:</strong> {selectedInquiry.subject}</div>}
              <div><strong className="text-gray-900">Message:</strong><p className="mt-2 bg-gray-50 p-4 rounded text-gray-900">{selectedInquiry.message}</p></div>
              <div><strong className="text-gray-900">Date:</strong> {formatDate(selectedInquiry.created_at)}</div>
            </div>
            <div className="border-t p-6">
              <button onClick={() => setSelectedInquiry(null)} className="w-full bg-gray-500 text-white py-3 rounded-lg font-semibold hover:bg-gray-600">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
