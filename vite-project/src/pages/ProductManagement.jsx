import React, { useState } from 'react';
import { Eye, Edit, Trash2, Plus, Upload, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Modal from '../components/UI/Modal';

const ProductManagement = () => {
  const { user } = useAuth();
  const { products } = useData();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);

  const isAdmin = user?.role === 'admin';
  const displayProducts = isAdmin ? products : products.filter(p => p.assignedStaff === user?.name);

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const ProductDetailModal = () => (
    <Modal
      isOpen={showProductModal}
      onClose={() => setShowProductModal(false)}
      title="Product Details"
      size="lg"
    >
      {selectedProduct && (
        <div className="space-y-6">
          <div className="flex items-start space-x-6">
            <img
              src={selectedProduct.image}
              alt={selectedProduct.name}
              className="w-32 h-32 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedProduct.name}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-500">Category</label>
                  <p className="font-medium">{selectedProduct.category}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Price</label>
                  <p className="font-medium text-green-600">₹{selectedProduct.price}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Stock</label>
                  <p className="font-medium">{selectedProduct.stock} units</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Last Tested</label>
                  <p className="font-medium">{selectedProduct.lastTested}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Quality Information</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-gray-500">Quality Status</label>
                  <span className={`block px-2 py-1 rounded-full text-xs font-medium w-fit ₹{
                    selectedProduct.qualityStatus === 'Approved' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedProduct.qualityStatus}
                  </span>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Pest Information</label>
                  <p className="font-medium">{selectedProduct.pestInfo}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Assigned Staff</label>
                  <p className="font-medium">{selectedProduct.assignedStaff}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Test History</h4>
              <div className="space-y-2">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Quality Test - Passed</p>
                  <p className="text-xs text-gray-500">{selectedProduct.lastTested}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium">Pest Inspection - Clear</p>
                  <p className="text-xs text-gray-500">2024-01-05</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            {isAdmin && (
              <>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Edit Product
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Assign Staff
                </button>
                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
                  Delete Product
                </button>
              </>
            )}
            {!isAdmin && (
              <>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Update Quality Test
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
                  Add Pest Report
                </button>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
                  Mark Completed
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </Modal>
  );

  const AddProductModal = () => (
    <Modal
      isOpen={showAddProduct}
      onClose={() => setShowAddProduct(false)}
      title="Add New Product"
      size="lg"
    >
      <form className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
              <option>Seeds</option>
              <option>Fertilizer</option>
              <option>Pesticides</option>
              <option>Tools</option>
              <option>Equipment</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (₹)
            </label>
            <input
              type="number"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assigned Staff
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
              <option>Sarah Wilson</option>
              <option>Mike Johnson</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Description
          </label>
          <textarea
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Image
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <button type="button" className="text-blue-600 hover:text-blue-500">
                Upload image
              </button>
              <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => setShowAddProduct(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Product
          </button>
        </div>
      </form>
    </Modal>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-600 mt-2">
            {isAdmin ? 'Manage all products and services' : 'Manage your assigned products'}
          </p>
        </div>
        
        {isAdmin && (
          <button
            onClick={() => setShowAddProduct(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={16} />
            <span>Add Product</span>
          </button>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayProducts.map((product) => (
          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{product.name}</h3>
                  <p className="text-sm text-gray-500">{product.category}</p>
                </div>
                <span className="text-lg font-bold text-green-600">₹{product.price}</span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Stock:</span>
                  <span className="font-medium">{product.stock} units</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Quality Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ₹{
                    product.qualityStatus === 'Approved' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {product.qualityStatus}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Pest Info:</span>
                  <span className={`font-medium ₹{
                    product.pestInfo === 'None detected' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {product.pestInfo}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Assigned Staff:</span>
                  <span className="font-medium">{product.assignedStaff}</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleViewProduct(product)}
                  className="flex items-center space-x-2 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg"
                >
                  <Eye size={16} />
                  <span>View Details</span>
                </button>
                <div className="flex space-x-2">
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                    <Edit size={16} />
                  </button>
                  {isAdmin && (
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ProductDetailModal />
      <AddProductModal />
    </div>
  );
};

export default ProductManagement;