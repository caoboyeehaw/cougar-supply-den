import React, { useState, useEffect } from 'react';
import { Users } from '../interfaces/UsersInterface';
import { useOnClickOutside } from 'usehooks-ts';
import axios from 'axios';
import useSWR, { mutate } from 'swr';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/router';
import { useAuth  } from "../context/AuthContext";


const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [editedProduct, setEditedProduct] = useState<Partial<Users>>({});

  useEffect(() => {
    setSelectedProduct(user);
    setEditedProduct(user);
  }, [user]);

  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const useProductsHook = () => {
    const { data, error } = useSWR('/api/users', fetcher);

    const isLoading = !data && !error;
    const isError = error;

    const updateProduct = async (selectedProduct: Users) => {
      try {
        const response = await axios.put(`/api/users?user_id=${selectedProduct.user_id}`, selectedProduct);
        const updatedProduct = response.data;
        mutate('/api/users');
        return updatedProduct;
      } catch (error) {
        console.error('Error updating product:', error);
        throw error.response.data;
      }
    };

    const createProduct = async (newProduct) => {
      await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      mutate('/api/users');
    };

    //NOTE: The await fetch for this one is kind of sus, since its selectedProduct.user_id instead of user_id
    const deleteProduct = async (user_id) => {
      await fetch(`/api/users?user_id=${user_id}`, {
        method: 'DELETE',
      });

      mutate('/api/users');
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
  const [selectedProduct, setSelectedProduct] = useState<Users | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Users>>({});
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Users[]>(products);

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


  const validateProduct = (product: Partial<Users>): boolean => {

    
    //const requiredFields = ["f_name", "l_name", "dob", "email", "phone_num", "pw", "userType"];
    const requiredFields = ["f_name", "l_name", "dob", "email", "phone_num", "pw"];
    for (const field of requiredFields) {
      if (!product[field]) {
        setErrorMessage(`Please fill in the ${field} field.`);
        return false;
      }
    }
    setErrorMessage("");
    return true;
  };


  const falseClick = (product: Users) => {
    setSelectedProduct(product);

  };


  const handleEditClick = (product: Users) => {
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
    if (editedProduct && validateProduct(editedProduct)) {
      const updatedProduct = await updateProduct({ ...selectedProduct, ...editedProduct });
      closeModal();
      setSelectedProduct(updatedProduct);
  
      user && Object.assign(user, updatedProduct);
  
      // Refresh the page
      window.location.reload();
    }
  };


  const router = useRouter();

  const redirectToSignupSuccessPage = async () => {

    if (newProduct && validateProduct(newProduct)) {
      await createProduct(newProduct);
      setShowAddModal(false);
      setNewProduct({});
      router.push('/');
    }
  };

  const redirectToHomePage = () => {

    router.push('/LoginPage');
  };


  const handleDeleteClick = async (userId: string, product: Users) => {
    setSelectedProduct(product);
    deleteProduct(userId);
  };
  
  const handleAddClick = () => {
    setShowAddModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };


  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];
    if (!file) return;
  
    const formData = new FormData();
    formData.append('file', file);
  
    try {
      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
      const imageUrl = data?.image?.url;
      console.log(imageUrl);
    } catch (error) {
      console.error(error);
    }
  };
  

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    setEditedProduct((prevState) => {
      return { ...prevState, [name]: value };
    });
  
    if (selectedProduct) {
      setSelectedProduct((prevState) => {
        return { ...prevState, [name]: value };
      });
    }
  };

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);




  return (
    <>
  
    <div className="min-h-screen bg-friendly-grey py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow-xl rounded-2xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-5">
              <div className="block font-semibold text-xl text-gray-700">
                <h2 className="leading-relaxed">Edit Account</h2>


              </div>
              </div>
                  {errorMessage && (
                    <div
                      className={`bg-cougar-gold text-white px-4 z-0 py-2 rounded font-semibold mb-4 ${errorMessage ? 'flashy-error' : ''}`}
                      style={{ zIndex: 1000 }}
                    >
                  {errorMessage}
                  </div>
                  )}
              <div className="flex justify-between ">
            </div>
            <div className="divide-y divide-gray-200 ">
              <div className="py-4 text-base leading-6 text-gray-700 sm:text-lg sm:leading-7 ">
              </div>

              <ul className="list-disc flex flex-col md:flex-row">
                <div className="md:w-1/2 md:pr-4">
                  
                  
                  {/*temp  usertype to test null*/}
                  <li className="flex items-start">
                    <span className="mt-1 flex items-center text-sm ">
                    Account Type
                    </span>
                  </li>
                  <div className="relative flex max-w-[600px]">
                  <input
                    placeholder="Account Type Not Changeable"
                    type="text"
                    id="userType"
                    name="userType"
                    value={selectedProduct?.userType || ''}
                    onChange={handleInputChange}
                    className="bg-cougar-yellow rounded px-4 py-1 border-2 focus:outline-none border-transparent focus:border-blue-500"
                    readOnly
                  />
                  </div>


                  <li className="flex items-start">
                  <span className="mt-1 flex items-center text-sm">
                      First Name
                    </span>
                    
                  </li>

                  <div className="relative flex max-w-[600px]">
                    <input
                      placeholder="Enter First Name"
                      type="text"
                      id="f_name" 
                      name="f_name" 
                      
                      className="bg-gray-200 rounded hover:shadow-lg px-4 py-1 border-2 focus:outline-none border-transparent focus:border-blue-500" 
                      value={selectedProduct?.f_name || ''} onChange={handleInputChange}
                    />
                  </div>

                  <li className="flex items-start">
                    <span className="mt-1 flex items-center text-sm">
                      Last Name
                    </span>
                  </li>

                  <div className="relative flex max-w-[600px]">
                    <input
                        placeholder="Enter Last Name"
                        type="text"
                        id="l_name" 
                        name="l_name" 
                        value={selectedProduct?.l_name || ''} 
                        onChange={handleInputChange} 
                        className="bg-gray-200 rounded hover:shadow-lg px-4 py-1 border-2 focus:outline-none w-full border-transparent focus:border-blue-500" 
                      />
                  </div>

                  <li className="flex items-start">
                    <span className="mt-1 flex items-center text-sm">
                      Date Of Birth
                    </span>
                    
                  </li>
                  <div className="relative flex max-w-[600px]">
                    <input
                        placeholder="Enter Date Of Birth"
                        type="date"
                        id="dob" 
                        name="dob" 
                        value={selectedProduct?.dob?.substring(0, 10) || ''} onChange={handleInputChange}
                        className="bg-gray-200 text-gray-500 focus:text-friendly-black3 rounded hover:shadow-lg px-4 w-full py-1 border-2 focus:outline-none border-transparent focus:border-blue-500" 
                      />
                  </div>

                  <li className="flex items-start">
                    <span className="mt-1 flex items-center text-sm">
                      Phone Number
                    </span>
                  </li>

                  <div className="relative flex max-w-[600px]">
                  <input
                        placeholder="Enter Phone Number"
                        type="text"
                        id="phone_num" 
                        name="phone_num" 
                        value={selectedProduct?.phone_num || ''} onChange={handleInputChange} 
                        className="bg-gray-200 rounded hover:shadow-lg px-4 py-1 border-2 focus:outline-none border-transparent focus:border-blue-500" 
                      />
                  </div>

                  </div>
                  <div className="md:w-1/2 md:pl-4">

                  <li className="flex items-start">
                    <span className="mt-1 flex items-center text-sm">
                      Profile Picture
                    </span>
                  </li>

                  <div className="relative flex max-w-[600px]">
                    {/*
                                      <input
                    type="file"
                    id="avatar"
                    name="avatar"
                    accept="image/png"

                    onChange={handleFileChange}
                  />
                    
                    */}
                    <input
                      placeholder="Enter URL"
                      type="text"
                      id="url_link" 
                      name="url_link" 
                      value={selectedProduct?.url_link || ''} onChange={handleInputChange} 
                      className="bg-gray-200 rounded hover:shadow-lg px-4 py-1 border-2 focus:outline-none border-transparent focus:border-blue-500" 
                    />
                  </div>



                  <li className="flex items-start">
                    <span className="mt-1 flex items-center text-sm">
                      Email
                    </span>
                  </li>

                  <div className="relative flex max-w-[600px]">
                  <input
                        placeholder="Enter Email"
                        type="text"
                        id="email" 
                        name="email" 
                        value={selectedProduct?.email || ''} onChange={handleInputChange} 
                        className="bg-gray-200 rounded hover:shadow-lg px-4 py-1 border-2 focus:outline-none border-transparent focus:border-blue-500" 
                      />
                  </div>



                  <li className="flex items-start">
                    <span className="mt-1 flex items-center text-sm">
                     Password
                    </span>
                  </li>
                  <div className="relative flex max-w-[600px]">
                  <input
                        placeholder="Enter Password"
                        type="text"
                        id="pw" 
                        name="pw" 
                        value={selectedProduct?.pw || ''} 
                        onChange={handleInputChange} 
                        className="bg-gray-200 rounded hover:shadow-lg  py-1 border-2 focus:outline-none border-transparent focus:border-blue-500" 
                      />
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
              </ul>
              </div>
            </div>
          </div>
        </div>
        </div>
      </>
  );
};

export default UserProfile;


