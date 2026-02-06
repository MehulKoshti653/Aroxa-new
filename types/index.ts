export interface CustomField {
  id: number;
  field_name: string;
  field_label: string;
  field_type: 'text' | 'number' | 'date' | 'textarea' | 'url' | 'email';
  is_required: boolean;
  max_length?: number;
  placeholder?: string;
  field_order: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  slug: string;
  batch_no: string;
  product_image?: string;
  custom_data: Record<string, string | number | boolean | null>;
  qr_code?: string;
  created_at: string;
  updated_at: string;
}

export interface ProductFormData {
  [key: string]: string | number | boolean | File | null | undefined;
}
