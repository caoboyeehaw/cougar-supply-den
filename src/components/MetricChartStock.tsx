import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Product } from '../interfaces/ProductInterface';

interface MetricChartStock {
  products?: Product[];
}

const PerformanceMetricChart: React.FC<MetricChartStock> = ({
  products = [],
}) => {

  // Calculate the maximum inventory value
  const maxInventory = products.reduce((max, product) => {
    return product.Inv_quantity > max ? product.Inv_quantity : max;
  }, 0);

  // Process the products data for the chart here
  // For examples, you can create an array containing the number of products per product type

  const productTypeCounts = products.reduce((acc, product) => {
    const invQuantity = product.Inv_quantity;
    if (!acc[invQuantity]) {
      acc[invQuantity] = 1;
    } else {
      acc[invQuantity] += 1;
    }
    return acc;
  }, {});
  
  const chartData = Object.entries(productTypeCounts).map(([key, value]) => ({
    Inv_quantity: Number(key),
    count: value,
  }));
  
  const updatedChartData = chartData.map((data: {Inv_quantity: number, count: number}) => ({
    Inv_quantity: data.Inv_quantity,
    Stock: data.Inv_quantity * data.count, // Calculate the inventory quantity by multiplying Inv_quantity with count
  }));
  
  return (
    <ResponsiveContainer width={800} height={400}>
      <BarChart data={updatedChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Inv_quantity" />
        <YAxis domain={[0, maxInventory]} />
        <Tooltip />
        <Legend />
        <Bar dataKey="Stock" fill="#05b48c" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default PerformanceMetricChart;