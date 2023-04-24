import React, { useState, useEffect } from 'react';
import { ShoppingCart } from '../interfaces/CartInterface';
import { useOnClickOutside } from 'usehooks-ts';
import axios from 'axios';
import useSWR, { mutate } from 'swr';
import { v4 as uuidv4 } from 'uuid';


const ManageCarts: React.FC = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const useProductsHook = () => {
    const { data, error } = useSWR('/api/carts', fetcher);

    const isLoading = !data && !error;
    const isError = error;

    const updateProduct = async (selectedProduct: ShoppingCart) => {
      try {
        const response = await axios.put(`/api/carts?cart_id=${selectedProduct.cart_id}`, selectedProduct);
        const updatedProduct = response.data;
        mutate('/api/carts');
        return updatedProduct;
      } catch (error) {
        console.error('Error updating product:', error);
        throw error.response.data;
      }
    };

    const createProduct = async (newProduct) => {
      await fetch('/api/carts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      mutate('/api/carts');
    };

    //NOTE: The await fetch for this one is kind of sus, since its selectedProduct.user_id instead of user_id
    const deleteProduct = async (cart_id) => {
      await fetch(`/api/carts?cart_id=${cart_id}`, {
        method: 'DELETE',
      });

      mutate('/api/carts');
    };

    return {
      products: data,
      isLoading,
      isError,
      updateProduct,
      deleteProduct,
      createProduct,
    };
  };

  const { products, isLoading, isError, createProduct, updateProduct, deleteProduct } = useProductsHook();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ShoppingCart | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<ShoppingCart>>({});
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<ShoppingCart[]>(products);

  const formatDate = (dateString: string): string => {
    if (!dateString) {
      return 'Unspecified Date'; 
    }

    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  };

  const validateProduct = (product: Partial<ShoppingCart>): boolean => {
    
    const requiredFields = ["cart_id", "cust_id", "Product_id", "quantity"];
    for (const field of requiredFields) {
      if (!product[field]) {
        setErrorMessage(`Please fill in the ${field} field.`);
        return false;
      }
    }
    setErrorMessage("");
    return true;
  };


  const falseClick = (product: ShoppingCart) => {
    setSelectedProduct(product);

  };


  const handleEditClick = (product: ShoppingCart) => {
    setShowModal(true);
    setSelectedProduct(product);
  };


  const handleAddSaveClick = async () => {
    if (newProduct && validateProduct(newProduct)) {
      await createProduct(newProduct);
      setShowAddModal(false);
      setNewProduct({});
    }
  };

  const handleSaveClick = async () => {
    if (selectedProduct && validateProduct(selectedProduct)) {

      const updatedProduct = await updateProduct(selectedProduct);
      closeModal();
      setSelectedProduct(updatedProduct);
    }

  };


  const handleDeleteClick = async (cart_id: number, product: ShoppingCart) => {
    setSelectedProduct(product);
    deleteProduct(cart_id);
  };
  
  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };



  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (showAddModal) {
      setNewProduct((prevState) => ({ ...prevState, [name]: value }));
    } else if (selectedProduct) {
      setSelectedProduct((prevState) => {
        if (!prevState) return null;
        return { ...prevState, [name]: value };
      });
    }
  };

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);



