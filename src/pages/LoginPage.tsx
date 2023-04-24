import React, { useState, useEffect } from 'react';
import { Users } from '../interfaces/UsersInterface';
import { useAuth } from "../context/AuthContext";
import { useOnClickOutside } from 'usehooks-ts';
import axios from 'axios';
import useSWR, { mutate } from 'swr';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from "next/image";

const LoginPage: React.FC = () => {

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
  const [successMessage, setsuccessMessage] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Users[]>(products);
  

  //const { login } = useAuth();
  const { user, setUser } = useAuth();

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
    const requiredFields = ["email", "pw"];
    for (const field of requiredFields) {
      if (!product[field]) {
        setErrorMessage(`Please fill in the ${field} field.`);
        return false;
      }
    }
    setErrorMessage("");
    return true;
  };

  const validateSuccess = (product: Partial<Users>): boolean => {
    const requiredFields = ["email", "pw"];
    for (const field of requiredFields) {
      if (product[field]) {
        setsuccessMessage(`Login Successful for ${field}!`);
        return false;
      }
    }
    setsuccessMessage("");
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

  const isLoginValid = (email: string, password: string, users: Users[]): boolean => {
    return users.some(user => user.email === email && user.pw === password);
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

  const redirectToHomePageVisitor = () => {

    router.push('/');
  };

const redirectToHomePageValidUser = async () => {

  if (newProduct && validateProduct(newProduct)) {
    if (!isLoginValid(newProduct.email, newProduct.pw, products)) {
      setErrorMessage("Invalid email or password");
    } else {
      const authenticatedUser = products.find(
        (user) => user.email === newProduct.email && user.pw === newProduct.pw
        
      );
      setUser(authenticatedUser);
      router.push("/");
    }
  }
};



  const redirectToSignupPage = () => {
    router.push('/SignupPage');
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

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);



  return (
    <div className="min-h-screen bg-friendly-grey py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow-xl rounded-2xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-5 ">
              
              
              <div className="block font-semibold text-xl text-gray-700">

              <button onClick={redirectToHomePageVisitor} className=" justify-center px-2 -mt-5">
                <div className="font-bold text-md py-2"></div>
                <div className="text-sm">
                  {/* Replace with the 'your-image-url' with the actual image URL */}
                  <Image
                  className="max-w-[270px] max-h-[72px] mt-4"
                  src="https://i.postimg.cc/5tSpr6np/cougar-supply-den-full-logo-alpha2222.png"
                  alt=""
                  width={202.5}
                  height={54}
                />
                </div>
              </button>
                  <div className="py-2"></div>
              
                <h2 className="leading-relaxed">User Login</h2>
              </div>
            </div>
              {errorMessage && (
                <div
                  className={`bg-cougar-gold text-white px-4 z-0 py-2 rounded text-sm font-semibold ${errorMessage ? 'flashy-error' : ''}`}
                  style={{ zIndex: 1000 }}
                >
              {errorMessage}
                </div>
              )}

              {successMessage && (
                <div
                  className={`bg-cougar-gold text-white px-4 z-0 py-2 rounded text-sm font-semibold ${successMessage ? 'flashy-success' : ''}`}
                  style={{ zIndex: 1000 }}
                >
              {successMessage}
                </div>
              )}
            <div>
              <div className="py-8 text-base leading-6  text-gray-700 sm:text-lg sm:leading-7">
                <ul className="list-disc space-y-2">



                    {/*temp Email Address  to test null*/}
                    <li className="flex items-start">
                    <span className="mt-1 flex items-center text-sm">
                    Email Address 
                    </span>
                  </li>
                  <div className="relative flex max-w-[600px]">
                  <input
                        placeholder="Enter Email Address"
                        type="text"
                        id="email" 
                        name="email" 
                        value={newProduct.email || ''} onChange={handleInputChange} 
                        className="bg-gray-200 rounded hover:shadow-lg px-4 py-1 border-2 focus:outline-none border-transparent focus:border-blue-500" 
                      />
                  </div>

                    {/*temp Password to test null*/}
                   <li className="flex items-start">
                    <span className="mt-1 flex items-center text-sm">
                    Password
                    </span>
                  </li>
                  <div className="relative flex max-w-[600px]">
                    <input
                      placeholder="Enter Password"
                      type="password"
                      id="pw" 
                      name="pw" 
                      value={newProduct.pw || ''}
                      onChange={handleInputChange} 
                      className="bg-gray-200 rounded hover:shadow-lg px-4 py-1 border-2 focus:outline-none border-transparent focus:border-blue-500" 
                  />
                  </div>


                </ul>
                <div className="flex justify-between items-center mt-2 pt-4">

                  <button
                    onClick={redirectToSignupPage}
                    className="bg-cougar-gold text-friendly-black3 text-sm px-3 py-1 rounded-md font-semibold hover:bg-cougar-gold-dark"
                  >
                    Register
                  </button>
                  <button
                    onClick={redirectToHomePageValidUser}
                    className="bg-cougar-teal text-white px-3 text-sm py-1 rounded-md font-semibold hover:bg-cougar-dark-teal"
                  >
                      Login

                  </button>


                </div>
                <div onClick={redirectToHomePageVisitor} className="flex flex-row items-center mt-3 text-sm">
                  <h1>Return to store as a </h1>
                    <Link href="/" className="text-blue-500 ml-1 hover:text-blue-300 font-semibold">
                      Visitor
                    </Link>
                  <h1>.</h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default LoginPage;