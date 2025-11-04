import React, { useState } from 'react';
import { FileText, Beaker, ClipboardList } from 'lucide-react';
import type { Product } from '../../data/ProductTypes';

interface ProductDetailsProps {
  product: Product;
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description', icon: FileText },
    { id: 'ingredients', label: 'Ingredients', icon: Beaker },
    { id: 'details', label: 'Product Details', icon: ClipboardList }
  ];

  return (
    <div className="bg-transparent rounded-lg p-6 mb-6">
      {/* Tabs Navigation */}
      <div className="flex border-b border-[var(--komorebi-gray)] mb-6">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-[var(--komorebi-yellow)] text-[var(--komorebi-black)]'
                  : 'text-[var(--komorebi-black)]/60 hover:text-[var(--komorebi-black)]'
              }`}
            >
              <IconComponent className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="text-[var(--komorebi-black)]/80 leading-relaxed">
        {activeTab === 'description' && (
          <div className="space-y-4">
            <p>
              Experience the natural goodness of our carefully crafted cosmetic products. Each {product.name} is formulated with premium ingredients to deliver exceptional results while being gentle on your skin.
            </p>
            <div className="bg-[var(--komorebi-yellow)]/10 p-4 rounded-lg">
              <h4 className="font-semibold text-[var(--komorebi-black)] mb-2">Why Choose This Product?</h4>
              <ul className="space-y-1 text-sm">
                <li>✨ Developed with natural ingredients</li>
                <li>🧪 Scientifically tested and approved</li>
                <li>🌿 Eco-friendly and sustainable</li>
                <li>💯 Money-back guarantee</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'ingredients' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-[var(--komorebi-black)] mb-3">Key Active Ingredients</h4>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[var(--komorebi-yellow)] rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Vitamin E (Tocopherol)</p>
                      <p className="text-sm text-[var(--komorebi-black)]/60">Antioxidant protection and skin nourishment</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[var(--komorebi-yellow)] rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Hyaluronic Acid</p>
                      <p className="text-sm text-[var(--komorebi-black)]/60">Deep hydration and moisture retention</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-[var(--komorebi-yellow)] rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Natural Plant Extracts</p>
                      <p className="text-sm text-[var(--komorebi-black)]/60">Gentle botanical compounds for skin health</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-[var(--komorebi-black)] mb-3">Full INCI List</h4>
                <div className="bg-gray-50 p-4 rounded-lg text-sm">
                  <p>Aqua, Glycerin, Caprylic/Capric Triglyceride, Cetyl Alcohol, Stearic Acid, Tocopherol, Sodium Hyaluronate, Phenoxyethanol, Ethylhexylglycerin, Parfum</p>
                </div>
                <p className="text-xs text-[var(--komorebi-black)]/60 mt-2">
                  *Free from parabens, sulfates, and artificial colors
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-[var(--komorebi-black)] mb-3">Product Specifications</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between border-b border-[var(--komorebi-gray)]/20 pb-1">
                    <span>Brand:</span>
                    <span className="font-medium">{product.vendor}</span>
                  </div>
                  <div className="flex justify-between border-b border-[var(--komorebi-gray)]/20 pb-1">
                    <span>Category:</span>
                    <span className="font-medium">Beauty & Personal Care</span>
                  </div>
                  <div className="flex justify-between border-b border-[var(--komorebi-gray)]/20 pb-1">
                    <span>SKU:</span>
                    <span className="font-medium">{product.id.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between border-b border-[var(--komorebi-gray)]/20 pb-1">
                    <span>Price:</span>
                    <span className="font-medium">${product.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-[var(--komorebi-black)] mb-3">Usage Instructions</h4>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-[var(--komorebi-black)]">How to Use:</p>
                    <p>Apply a small amount to clean, dry skin. Gently massage until fully absorbed.</p>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--komorebi-black)]">Frequency:</p>
                    <p>Use daily, morning and evening for best results.</p>
                  </div>
                  <div>
                    <p className="font-medium text-[var(--komorebi-black)]">Storage:</p>
                    <p>Store in a cool, dry place away from direct sunlight.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[var(--komorebi-pink)]/10 p-4 rounded-lg">
              <h5 className="font-semibold text-[var(--komorebi-black)] mb-2">⚠️ Important Information</h5>
              <ul className="text-sm space-y-1 text-[var(--komorebi-black)]/80">
                <li>• For external use only</li>
                <li>• Avoid contact with eyes</li>
                <li>• Discontinue use if irritation occurs</li>
                <li>• Shelf life: 24 months from manufacture date</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
