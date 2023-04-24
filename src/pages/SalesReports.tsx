import React, { useState, useEffect } from 'react';
import { Product } from '../interfaces/ProductInterface';
import { useOnClickOutside } from 'usehooks-ts';
import axios from 'axios';
import useSWR, { mutate } from 'swr';
import MetricChartSales from '@/components/MetricChartSales';
import MetricChartSalesMoney from '@/components/MetricChartSalesMoney';


const SalesReports: React.FC = () => {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());

  const useProductsHook = () => {
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

  const { products, isLoading, isError, createProduct, updateProduct, deleteProduct } = useProductsHook();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

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


  const validateProduct = (product: Partial<Product>): boolean => {
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


  const falseClick = (product: Product) => {
    setSelectedProduct(product);

  };


  const handleEditClick = (product: Product) => {
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

  const handleDeleteClick = async (ProductID: string, product: Product) => {
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
    <div className="min-h-screen py-6 flex justify-center items-center -mt-20">
      <div className="w-full max-w-4xl">
        <div className="bg-white shadow-xl rounded-2xl p-8 mx-auto">
          <h2 className="text-4xl font-bold text-gray-700 mb-10">
            Sales Reports
          </h2>
          <div className="text-gray-700 mb-4 text-2xl">
              
          <div className="block font-semibold text-2xl text-gray-700" style={{ textAlign: "center" }}>
            Number Sold Chart
            {filteredProducts && <MetricChartSales products={filteredProducts} />}
          </div>
          <div className="block font-semibold text-2xl text-gray-700" style={{ textAlign: "center" }}>
            Revenue Chart
            {filteredProducts && <MetricChartSalesMoney products={filteredProducts} />}
          </div>

          </div>
          <div className="max-w-md mx-auto">
            <div className="flex justify-content-start items-center space-x-5">
              {/* Add any additional content here */}
            </div>
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <ul className="list-disc space-y-2">
                  <li className="flex items-start">
                    <span className="h-6 flex items-center text-sm sm:h-7">
                    Product revenue bar graph comparisons data is extracted from the [dbo].PRODUCT and [dbo].SHOPPING_CART tables for calculations. 
                    The calculation is made up of Product_id and quantity elements for each unique Product_id from [dbo].SHOPPING_CART with similar selling price from [dbo].PRODUCT and multiplies the quantity with the selling price
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesReports;



