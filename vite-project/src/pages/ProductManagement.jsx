// import React, { useState } from 'react';
// import { Eye, Edit, Trash2, Plus, Upload, Package } from 'lucide-react';
// import { useAuth } from '../contexts/AuthContext';
// import { useData } from '../contexts/DataContext';
// import Modal from '../components/UI/Modal';

// const ProductManagement = () => {
//   const { user } = useAuth();
//   const { products } = useData();
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [showProductModal, setShowProductModal] = useState(false);
//   const [showAddProduct, setShowAddProduct] = useState(false);

//   const isAdmin = user?.role === 'admin';
//   const displayProducts = isAdmin ? products : products.filter(p => p.assignedStaff === user?.name);

//   const handleViewProduct = (product) => {
//     setSelectedProduct(product);
//     setShowProductModal(true);
//   };

//   const ProductDetailModal = () => (
//     <Modal
//       isOpen={showProductModal}
//       onClose={() => setShowProductModal(false)}
//       title="Product Details"
//       size="lg"
//     >
//       {selectedProduct && (
//         <div className="space-y-6">
//           <div className="flex items-start space-x-6">
//             <img
//               src={selectedProduct.image}
//               alt={selectedProduct.name}
//               className="w-32 h-32 object-cover rounded-lg"
//             />
//             <div className="flex-1">
//               <h3 className="text-xl font-semibold text-gray-900 mb-2">{selectedProduct.name}</h3>
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="text-sm text-gray-500">Category</label>
//                   <p className="font-medium">{selectedProduct.category}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm text-gray-500">Price</label>
//                   <p className="font-medium text-green-600">₹{selectedProduct.price}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm text-gray-500">Stock</label>
//                   <p className="font-medium">{selectedProduct.stock} units</p>
//                 </div>
//                 <div>
//                   <label className="text-sm text-gray-500">Last Tested</label>
//                   <p className="font-medium">{selectedProduct.lastTested}</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-6">
//             <div>
//               <h4 className="font-medium text-gray-900 mb-3">Quality Information</h4>
//               <div className="space-y-3">
//                 <div>
//                   <label className="text-sm text-gray-500">Quality Status</label>
//                   <span className={`block px-2 py-1 rounded-full text-xs font-medium w-fit ₹{
//                     selectedProduct.qualityStatus === 'Approved' 
//                       ? 'bg-green-100 text-green-800' 
//                       : 'bg-yellow-100 text-yellow-800'
//                   }`}>
//                     {selectedProduct.qualityStatus}
//                   </span>
//                 </div>
//                 <div>
//                   <label className="text-sm text-gray-500">Pest Information</label>
//                   <p className="font-medium">{selectedProduct.pestInfo}</p>
//                 </div>
//                 <div>
//                   <label className="text-sm text-gray-500">Assigned Staff</label>
//                   <p className="font-medium">{selectedProduct.assignedStaff}</p>
//                 </div>
//               </div>
//             </div>
            
//             <div>
//               <h4 className="font-medium text-gray-900 mb-3">Test History</h4>
//               <div className="space-y-2">
//                 <div className="p-3 bg-gray-50 rounded-lg">
//                   <p className="text-sm font-medium">Quality Test - Passed</p>
//                   <p className="text-xs text-gray-500">{selectedProduct.lastTested}</p>
//                 </div>
//                 <div className="p-3 bg-gray-50 rounded-lg">
//                   <p className="text-sm font-medium">Pest Inspection - Clear</p>
//                   <p className="text-xs text-gray-500">2024-01-05</p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="flex space-x-3">
//             {isAdmin && (
//               <>
//                 <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
//                   Edit Product
//                 </button>
//                 <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
//                   Assign Staff
//                 </button>
//                 <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
//                   Delete Product
//                 </button>
//               </>
//             )}
//             {!isAdmin && (
//               <>
//                 <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
//                   Update Quality Test
//                 </button>
//                 <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
//                   Add Pest Report
//                 </button>
//                 <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700">
//                   Mark Completed
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </Modal>
//   );

