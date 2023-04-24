import React, { useState, useEffect } from 'react';
import { Users } from '../interfaces/UsersInterface';
import { useOnClickOutside } from 'usehooks-ts';
import axios from 'axios';
import useSWR, { mutate } from 'swr';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/router';

const SignupPage: React.FC = () => {

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
      // Generate user_id based on the user's first and last name
      const userId = generateUserIdFromName();
    
      // Set a default value for userType if it is not provided
      const userType = newProduct.userType || 'Customer';
    
      const newUser = { ...newProduct, user_id: userId, userType: userType };
    
      await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
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

    const generateUserIdFromName = () => {
      // Generate a random number within a range (for example, between 10000 and 99999)
      const generateRandomNumber = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };
    
      // Check if there's already a user with the same user_id, if so, generate a new one
      let userId = generateRandomNumber(10000, 99999).toString();
      while (products.some((product) => product.user_id === userId)) {
        userId = generateRandomNumber(10000, 99999).toString();
      }
    
      return userId;
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
    if (selectedProduct && validateProduct(selectedProduct)) {
      const updatedProduct = await updateProduct(selectedProduct);
      closeModal();
      setSelectedProduct(updatedProduct);
    }

  };


  
  const router = useRouter();

  const redirectToSignupSuccessPage = async () => {

    if (newProduct && validateProduct(newProduct)) {
      await createProduct(newProduct);
      setShowAddModal(false);
      setNewProduct({});
      router.push('/LoginPage');
    }
  };

  const redirectToHomePage = () => {

    router.push('/');
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



  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

      setNewProduct((prevState) => ({ ...prevState, [name]: value }));
    if (selectedProduct) {
      setSelectedProduct((prevState) => {
        if (!prevState) return null;
        return { ...prevState, [name]: value };
      });
    }
  };


  const handleInputChangeConvert = async () => {
    await createProduct(newProduct);
    setNewProduct({});
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
                <h2 className="leading-relaxed">Register An Account</h2>


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
              <div className="py-4 text-base leading-6  text-gray-700 sm:text-lg sm:leading-7">
              </div>
                <ul className="list-disc space-y-2">
                  
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
                      
                      className="bg-gray-200 rounded hover:shadow-lg px-4 py-1  border-2 focus:outline-none border-transparent focus:border-blue-500" 
                      value={newProduct.f_name || ''} onChange={handleInputChange} 
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
                        value={newProduct.l_name || ''} onChange={handleInputChange} 
                        className="bg-gray-200 rounded hover:shadow-lg px-4 py-1 border-2 focus:outline-none border-transparent focus:border-blue-500" 
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
                        value={newProduct.dob?.substring(0, 10)} onChange={handleInputChange}
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
                        value={newProduct.phone_num || ''} onChange={handleInputChange} 
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
                        value={newProduct.email || ''} onChange={handleInputChange} 
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
                        value={newProduct.pw || ''} onChange={handleInputChange} 
                        className="bg-gray-200 rounded hover:shadow-lg px-4 py-1 border-2 focus:outline-none border-transparent focus:border-blue-500" 
                      />
                  </div>

                  <div className="flex justify-between text-sm items-center text-friendly-black3 pt-4">
                  <div className="flex items-center">
                    <span>Back to</span>
                    <button
                      onClick={redirectToHomePage}
                      className="ml-1 text-blue-600 text-sm rounded-md font-semibold hover:text-blue-300"
                    >
                      Store
                    </button>
                  </div>
                  <button
                    onClick={redirectToSignupSuccessPage}
                    className="bg-cougar-teal text-white px-3 text-sm py-1 rounded-md font-semibold hover:bg-cougar-dark-teal"
                  >
                    Sign Up
                  </button>
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

export default SignupPage;