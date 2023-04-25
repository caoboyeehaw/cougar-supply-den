import { NextPage } from "next";

import React, { useEffect, useState } from "react";
    
import Image from 'next/image';
import { useOnClickOutside } from 'usehooks-ts';
    
import axios from 'axios';
import useSWR, { mutate } from 'swr';
    

import { Product } from '../interfaces/ProductInterface';
import { Users } from '../interfaces/UsersInterface';
import { Order } from '../interfaces/OrderInterface';
    
import { useAuth } from "../context/AuthContext";
import router from "next/router";

import { CosmosClient } from '@azure/cosmos';
    
    
const fetcher = (url: string) => fetch(url).then((res) => res.json());
  



const CheckoutPage: NextPage = () => {
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
        const [carts, setCarts] = useState([]);
        const { data, error } = useSWR('/api/carts', fetcher);
        const isLoading2 = !data && !error;
        const isError2 = error;
      
        useEffect(() => {
          const fetchData = async () => {
            try {
              const response = await fetch('/api/carts');
              const data = await response.json();
              setCarts(data);
            } catch (error) {
              console.error('Error fetching carts:', error);
            }
          };
      
          const intervalId = setInterval(fetchData, 5000); // Fetch data every 5 seconds (5000 ms)
      
          return () => clearInterval(intervalId);
        }, []);
        
        
        const updateCart = async (selectedProduct: Order) => {
          try {
            const response = await axios.put(`/api/carts?cart_id=${selectedProduct.cart_id}`, selectedProduct);
            const updatedCart = response.data;
            mutate('/api/carts');
            return updatedCart;
          } catch (error) {
            console.error('Error updating cart:', error);
            throw error.response.data;
          }
        };


        const createCart = async (newCart) => {
          await fetch('/api/carts', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCart),
          });
    
          mutate('/api/carts');
        };
    
        const deleteCart = async (cart_id) => {
          await fetch(`/api/carts?cart_id=${cart_id}`, {
            method: 'DELETE',
          });
    
          mutate('/api/carts');
        };
    
        return {
          carts: data,
          setCarts,
          isLoading2,
          isError2,
          updateCart,
          createCart,
          deleteCart,
        };
      };

      const fetcher = (url: string) => fetch(url).then((res) => res.json());

      const useProductsHook = () => {
        const { data, error } = useSWR('/api/orders', fetcher);
    
        const isLoading = !data && !error;
        const isError = error;
    
    
    
    
        const updateProduct = async (selectedProduct: Order) => {
          try {
            const response = await axios.put(`/api/orders?cart_id=${selectedProduct.cart_id}`, selectedProduct);
            const updatedProduct = response.data;
            mutate('/api/orders');
            return updatedProduct;
          } catch (error) {
            console.error('Error updating product:', error);
            throw error.response.data;
          }
        };
    
        const createProduct = async (newProduct) => {
          await fetch('/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProduct),
          });
    
          mutate('/api/orders');
        };
    
        //NOTE: The await fetch for this one is kind of sus, since its selectedProduct.user_id instead of user_id
        const deleteProduct = async (cart_id) => {
          await fetch(`/api/orders?cart_id=${cart_id}`, {
            method: 'DELETE',
          });
    
          mutate('/api/orders');
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

      
      const useProductsHookOrders = () => {
        const { data, error } = useSWR('/api/orders', fetcher);
    
        const isLoading4 = !data && !error;
        const isError4 = error;
    
        const updateOrder = async (selectedProduct: Order) => {
          try {
            const response = await axios.put(`/api/orders?cart_id=${selectedProduct.cart_id}`, selectedProduct);
            const updatedProduct = response.data;
            mutate('/api/orders');
            return updatedProduct;
          } catch (error) {
            console.error('Error updating order:', error);
            throw error.response.data;
          }
        };
    
        const createOrder  = async (newProduct) => {
          await fetch('/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProduct),
          });
    
          mutate('/api/orders');
        };
    
        //NOTE: The await fetch for this one is kind of sus, since its selectedProduct.user_id instead of user_id
        const deleteOrder = async (cart_id) => {
          await fetch(`/api/orders?cart_id=${cart_id}`, {
            method: 'DELETE',
          });
    
          mutate('/api/orders');
        };
    
        return {
          order: data,
          isLoading4,
          isError4,
          updateOrder,
          deleteOrder,
          createOrder,
        };
      };
    
    
    
    
      const { products, isLoading, isError, createProduct, updateProduct, deleteProduct } = useProductsHookProducts();
      const { carts, isLoading2, isError2, updateCart, createCart, deleteCart, setCarts } = useProductsHookCarts();
      const { users, isLoading3, isError3, updateUser, createUser, deleteUser } = useProductsHookUsers();
      const { order, isLoading4, isError4, updateOrder, createOrder, deleteOrder} = useProductsHookOrders();
    
      const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
      const [selectedCart, setSelectedCart] = useState<Order | null>(null);
    
      const [activeProduct, setActiveProduct] = useState<number | null>(null);
      const [activeCart, setActiveCart] = useState<number | null>(null);
      
      const [newProduct, setNewProduct] = useState<Partial<Product>>({});
      const [newCart, setNewCart] = useState<Partial<Order>>({});
    
      //const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
      //const [filteredCarts, setFilteredCarts] = useState<Order[]>(carts);
    
      const [errorMessage, setErrorMessage] = useState<string>("");
    
      const [showAddModal, setShowAddModal] = useState(false);
      const [showModal, setShowModal] = useState(false);



      const totalCost = (carts || []).reduce((sum, cartItem) => {
        const product = products.find((item) => item.ProductID === cartItem.Product_id);
        if (!product) return sum;
        return sum + (product.cost * cartItem.quantity);
      }, 0);
    
    
    
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
    
      const handleCheckout = async () => {
        if (!auth.user) {
          console.error("User not authenticated");
          return;
        }
      
        for (const cartItem of carts) {
          const product = products.find(
            (item) => item.ProductID === cartItem.Product_id
          );
      
          if (!product) continue;
            
          //check this logic here
          const newOrder: Order = {
            cart_id: cartItem.cart_id,
            cust_id: cartItem.cust_id,
            Product_id: product.ProductID,
            quantity: cartItem.quantity,
          };
      
          console.log("New order:", newOrder);
      
          await createOrder(newOrder);
          await deleteCart(cartItem.cart_id);
        }
      
        console.log("Orders after adding products:", order);
      
        router.push('/');
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

      const redirectToHome= () => {
        router.push('/ShoppingCart');
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
    

      const handleDeleteClickCart = async (CartID: number, cart: Order) => {
        setSelectedCart(cart);
        await deleteCart(CartID);
        setCarts(prevCarts => prevCarts.filter(item => item.cart_id !== CartID));
      };
    
      const handleAddClickCart = () => {
        setShowAddModal(true);
      };
    
      const closeModalCart = () => {
        setShowModal(false);
      };
      
      const redirectToCheckout= () => {

        router.push('/');
      };


      const decreaseProductQuantity = async (ProductID: string, quantityToDecrease: number) => {
        const productToUpdate = products.find((product) => product.ProductID === ProductID);
      
        if (productToUpdate) {
          const updatedProduct: Product = {
            ...productToUpdate,
            Inv_quantity: productToUpdate.Inv_quantity - quantityToDecrease,
          };
      
          await updateProduct(updatedProduct);
        }
      };

      const handleQuantityChange = async (e, product) => {
        const newQuantity = parseInt(e.target.value, 10);
        const cartItem = carts.find((cart) => cart.Product_id === product.Product_id);
      
        if (cartItem) {
          const previousQuantity = cartItem.quantity;
          const updatedCart = { ...cartItem, quantity: newQuantity };
          await updateCart(updatedCart);
      
          const inventoryChange = previousQuantity - newQuantity;
          await decreaseProductQuantity(product.ProductID, inventoryChange);
        } else {
          console.error('No matching cart item found for the selected product');
        }
      };   
      
      return (
        <div className="min-h-screen py-6 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl font-bold mb-6">Checkout Overview</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">

            {carts.map((cartItem) => {
            const product = products.find(
              (item) => item.ProductID === cartItem.Product_id
            );
            const quantity = cartItem ? cartItem.quantity : 0;

            if (!product) return null;

            return (
              <div key={cartItem.cart_id} className="bg-white p-0 rounded outline-hover-white shadow-lg hover:shadow-2xl">
                <Image
                  src={`${product.url_link}`}
                  alt={product.Product_id}
                  width={300}
                  height={200}
                  className="rounded-t"
                  layout="fixed"
                />
                <h2 className="mt-2 text-xl font-bold  mx-4">{product.p_name}</h2>
                <p className="text-gray-600 mx-4">Price: ${product.cost}</p>
                <p className="text-gray-600 mx-4">Supplier: {product.supp}</p>
                <p className="text-gray-600 mx-4 mb-4"></p>
                <div className="flex justify-between mx-4 mb-4">

                  <div className="flex justify-between items-center w-full">
                    <label htmlFor="quantity" className="rounded font-semibold text-lg bg-cougar-gold px-2">Quantity: {quantity}</label>
                  </div>

                </div>

                <div className="flex justify-between mx-4 mb-4">

                  <div className="flex justify-between items-center w-full">
                    <label htmlFor="cost" className="rounded font-semibold bg-cougar-gold text-lg px-2" >Cost: ${quantity * product.cost}</label>
                  </div>
                  
                </div>
              </div>
            );
            })}


            
        </div>
        <div className="bg-white shadow-xl rounded-2xl p-8 mt-6">
          <h2 className="text-xl font-bold mb-4">Order Summary</h2>
          <ul>
            {carts.map((cartItem) => {
                const product = products.find(
                  (item) => item.ProductID === cartItem.Product_id
                );
                const quantity = cartItem ? cartItem.quantity : 0;
                
                console.log('cartItem:', cartItem);
                console.log('product:', product);
                console.log('quantity:', quantity);
                
                if (!product) return null;


                return (
                  <li key={cartItem.cart_id} className="mb-2">
                    {product.p_name}: {quantity} x ${product.cost}
                  </li>
                );
              })}
          </ul>
          <hr className="my-4" />
          <div className="flex justify-between text-lg font-semibold mb-5">
            <span>Item(s) Cost:</span>
            <div className="">${totalCost ? totalCost.toFixed(2) : 0}</div>
          </div>

          <div className="flex justify-between font-semibold mb-5">
            <span>Sales Tax:</span>
            <div className="">+ ($formatCurrency({totalCost ? totalCost.toFixed(2) *  0.0625: 0}))</div>
          </div>
          <hr className="my-4" />
          <div className="flex justify-between text-2xl font-bold mb-12 bg-cougar-yellow p-2 rounded-lg">


            <span>Total Order Cost:</span>
            <div className="">${totalCost ? totalCost.toFixed(2) : 0}</div>

          </div>


          <div className="flex justify-between">
            <button
              className="bg-cougar-red text-white px-3 py-1 rounded mr-2 text-lg font-semibold hover:bg-cougar-dark-red"
              onClick={redirectToHome}
            >
              Back to Cart
            </button>
            <button
              className="bg-cougar-teal text-white px-3 py-1 rounded ml-5 text-lg font-semibold"
              onClick={handleCheckout}
            >
              Confirm Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;