//   const AddProductModal = () => (
//     <Modal
//       isOpen={showAddProduct}
//       onClose={() => setShowAddProduct(false)}
//       title="Add New Product"
//       size="lg"
//     >
//       <form className="space-y-6">
//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Product Name
//             </label>
//             <input
//               type="text"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Category
//             </label>
//             <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
//               <option>Seeds</option>
//               <option>Fertilizer</option>
//               <option>Pesticides</option>
//               <option>Tools</option>
//               <option>Equipment</option>
//             </select>
//           </div>
//         </div>
        
//         <div className="grid grid-cols-3 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Price (₹)
//             </label>
//             <input
//               type="number"
//               step="0.01"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Stock Quantity
//             </label>
//             <input
//               type="number"
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//             />
//           </div>
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Assigned Staff
//             </label>
//             <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
//               <option>Sarah Wilson</option>
//               <option>Mike Johnson</option>
//             </select>
//           </div>
//         </div>
        
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Product Description
//           </label>
//           <textarea
//             rows={3}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-2">
//             Product Image
//           </label>
//           <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//             <Upload className="mx-auto h-12 w-12 text-gray-400" />
//             <div className="mt-4">
//               <button type="button" className="text-blue-600 hover:text-blue-500">
//                 Upload image
//               </button>
//               <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="flex justify-end space-x-3">
//           <button
//             type="button"
//             onClick={() => setShowAddProduct(false)}
//             className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Add Product
//           </button>
//         </div>
//       </form>
//     </Modal>
//   );

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center justify-between">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
//           <p className="text-gray-600 mt-2">
//             {isAdmin ? 'Manage all products and services' : 'Manage your assigned products'}
//           </p>
//         </div>
        
//         {isAdmin && (
//           <button
//             onClick={() => setShowAddProduct(true)}
//             className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//           >
//             <Plus size={16} />
//             <span>Add Product</span>
//           </button>
//         )}
//       </div>

//       {/* Products Grid */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {displayProducts.map((product) => (
//           <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
//             <img
//               src={product.image}
//               alt={product.name}
//               className="w-full h-48 object-cover"
//             />
//             <div className="p-6">
//               <div className="flex items-start justify-between mb-3">
//                 <div>
//                   <h3 className="font-semibold text-gray-900">{product.name}</h3>
//                   <p className="text-sm text-gray-500">{product.category}</p>
//                 </div>
//                 <span className="text-lg font-bold text-green-600">₹{product.price}</span>
//               </div>

//               <div className="space-y-2 mb-4">
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Stock:</span>
//                   <span className="font-medium">{product.stock} units</span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Quality Status:</span>
//                   <span className={`px-2 py-1 rounded-full text-xs font-medium ₹{
//                     product.qualityStatus === 'Approved' 
//                       ? 'bg-green-100 text-green-800' 
//                       : 'bg-yellow-100 text-yellow-800'
//                   }`}>
//                     {product.qualityStatus}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Pest Info:</span>
//                   <span className={`font-medium ₹{
//                     product.pestInfo === 'None detected' ? 'text-green-600' : 'text-yellow-600'
//                   }`}>
//                     {product.pestInfo}
//                   </span>
//                 </div>
//                 <div className="flex justify-between text-sm">
//                   <span className="text-gray-600">Assigned Staff:</span>
//                   <span className="font-medium">{product.assignedStaff}</span>
//                 </div>
//               </div>

//               <div className="flex items-center justify-between">
//                 <button
//                   onClick={() => handleViewProduct(product)}
//                   className="flex items-center space-x-2 text-blue-600 hover:bg-blue-50 px-3 py-2 rounded-lg"
//                 >
//                   <Eye size={16} />
//                   <span>View Details</span>
//                 </button>
//                 <div className="flex space-x-2">
//                   <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
//                     <Edit size={16} />
//                   </button>
//                   {isAdmin && (
//                     <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
//                       <Trash2 size={16} />
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <ProductDetailModal />
//       <AddProductModal />
//     </div>
//   );
// };

// export default ProductManagement;

