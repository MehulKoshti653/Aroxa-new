import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info with Logo */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/images/logo.jpg"
                alt="Aroxa Crop Science"
                className="h-12 w-auto rounded"
              />
              <div>
                <h3 className="text-lg font-bold" style={{ color: '#7DD50B' }}>
                  AROXA
                </h3>
                <p className="text-xs text-gray-400">Crop Science</p>
              </div>
            </div>
            <p className="text-gray-400 text-sm">
              Leading manufacturer and exporter of Agriculture Insecticides,
              Protective Fungicides, and Bio Products.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-gray-400 hover:text-[#7DD50B] transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/products"
                  className="text-gray-400 hover:text-[#7DD50B] transition-colors"
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-[#7DD50B] transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-[#7DD50B] transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Our Products</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Insecticides</li>
              <li>Fungicides</li>
              <li>Herbicides</li>
              <li>Plant Growth Regulators</li>
              <li>Bio Products</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Ahmedabad, Gujarat</li>
              <li>Phone: +91 8733906121</li>
              <li>Email: info@aroxacropscience.com</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Aroxa Crop Science Private Limited. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