return (
  
  <div className="container mx-auto px-4 mb-4">
    
    {isLoading && <div>Loading...</div>}
    {isError && <div>Error loading Carts</div>}
     
  <h1 className="text-2xl font-semibold mb-10"></h1>
    <div className="relative overflow-x-auto shadow-xl rounded">
      <table className="w-full text-sm text-left text-gray-400">
        <caption className="p-5 text-lg font-semibold text-left  text-white bg-cougar-dark-red">
          Manage Carts
            <div className="px-4  -py-4 absolute text-sm right-0.5">
            <button
              className="text-white text-sm px-3 py-1 rounded bg-cougar-teal hover:bg-cougar-dark-teal"
              onClick={handleAddClick}
            >
              + Add New Cart
            </button>
          </div>
          <span className="absolute text-sm right-5">
            ({products?.length ?? 0} {products?.length === 1 ? 'row' : 'rows'})
          </span>
          <div className="mt-1 text-sm font-normal text-white">
            List of Carts with their Cart ID, Customer ID, Product ID, Quantity.
          </div>
        </caption>
        
        <thead className="table-auto w-full text-xs uppercase bg-cougar-red text-gray-200">
          <tr>
            <th scope="col" className="px-4 py-2">Cart ID</th>
            <th scope="col" className="px-4 py-2">Customer ID</th>
            <th scope="col" className="px-4 py-2">Product ID</th>
            <th scope="col" className="px-4 py-2 w-full">Quantity</th>

            <th scope="col" className="px-4 py-2">Update</th> 
            <th scope="col" className="px-4 py-2">Delete</th> 

          </tr>
        </thead>

        <tbody>
        {products && products.map((product: ShoppingCart, index: number) => (
          <tr key={product.cart_id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>

              <td className="text-friendly-black px-4 py-2">{product.cart_id}</td>
              <td className="text-friendly-black px-4 py-2">{product.cust_id}</td>
              <td className="text-friendly-black px-4 py-2">{product.Product_id}</td>
              <td className="text-friendly-black px-4 py-2">{product.quantity}</td>

              <td className="px-4 py-2">
                <button
                  className="bg-cougar-gold text-friendly-black px-3 font-semibold py-1 rounded hover:bg-cougar-gold-dark"
                  onClick={() => handleEditClick(product)}
                >
                  Update
                </button>
              </td>

              <td className="px-4 py-2">
                <button
                  className="bg-cougar-red text-white px-3 py-1 rounded font-semibold hover:bg-cougar-dark-red"
                  onClick={() => {
                    
                  if (selectedProduct) {
                    //sus tostring
                    handleDeleteClick(selectedProduct.cart_id, product);
                  }
                }}
              >
                Delete
            </button>
            </td>
            </tr>
          ))}
          </tbody>
      </table>
    </div>
    
  {showAddModal && (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50"
      onClick={() => setShowAddModal(false)}
    >
      <div
        className="bg-white p-4 rounded my-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className='rounded-b'>
        <div className="flex items-center justify-between bg-friendly-black3 rounded-t p-2">
        <div className="px-4 text-lg font-semibold text-left text-white rounded">
          Add New Cart
        </div>

      </div>
      <div className="mb-3">
        </div>
        
          <div className="flex justify-end">
            <label className="mt-4 mx-4" htmlFor="cart_id">Cart ID:</label>
            <input className="bg-gray-200 border-0 rounded hover:shadow-lg my-2 mx-4" type="number" id="cart_id" name="cart_id" value={newProduct.cart_id || ''} onChange={handleInputChange} />
          </div>
          <div className="flex justify-end">
            <label className="mt-4 mx-4" htmlFor="cust_id">Customer ID:</label>
            <input className="bg-gray-200 border-0 rounded hover:shadow-lg my-2 mx-4" type="text" id="cust_id" name="cust_id" value={newProduct.cust_id || ''} onChange={handleInputChange} />
          </div>
          <div className="flex justify-end">
            <label className="mt-4 mx-4" htmlFor="Product_id">Product ID:</label>
            <input className="bg-gray-200 border-0 rounded hover:shadow-lg my-2 mx-4" type="text" id="Product_id" name="Product_id" value={newProduct.Product_id || ''} onChange={handleInputChange} />
          </div>

          <div className="flex justify-end">
            <label className="mt-4 mx-4" htmlFor="quantity">Quantity:</label>
            <input className="bg-gray-200 border-0 rounded hover:shadow-lg my-2 mx-4" type="text" id="quantity" name="quantity" value={newProduct.quantity || ''} onChange={handleInputChange} />
          </div>
          
        <div className='py-3'></div>
      </div>
        {errorMessage && (
          <div
            className={`bg-cougar-gold text-white px-4 z-0 py-2 rounded font-semibold mb-4 ${errorMessage ? 'flashy-error' : ''}`}
            style={{ zIndex: 1000 }}
          >
        {errorMessage}
        </div>
        )}
      <div className="flex justify-between">
        

        <div className="text-right">
          <button className="rounded hover:bg-cougar-dark-red font-semibold px-4 py-1 mt-3 text-white marker:font-semi-bold bg-cougar-red" onClick={() => setShowAddModal(false)}
          >
            Cancel
          </button>
        </div>
        
        <div className="text-right">
          <button
            className="rounded bg-cougar-teal px-4 py-1 text-white font-semibold mt-3 hover:bg-cougar-dark-teal"
            onClick={handleAddSaveClick}
          >
            Create
          </button>
        </div>

      </div>
      </div>
    </div>
  )}

  {showModal && selectedProduct && (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-50"
      onClick={closeModal}
    >
      <div
        className="bg-white p-4 rounded my-2"
        onClick={(e) => e.stopPropagation()}
      >
        <div className='rounded-b'>
        <div className="flex items-center justify-between bg-friendly-black3 rounded-t p-2">
          <div className="px-4 text-lg font-semibold text-left text-white rounded">
          Edit User
          </div>

        </div>
      <div className="mb-3">
        </div>

        <div className="flex justify-end">
            <label className="mt-4 mx-4" htmlFor="cart_id">Cart ID:</label>
            <input className="bg-gray-200 border-0 rounded hover:shadow-lg my-2 mx-4" type="number" id="cart_id" name="cart_id" value={selectedProduct.cart_id} onChange={handleInputChange} />
          </div>
          <div className="flex justify-end">
            <label className="mt-4 mx-4" htmlFor="cust_id">Customer ID:</label>
            <input className="bg-gray-200 border-0 rounded hover:shadow-lg my-2 mx-4" type="text" id="cust_id" name="cust_id" value={selectedProduct.cust_id} onChange={handleInputChange} />
          </div>
          <div className="flex justify-end">
            <label className="mt-4 mx-4" htmlFor="Product_id">Product ID:</label>
            <input className="bg-gray-200 border-0 rounded hover:shadow-lg my-2 mx-4" type="text" id="Product_id" name="Product_id" value={selectedProduct.Product_id} onChange={handleInputChange} />
          </div>
          <div className="flex justify-end">
            <label className="mt-4 mx-4" htmlFor="quantity">Quantity:</label>
            <input className="bg-gray-200 border-0 rounded hover:shadow-lg my-2 mx-4" type="text" id="quantity" name="quantity" value={selectedProduct.quantity} onChange={handleInputChange} />
          </div>

        
        <div className='py-3'></div>
      </div>
      <div className="flex justify-between">
        

      <div className="text-right">
          <button className="rounded hover:bg-cougar-dark-red font-semibold px-4 py-1 mt-3 text-white marker:font-semi-bold bg-cougar-red" onClick={closeModal}
          >
            Cancel
          </button>
        </div>
        
        <div className="text-right">
          
          <button
            className="rounded bg-cougar-gold px-4 py-1 text-friendly-black3 font-semibold mt-3 hover:bg-cougar-gold-dark"
            onClick={handleSaveClick}
          >
            Update
          </button>
        </div>


      </div>


    </div>
  </div>
  )}
  </div>
);
};

export default ManageCarts;
