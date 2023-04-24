import React, { useState, useEffect } from 'react';
import { Notifications } from '../interfaces/NotifcationInterface';
import { useOnClickOutside } from 'usehooks-ts';
import axios from 'axios';
import useSWR, { mutate } from 'swr';


const Notifcations: React.FC = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const useProductsHook = () => {
    const { data, error } = useSWR('/api/notifcations', fetcher);

    const isLoading = !data && !error;
    const isError = error;

    const updateProduct = async (selectedProduct: Notifications) => {
      try {
        const response = await axios.put(`/api/notifcations?MessageId=${selectedProduct.MessageId}`, selectedProduct);
        const updatedProduct = response.data;
        mutate('/api/notifcations');
        return updatedProduct;
      } catch (error) {
        console.error('Error updating product:', error);
        throw error.response.data;
      }
    };

    const createProduct = async (newProduct) => {
      await fetch('/api/notifcations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      mutate('/api/notifcations');
    };

    const deleteProduct = async (MessageId) => {
      await fetch(`/api/notifcations?MessageId=${MessageId}`, {
        method: 'DELETE',
      });

      mutate('/api/notifcations');
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
  const [selectedProduct, setSelectedProduct] = useState<Notifications | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Notifications>>({});
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Notifications[]>(products);

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


  const validateProduct = (product: Partial<Notifications>): boolean => {
    const requiredFields = ["ProductID", "p_name", "Inv_quantity", "prod_type", "date_add", "supp", "cost"];
    for (const field of requiredFields) {
      if (!product[field]) {
        setErrorMessage(`Please fill in the ${field} field.`);
        return false;
      }
    }
    setErrorMessage("");
    return true;
  };


  const falseClick = (product: Notifications) => {
    setSelectedProduct(product);

  };


  const handleEditClick = (product: Notifications) => {
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
      console.log("Selected product before updating:", selectedProduct);
      const updatedProduct = await updateProduct(selectedProduct);
      closeModal();
      setSelectedProduct(updatedProduct);
    }
  };

  const handleDeleteClick = async (ProductID: string, product: Notifications) => {
    console.log("delete test");
    setSelectedProduct(product);
    deleteProduct(ProductID);
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
    } else if (showModal && selectedProduct) {
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
    {isError && <div>Error loading products</div>}
     
  <h1 className="text-2xl font-semibold mb-10"></h1>
    <div className="relative overflow-x-auto shadow-xl rounded">
      <table className="w-full text-sm text-left text-gray-400">
        <caption className="p-5 text-lg font-semibold text-left  text-white bg-friendly-black">
            System Notifcations
          <span className="absolute text-sm right-5">
            ({products?.length ?? 0} {products?.length === 1 ? 'row' : 'rows'})
          </span>
          <div className="mt-1 text-sm font-normal text-white">
            List of System Notifications with their Message ID, Product ID, Message Text, Time Steamp, and Local Accounts.
          </div>
        </caption>
        
        <thead className="table-auto w-full text-xs uppercase bg-friendly-black4 text-gray-200">
          <tr>
            <th scope="col" className="px-4 py-2">Message ID</th>
            <th scope="col" className="px-4 py-2">Product ID</th>
            <th scope="col" className="px-4 py-2">Message Text</th>

            <th scope="col" className="px-4 py-2">Time Stamp</th>
            <th scope="col" className="px-4 py-2">Visibility</th>
          </tr>
        </thead>
        <tbody>
        {products && products.map((product: Notifications, index: number) => (
          <tr key={product.MessageId} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>

              <td className="text-friendly-black px-4 py-2">{product.MessageId}</td>
              <td className="text-friendly-black px-4 py-2">{product.ProductId}</td>
              <td className="text-friendly-black px-4 py-2">{product.MessageText}</td>
              <td className="text-friendly-black px-4 py-2">{formatDate(product.TIMESTAMP)}</td>
              <td className="text-friendly-black px-4 py-2">
              {product.Loc_acc === 1 ? "Admin" : product.Loc_acc === 2 ? "Customer" : ""}
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
          Add New Product
        </div>

        
      </div>
      <div className="mb-3">
        </div>
        
          <div className="flex justify-end">
            <label className="mt-4 mx-4" htmlFor="MessageId">Message ID:</label>
            <input className="bg-gray-200 border-0 rounded hover:shadow-lg my-2 mx-4" type="text" id="MessageId" name="MessageId" value={newProduct.MessageId || ''} onChange={handleInputChange} />
          </div>
          <div className="flex justify-end">
            <label className="mt-4 mx-4" htmlFor="ProductId">Product ID:</label>
            <input className="bg-gray-200 border-0 rounded hover:shadow-lg my-2 mx-4" type="text" id="ProductId" name="ProductId" value={newProduct.ProductId || ''} onChange={handleInputChange} />
          </div>
          <div className="flex justify-end">
            <label className="mt-4 mx-4" htmlFor="MessageText">Message Text:</label>
            <input className="bg-gray-200 border-0 rounded hover:shadow-lg my-2 mx-4" type="text" id="MessageText" name="MessageText" value={newProduct.MessageText || ''} onChange={handleInputChange} />
          </div>
          </div>
          <div className="flex justify-end">
            <label className="mt-4 mx-4" htmlFor="TIMESTAMP">Time Stamp:</label>
            <input className="bg-gray-200 border-0 rounded hover:shadow-lg my-2 mx-4" type="date" id="TIMESTAMP" name="TIMESTAMP" value={newProduct.TIMESTAMP?.substring(0, 10)} onChange={handleInputChange}/>
          <div className="flex justify-end">
            <label className="mt-4 mx-4" htmlFor="Loc_acc">ocal Account:</label>
            <input className="bg-gray-200 border-0 rounded hover:shadow-lg my-2 mx-4" type="number" id="Loc_acc" name="Loc_acc" value={newProduct.Loc_acc || ''} onChange={handleInputChange} />
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
          Edit Product
          </div>



        </div>
        <div className="mb-3">
        </div>

        <div className="flex justify-end">
          <label className="mt-4 mx-4" htmlFor="MessageId">Message ID:</label>
          <input className="bg-gray-200 border-0 rounded hover:shadow-lg my-2 mx-4" type="text" id="MessageId" name="MessageId" defaultValue={selectedProduct.MessageId} onChange={handleInputChange} />
        </div>
        <div className="flex justify-end">
          <label className="mt-4 mx-4" htmlFor="ProductId">Product ID:</label>
          <input className="bg-gray-200 border-0 rounded hover:shadow-lg my-2 mx-4" type="text" id="ProductId" name="ProductId" defaultValue={selectedProduct.ProductId} onChange={handleInputChange} />
        </div>
        <div className="flex justify-end">
          <label className="mt-4 mx-4" htmlFor="MessageText">Message Text:</label>
          <input className="bg-gray-200 border-0 rounded hover:shadow-lg my-2 mx-4" type="text" id="MessageText" name="MessageText" defaultValue={selectedProduct.MessageText} onChange={handleInputChange} />
        </div>
        <div className="flex justify-end">
          <label className="mt-4 mx-4" htmlFor="TIMESTAMP">Time Stamp:</label>
          <input className="bg-gray-200 border-0 rounded hover:shadow-lg my-2 mx-4" type="date" id="TIMESTAMP" name="TIMESTAMP" defaultValue={selectedProduct.TIMESTAMP?.substring(0, 10)} onChange={handleInputChange} />
        </div>
        <div className="flex justify-end">
          <label className="mt-4 mx-4" htmlFor="Loc_acc">Local Account:</label>
          <input className="bg-gray-200 border-0 rounded hover:shadow-lg my-2 mx-4" type="text" id="Loc_acc" name="Loc_acc" defaultValue={selectedProduct.Loc_acc} onChange={handleInputChange} />
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

export default Notifcations;