// src/pages/ProductManagement.jsx
import React, { useState, useEffect } from 'react';
import { Eye, Edit, Plus, Upload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import Modal from '../components/UI/Modal';

const ProductManagement = () => {
  const { user } = useAuth();
  const { products, staff, addProduct, updateProduct, addTestLog, fetchAllData } = useData();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Seeds',
    stock: '',
    price: '',
    assignedStaff: ''
  });

  const isAdmin = user?.role === 'admin';
  const displayProducts = isAdmin ? products : products.filter(p => p.assignedStaff === user?._id);

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('stock', formData.stock);
      formDataToSend.append('price', formData.price);
      if (formData.assignedStaff) {
        formDataToSend.append('assignedStaff', formData.assignedStaff);
      }

      const result = await addProduct(formDataToSend);
      if (result.success) {
        setShowAddProduct(false);
        setFormData({
          name: '',
          category: 'Seeds',
          stock: '',
          price: '',
          assignedStaff: ''
        });
        alert('Product added successfully!');
      } else {
        alert(result.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product');
    }

    setLoading(false);
  };

  const handleAddTestLog = async (productId, testData) => {
    try {
      const result = await addTestLog(productId, testData);
      if (result.success) {
        alert('Test log added successfully!');
        setShowProductModal(false);
      } else {
        alert(result.message || 'Failed to add test log');
      }
    } catch (error) {
      console.error('Error adding test log:', error);
      alert('Error adding test log');
    }
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
            {selectedProduct.images && selectedProduct.images[0] ? (
              <img
                src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${selectedProduct.images[0]}`}
                alt={selectedProduct.name}
                className="w-32 h-32 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/128x128?text=No+Image';
                }}
              />
            ) : (
              <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
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
                  <p className="font-medium">
                    {selectedProduct.lastTested ? 
                      new Date(selectedProduct.lastTested).toLocaleDateString() : 
                      'Never'
                    }
                  </p>
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
                  <span className={`block px-2 py-1 rounded-full text-xs font-medium w-fit ${
                    selectedProduct.qualityStatus === 'Approved' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedProduct.qualityStatus || 'Pending'}
                  </span>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Pest Information</label>
                  <p className="font-medium">{selectedProduct.pestInfo || 'No information'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Assigned Staff</label>
                  <p className="font-medium">
                    {staff.find(s => s._id === selectedProduct.assignedStaff)?.name || 'Unassigned'}
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Test History</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {selectedProduct.testLogs && selectedProduct.testLogs.length > 0 ? (
                  selectedProduct.testLogs.map((log, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium">{log.result}</p>
                      <p className="text-xs text-gray-500">{log.notes}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(log.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No test logs available</p>
                )}
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
              </>
            )}
            {(isAdmin || user?.role === 'staff') && (
              <button 
                onClick={() => {
                  const testData = {
                    result: 'Quality Test Passed',
                    notes: 'Manual test entry from UI'
                  };
                  handleAddTestLog(selectedProduct._id, testData);
                }}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
              >
                Add Test Log
              </button>
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
      <form className="space-y-6" onSubmit={handleAddProduct}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Seeds">Seeds</option>
              <option value="Fertilizer">Fertilizer</option>
              <option value="Pesticides">Pesticides</option>
              <option value="Tools">Tools</option>
              <option value="Equipment">Equipment</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price (₹) *
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Stock Quantity *
            </label>
            <input
              type="number"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assigned Staff
            </label>
            <select 
              value={formData.assignedStaff}
              onChange={(e) => setFormData({...formData, assignedStaff: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Staff</option>
              {staff.map((s) => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
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
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Adding...' : 'Add Product'}
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
          <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {product.images && product.images[0] ? (
              <img
                src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000'}${product.images[0]}`}
                alt={product.name}
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x200?text=No+Image';
                }}
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400">No Image</span>
              </div>
            )}
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
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.qualityStatus === 'Approved' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {product.qualityStatus || 'Pending'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Assigned Staff:</span>
                  <span className="font-medium">
                    {staff.find(s => s._id === product.assignedStaff)?.name || 'Unassigned'}
                  </span>
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
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {displayProducts.length === 0 && (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
          <p className="text-gray-500 mb-4">
            {isAdmin ? 'Get started by adding your first product.' : 'No products have been assigned to you yet.'}
          </p>
          {isAdmin && (
            <button
              onClick={() => setShowAddProduct(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Product
            </button>
          )}
        </div>
      )}

      <ProductDetailModal />
      <AddProductModal />
    </div>
  );
};

export default ProductManagement;