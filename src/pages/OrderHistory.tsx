import { NextPage } from "next";

import React, { useEffect, useState } from "react";
    
import Image from 'next/image';
import { useOnClickOutside } from 'usehooks-ts';
    
import axios from 'axios';
import useSWR, { mutate } from 'swr';
    
import { ShoppingCart } from '../interfaces/CartInterface';
import { Product } from '../interfaces/ProductInterface';
import { Users } from '../interfaces/UsersInterface';
import { Order } from '../interfaces/OrderInterface';
    
import { useAuth } from "../context/AuthContext";
import router from "next/router";

import { CosmosClient } from '@azure/cosmos';
    
    
const fetcher = (url: string) => fetch(url).then((res) => res.json());
    
const OrderHistory: NextPage = () => {
  const auth = useAuth(); 
    
  const useProductsHookProducts = () => {
  const { data, error } = useSWR('/api/products', fetcher);
    
  const isLoading = !data && !error;
  const isError = error;

  const [isLoading22, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); // Change the delay time here to make the page load slower or faster
    return () => clearTimeout(timer);
  }, []);
    

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
        
        
        const updateCart = async (selectedProduct: ShoppingCart) => {
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
            console.error('Error updating product:', error);
            throw error.response.data;
          }
        };
    
        const createOrder = async (newProduct) => {
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
          orders: data,
          isLoading4,
          isError4,
          updateOrder,
          createOrder,
          deleteOrder,
        };
      };
    
      const groupOrdersByProduct = (orders: Order[]): Record<string, number> => {
        if (orders.length === 0) {

          return {};
        }
      
        return orders.reduce((acc, order) => {
          if (!acc[order.Product_id]) {
            acc[order.Product_id] = order.quantity;
          } else {
            acc[order.Product_id] += order.quantity;
          }
          return acc;
        }, {});
      };
    
      const { products, isLoading, isError, createProduct, updateProduct, deleteProduct } = useProductsHookProducts();
      const { carts, isLoading2, isError2, updateCart, createCart, deleteCart, setCarts } = useProductsHookCarts();
      const { users, isLoading3, isError3, updateUser, createUser, deleteUser } = useProductsHookUsers();
      const { orders, isLoading4, isError4, updateOrder, createOrder, deleteOrder } = useProductsHookOrders();
    
      const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
      const [selectedCart, setSelectedCart] = useState<ShoppingCart | null>(null);
    
      const [activeProduct, setActiveProduct] = useState<number | null>(null);
      const [activeCart, setActiveCart] = useState<number | null>(null);
      
      const [newProduct, setNewProduct] = useState<Partial<Product>>({});
      const [newCart, setNewCart] = useState<Partial<ShoppingCart>>({});
    
      //const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
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
    
      const totalCost = (orders || []).reduce((sum, order) => {
        const product = products.find((item) => item.id === order.ProductId);
        if (!product) return sum;
        return sum + (product.cost * order.quantity);
      }, 0);
  
      
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
    

      const handleDeleteClickCart = async (CartID: number, cart: ShoppingCart) => {
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


      const deleteAllCartItems = async () => {
        for (const cartItem of carts) {
          await deleteCart(cartItem.cart_id);
        }
        setCarts([]);
      };

      const handlePlaceOrder = async () => {

        await deleteAllCartItems();
      };
      const redirectToCheckout= () => {
        handlePlaceOrder();
        router.push('/CheckoutPage');
      };

      const redirectToHome= () => {
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

      const groupedOrders = groupOrdersByProduct(orders);
      
      return (
        <div className="relative container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">Your Order History.</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">

          {orders.map((orderItem) => {
              const product = products.find((item) => item.id === orderItem.productId);
              const quantity = orderItem ? orderItem.quantity : 0;
      
              if (!product) return null;
      
              return (
                <div key={orderItem.order_id} className="bg-white p-0 rounded outline-hover-white shadow-lg hover:shadow-2xl">
                  <Image
                    src={`${product.url_link}`}
                    alt={product.Product_id}
                    width={300}
                    height={200}
                    className="rounded-t"
                    layout="fixed"
                  />
                  <h2 className="mt-2 text-xl font-bold mx-4">{product.p_name}</h2>
                  <p className="text-gray-600 mx-4">Price: ${product.cost}</p>
                  <p className="text-gray-600 mx-4">Supplier: {product.supp}</p>
                  <p className="text-gray-600 mx-4 mb-4"></p>
                  <div className="flex justify-between mx-4 mb-4">

                  </div>
                </div>
              );
            })}


            
          </div>
          <div className="fixed right-64 w-64 bg-white p-4 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold mb-4">Order History</h2>
            <ul>
              {carts.map((cartItem) => {
                const product = products.find(
                  (item) => item.ProductID === cartItem.Product_id
                );
                const quantity = cartItem ? cartItem.quantity : 0;
      
                if (!product) return null;
      
                return (
                  <li key={cartItem.cart_id} className="mb-2">
                    {product.p_name}: {quantity} x ${product.cost}
                  </li>
                );
              })}
            </ul>
            <hr className="my-4" />
            <div className="flex justify-between font-bold mb-5">
              <span>Total Purchases:</span>
              <div className="">
                
              ${(totalCost ? totalCost.toFixed(2) : 0)}
            </div>
              
            </div >
      

          </div>

    </div>
  );
};


export default OrderHistory;


