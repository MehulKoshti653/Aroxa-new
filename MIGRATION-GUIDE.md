# 🚀 Aroxa Crop Science - Dynamic Custom Fields Setup Guide

## ✨ **What's New?**

Your website now has a **powerful custom fields system** with proper database migrations!

### **New Features:**
✅ **Database Migrations** - No more manual table creation
✅ **Custom Fields Manager** - Add/Edit/Delete fields dynamically
✅ **Dynamic Product Form** - Form automatically adapts to your fields
✅ **Field Types** - Text, Number, Date, Textarea, URL, Email
✅ **Field Properties** - Required/Optional, Max Length, Placeholders
✅ **13 Default Fields** - Pre-loaded with standard product fields

---

## 📋 **Installation Steps**

### **Step 1: Install Dependencies**

```bash
cd C:\Users\Admin\Desktop\aroxa-cropscience
npm install
```

✅ **No errors!** All dependencies are React 19 compatible.

---

### **Step 2: Run Database Migrations**

This will automatically create all tables:

```bash
npm run migrate
```

**What it creates:**
- ✅ `migrations` table (tracks migrations)
- ✅ `admin_sessions` table (admin authentication)
- ✅ `custom_fields` table (field definitions)
- ✅ `products` table (with JSON custom_data)
- ✅ **13 default fields** pre-loaded!

---

### **Step 3: Start Development Server**

```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## 🔐 **Admin Panel Access**

1. Click **"Login"** in header
2. Enter PIN: **123456**
3. You'll see 2 new options:
   - **Manage Fields** - Add/edit custom fields
   - **Add Product** - Dynamic form based on your fields

---

## 🎯 **How to Use Custom Fields**

### **Manage Fields**

1. Go to **Admin Dashboard**
2. Click **"Manage Fields"**
3. You'll see 13 default fields already created
4. Click **"Add New Field"** to create custom fields

### **Field Properties:**

- **Field Name**: Database column name (e.g., `product_weight`)
- **Field Label**: Display name (e.g., "Product Weight")
- **Field Type**: text, textarea, number, date, url, email
- **Required**: Check if field is mandatory
- **Max Length**: For text fields (e.g., 255)
- **Placeholder**: Help text (e.g., "Enter weight in grams")

### **Example Custom Field:**

```
Field Name: product_weight
Label: Product Weight
Type: number
Required: Yes
Placeholder: Enter weight in grams
```

---

## 📦 **Adding Products**

1. Go to **Admin Dashboard**
2. Click **"Add Product"**
3. Form will show ALL your custom fields
4. Fill in the form
5. Batch number auto-generates (editable)
6. QR code generates automatically
7. Product saved!

---

## 📊 **Database Structure**

### **custom_fields Table**
Stores field definitions:
```
- id
- field_name (unique)
- field_label
- field_type (text, number, date, textarea, url, email)
- is_required (boolean)
- max_length
- placeholder
- field_order
```

### **products Table**
Stores products:
```
- id
- batch_no (unique, auto-generated)
- custom_data (JSON - all field values)
- qr_code (base64 image)
- created_at
- updated_at
```

---

## 🔄 **Default Fields (Pre-loaded)**

When you run migrations, these 13 fields are automatically created:

1. **name** - Product Name (Text, Required)
2. **technical_name** - Technical Name (Text)
3. **pack_size** - Pack Size (Text)
4. **uid_no** - UID Number (Text, Required)
5. **mfg_date** - Manufacturing Date (Date)
6. **exp_date** - Expiry Date (Date, Required)
7. **web_link** - Website Link (URL, Required)
8. **price** - Price/MRP (Number)
9. **unit_price** - Unit per Price (Number)
10. **manufactured_by** - Manufactured By (Text)
11. **marketed_by** - Marketed By (Text)
12. **recommendation** - Recommendation (Textarea)
13. **how_to_use** - How to Use (Textarea)

You can:
- ✅ Edit these fields
- ✅ Delete fields you don't need
- ✅ Add new custom fields
- ✅ Reorder them

---

## 💡 **Use Cases**

### **Example 1: Add Product Category**

```
Field Name: category
Label: Product Category
Type: text
Required: Yes
Max Length: 100
Placeholder: e.g., Insecticide, Fungicide
```

### **Example 2: Add Certifications**

```
Field Name: certifications
Label: Certifications
Type: textarea
Required: No
Placeholder: List all certifications
```

### **Example 3: Add Expiry Alert Days**

```
Field Name: alert_days
Label: Alert Before Expiry (Days)
Type: number
Required: No
Placeholder: e.g., 30
```

---

## 🛠️ **Migration Commands**

### **Run Migrations**
```bash
npm run migrate
```

### **Check Current Database**
Open phpMyAdmin → aroxa_cropscience database

You should see:
- ✅ migrations (4-5 records)
- ✅ admin_sessions
- ✅ custom_fields (13 default fields)
- ✅ products

---

## 📂 **Project Structure (Updated)**

```
aroxa-cropscience/
├── lib/
│   ├── migrations.ts         # Migration system
│   └── db.ts
├── scripts/
│   └── migrate.ts            # Migration runner
├── app/
│   ├── api/
│   │   ├── custom-fields/    # Custom fields API
│   │   │   ├── route.ts
│   │   │   └── [id]/route.ts
│   │   └── products/         # Updated for custom_data
│   │       ├── route.ts
│   │       └── [id]/route.ts
│   └── admin/
│       ├── custom-fields/    # Custom fields manager
│       │   └── page.tsx
│       └── add-product/      # Dynamic product form
│           └── page.tsx
└── types/
    └── index.ts              # Updated types
```

---

## ✅ **Verification Checklist**

After installation, verify:

- □ `npm install` completed without errors
- □ `npm run migrate` created all tables
- □ Database `aroxa_cropscience` has 4 tables
- □ `custom_fields` table has 13 default records
- □ Website opens at localhost:3000
- □ Admin login works (PIN: 123456)
- □ Can access "Manage Fields"
- □ Can see 13 default fields
- □ Can add/edit/delete custom fields
- □ "Add Product" form shows all custom fields
- □ Can add products
- □ Products show on frontend

---

## 🎯 **Key Benefits**

1. **No Manual SQL** - Migrations handle everything
2. **Flexible Fields** - Add any field you need
3. **Type Safety** - Field types enforce correct data
4. **Easy Management** - UI for all field operations
5. **Future-Proof** - Add new fields anytime without code changes

---

## 🆘 **Troubleshooting**

### **Migration Fails**
```bash
# Check if database exists
# Open phpMyAdmin → Check aroxa_cropscience exists

# If tables already exist from before:
# Delete old tables manually in phpMyAdmin
# Then run: npm run migrate
```

### **No Custom Fields Showing**
```bash
# Check if migration ran successfully
# Look for migrations table in database
# Should have 5 records

# If needed, re-run:
npm run migrate
```

### **Form Not Showing Fields**
- Go to Admin → Manage Fields
- Check if fields exist
- If not, migration didn't complete
- Re-run `npm run migrate`

---

## 🚀 **Next Steps**

1. ✅ Run migrations
2. ✅ Login to admin
3. ✅ Check custom fields (should see 13 defaults)
4. ✅ Add/modify fields as needed
5. ✅ Add your first product
6. ✅ View product on frontend

---

## 📞 **Support**

Everything is automated now! Just run:
1. `npm install`
2. `npm run migrate`
3. `npm run dev`

**No manual database setup needed!** 🎉

---

© 2026 Aroxa Crop Science Private Limited
