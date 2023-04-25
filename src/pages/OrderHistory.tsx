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
        if (!orders || orders.length === 0) {
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

    
      if (isLoading3) return <p>Loading...</p>;
      if (isError3) return <p>Error loading users.</p>;
    


      const totalCost = (orders || []).reduce((sum, cartItem) => {
        const product = products.find((item) => item.ProductID === cartItem.Product_id);
        if (!product) return sum;
        return sum + (product.cost * cartItem.quantity);
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

      function formatCurrency(amount: number): string {
        const formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
        });
        return formatter.format(amount);
      }
    
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
    


      const handleAddClickCart = () => {
        setShowAddModal(true);
      };
    
      const closeModalCart = () => {
        setShowModal(false);
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
        const cartItem = orders.find((cart) => orders.Product_id === product.Product_id);
      
        if (cartItem) {
          const previousQuantity = cartItem.quantity;
          const updatedCart = { ...cartItem, quantity: newQuantity };
          await updateOrder(updatedCart);
      
          const inventoryChange = previousQuantity - newQuantity;
          await decreaseProductQuantity(product.ProductID, inventoryChange);
        } else {
          console.error('No matching cart item found for the selected product');
        }
      };

      const groupedOrders = groupOrdersByProduct(orders);
      
return (
  <>
    <div className="min-h-screen py-6 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold mb-6">Your Order History.</h1>
          <div className="flex"> 
            <div className="grid grid-cols-1 gap-8 w-full mr-4"> 
              {orders && orders.map((cartItem) => {
                const product = products.find(
                (item) => item.ProductID === cartItem.Product_id
              );
              const quantity = cartItem ? cartItem.quantity : 0;

              if (!product) return null;
              return (
                <div key={cartItem.cart_id} className="bg-white p-0 rounded outline-hover-white shadow-lg hover:shadow-2xl flex">
                  <Image
                    src={`${product.url_link}`}
                    alt={product.Product_id}
                    width={100}
                    height={100}
                    className="rounded-l"
                    layout="fixed"
                  />
              
                  <div className="flex flex-col justify-between ml-4 mb-2">
                    <div>
                      <h2 className="mt-2 text-xl font-bold">{product.p_name}</h2>
                      <p className="text-gray-600">Price: ${(product.cost).toFixed(2)}</p>
                      <p className="text-gray-600">Supplier: {product.supp}</p>
                      <p className="text-gray-600">Quantity: {quantity}</p>
                      <p className="text-gray-600">Expense: ${(quantity * product.cost).toFixed(2)}</p>
                    </div>
            
                  </div>
                </div>
              );
            })}

          </div>
          <div className="bg-white shadow-xl rounded p-8 ">
          <h2 className="text-xl font-bold mb-4">Order History Overview</h2>
          <ul>
          {orders && orders.map((cartItem) => {
                const product = products.find(
                  (item) => item.ProductID === cartItem.Product_id
                );
                const quantity = cartItem ? cartItem.quantity : 0;
                
                console.log('cartItem:', cartItem);
                console.log('product:', product);
                console.log('quantity:', quantity);
                
                if (!product) return null;


                return (
                  <li key={cartItem.cart_id} className="mb-2 text-sm">
                    {product.p_name}: {quantity} x ${product.cost}
                  </li>
                );
              })}
          </ul>
          <hr className="my-4" />
          <div className="flex justify-between font-semibold mb-5">
            <span>Cost:</span>
            <div className="">${totalCost ? totalCost.toFixed(2) : 0}</div>
          </div>

          <div className="flex justify-between font-semibold mb-5">
            <span>Sales Tax (6.25%):</span>
            <div className="">+({formatCurrency(totalCost ? totalCost.toFixed(2) *  0.0625: 0)})</div>
          </div>
          <hr className="my-4" />

          <div className="flex justify-between text-2xl font-bold mb-12 bg-cougar-yellow rounded-lg">

          <div className="">${(totalCost ? totalCost + totalCost *  0.0625 : 0).toFixed(2)}</div>

          </div>



          <div className="flex justify-between">

          </div>
      </div>
        </div>
        </div>
      </div>


    </>
  );
}

export default OrderHistory;



