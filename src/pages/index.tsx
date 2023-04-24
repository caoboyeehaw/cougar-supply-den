import { NextPage } from "next";

import React, { useEffect, useState } from "react";

import Image from 'next/image';
import { useOnClickOutside } from 'usehooks-ts';

import axios from 'axios';
import useSWR, { mutate } from 'swr';

import { ShoppingCart } from '../interfaces/CartInterface';
import { Product } from '../interfaces/ProductInterface';
import { Users } from '../interfaces/UsersInterface';

import { useAuth } from "../context/AuthContext";
import router from "next/router";


const fetcher = (url: string) => fetch(url).then((res) => res.json());

const IndexPage: NextPage = () => {
  const auth = useAuth(); 

  const useProductsHookProducts = () => {
    const { data, error } = useSWR('/api/products', fetcher);

    const isLoading = !data && !error;
    const isError = error;

    const updateProduct = async (selectedProduct: Product) => {
      try {
        const response = await axios.put(`/api/products?ProductID=${selectedProduct.ProductID}`, selectedProduct);
        const updatedProduct = response.data;
        mutate('/api/products');
        return updatedProduct;
      } catch (error) {
        console.error('Error updating product:', error);
        throw error.response.data;
      }
    };

    const createProduct = async (newProduct) => {
      await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProduct),
      });

      mutate('/api/products');
    };

    const deleteProduct = async (productId) => {
      await fetch(`/api/products?productId=${productId}`, {
        method: 'DELETE',
      });

      mutate('/api/products');
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

  const useProductsHookCarts = () => {
    const { data, error } = useSWR('/api/carts', fetcher);

    const isLoading2 = !data && !error;
    const isError2 = error;

    const updateCart = async (selectedCart: ShoppingCart) => {
      try {
        const response = await axios.put(`/api/carts?cart_id=${selectedCart.cart_id}`, selectedCart);
        const updatedCart = response.data;
        console.log("Cart updated:", updatedCart);
        mutate('/api/carts', (carts) => {
          return carts.map((cart) => (cart.cart_id === selectedCart.cart_id ? updatedCart : cart));
        }, false);
        return updatedCart;
      } catch (error) {
        console.error('Error updating cart:', error);
        throw error.response.data;
      }
    };
    
    const createCart = async (newCart) => {
      try {
        const response = await axios.post('/api/carts', newCart);
        const createdCart = response.data;
        console.log("Cart created:", createdCart);
        mutate('/api/carts', (carts) => {
          return [...carts, createdCart];
        }, false);
      } catch (error) {
        console.error('Error creating cart:', error);
        throw error.response.data;
      }
    
    
      console.log("Cart created:", newCart);
      await mutate('/api/carts', async (carts) => {
        return [...carts, newCart];
      }, false);
    };

    const deleteCart = async (cart_id) => {
      await fetch(`/api/carts?cart_id=${cart_id}`, {
        method: 'DELETE',
      });

      mutate('/api/carts');
    };

    return {
      carts: data,
      isLoading2,
      isError2,
      updateCart,
      createCart,
      deleteCart,
    };
  };

  const useProductsHookUsers = () => {
    const { data, error } = useSWR('/api/users', fetcher);

    const isLoading3 = !data && !error;
    const isError3 = error;

    const updateUser = async (selectedProduct: Users) => {
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

    const createUser = async (newUser) => {
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
    const deleteUser = async (user_id) => {
      await fetch(`/api/users?user_id=${user_id}`, {
        method: 'DELETE',
      });

      mutate('/api/users');
    };

    return {
      users: data,
      isLoading3,
      isError3,
      updateUser,
      deleteUser,
      createUser,
    };
  };




  const { products, isLoading, isError, createProduct, updateProduct, deleteProduct } = useProductsHookProducts();
  const { carts, isLoading2, isError2, updateCart, createCart, deleteCart } = useProductsHookCarts();
  const { users, isLoading3, isError3, updateUser, createUser, deleteUser } = useProductsHookUsers();

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCart, setSelectedCart] = useState<Product | null>(null);

  const [activeProduct, setActiveProduct] = useState<number | null>(null);
  const [activeCart, setActiveCart] = useState<number | null>(null);
  
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const [newCart, setNewCart] = useState<Partial<ShoppingCart>>({});

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  //const [filteredCarts, setFilteredCarts] = useState<ShoppingCart[]>(carts);

  const [errorMessage, setErrorMessage] = useState<string>("");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showModal, setShowModal] = useState(false);


  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading products.</p>;

  if (isLoading2) return <p>Loading...</p>;
  if (isError2) return <p>Error loading carts.</p>;

  if (isLoading3) return <p>Loading...</p>;
  if (isError3) return <p>Error loading users.</p>;


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




  const falseClickProduct = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleEditClickProduct = (product: Product) => {
    setShowModal(true);
    setSelectedProduct(product);
  };


  //creater  of product
  const handleAddSaveClickProduct = async () => {
    if (newProduct) {
      await createProduct(newProduct);
      setShowAddModal(false);
      setNewProduct({});
    }
  };

  const handleSaveClickProduct= async () => {
    if (selectedProduct) {

      const updatedProduct = await updateProduct(selectedProduct);
      closeModalProduct();
      setSelectedProduct(updatedProduct);
    }
  };

  const handleDeleteClickProduct = async (ProductID: string, product: Product) => {
    setSelectedProduct(product);
    deleteProduct(ProductID);
  };

  const handleAddClickProduct = () => {
    setShowAddModal(true);
  };

  const closeModalProduct = () => {
    setShowModal(false);
  };


  const falseClickCart = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleEditClickCart = (product: Product) => {
    setShowModal(true);
    setSelectedProduct(product);
  };

  const handleAddSaveClick = async () => {
    if (newProduct) {
      await createProduct(newProduct);
      setShowAddModal(false);
      setNewProduct({});
    }
  };

  const handleSaveClickCart = async () => {
    if (selectedProduct) {
      const updatedProduct = await updateProduct(selectedProduct);
      closeModalCart();
      setSelectedProduct(updatedProduct);
    }
  };

  const handleDeleteClickCart = async (ProductID: string, product: Product) => {
    setSelectedProduct(product);
    deleteProduct(ProductID);
  };

  const handleAddClickCart = () => {
    setShowAddModal(true);
  };

  const closeModalCart = () => {
    setShowModal(false);
  };


  const generateCartID = (cust_id: string, Product_id: string) => {
    const input = cust_id + Product_id;
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; 
    }
    return Math.abs(hash);
  };

  const handleAddToCart = async (product: Product) => {
    if (!auth.user) {
      console.error("User not authenticated");
      router.push('/LoginPage');
      return;
    }

  
    console.log("Product being added to cart:", product);
  
    const existingCart = carts.find(
      (cart) => cart.cust_id === auth.user.user_id && cart.Product_id === product.ProductID
    );
  
    console.log("Existing cart:", existingCart);
  
    if (existingCart) {
      const updatedCart: ShoppingCart = {
        ...existingCart,
        quantity: (existingCart.quantity ?? 0) + 1,
      };
      console.log("Updated cart:", updatedCart);
      await updateCart(updatedCart);
    } else {
      const newCart: ShoppingCart = {
        cart_id: generateCartID(auth.user.user_id, product.ProductID),
        cust_id: auth.user.user_id,
        Product_id: product.ProductID,
        quantity: 1,
      };
      console.log("New cart:", newCart);
      await createCart(newCart);
    }
  
    console.log("Carts after adding product:", carts);
  };

  function formatCurrency(amount: number): string {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    });
    return formatter.format(amount);
  }

  const redirectToCheckout= () => {
    if (!auth.user) {
      console.error("User not authenticated");
      router.push('/LoginPage');
      return;
    }
    router.push('/CheckoutPage');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Featured Products.</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">


        {products.map((product) => (
          <div key={product.ProductID} className="bg-white p-0 rounded outline-hover-white shadow-lg hover:shadow-2xl">
            <Image
              src={`${product.url_link}`}
              alt={product.p_name}
              width={300}
              height={200}
              className="rounded-t"
              layout="fixed"
            />
            <h2 className=" mt-2 text-xl font-bold mx-4">{product.p_name}</h2>

            <p className="divide">
              <hr className="border-gray-300 border-1 mt-1 mb-2  px-4" />
            </p>

            <p className="text-gray-600 mx-4 flex justify-end text-sm "> Product ID: {product.ProductID}</p>
            <p className="text-gray-600 mx-4 flex justify-end text-sm "> Supplier: {product.supp}</p>

            <p className="flex justify-end text-gray-600 mx-4 text-sm mb-3 "> Date Added: {formatDate(product.date_add)}</p>

            <div className="flex justify-start   bg-cougar-yellow">
            <p className="text-gray-600 mx-4 font-semibold pr-4">Stock: {product.Inv_quantity}</p>
              <p className="text-gray-600 text-md font-semibold">Price:</p>
              <p className="text-gray-600 mx-2 mr-4 text-lg font-bold">{formatCurrency(product.cost)}</p>
            </div>


            <p className="text-gray-600 mx-4 mb-4"></p>
            <div className="flex justify-between mx-4 mb-4">
              <button className="bg-cougar-gold text-friendly-black3 px-3 py-1 rounded font-semibold hover:bg-cougar-gold-dark" onClick={(event) => handleAddToCart(product)}>
                Add to Cart
              </button>
              <button className="bg-cougar-red text-white px-3 py-1 rounded font-semibold hover:bg-cougar-dark-red" onClick={redirectToCheckout}>
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IndexPage;