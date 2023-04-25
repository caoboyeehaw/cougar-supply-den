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
  // Group products by their names and calculate the total inventory quantity for each group
  const productTypeCounts = products.reduce((acc, product) => {
    const invQuantity = product.Inv_quantity;
    const productName = product.p_name;

    if (!acc[productName]) {
      acc[productName] = {
        Inv_quantity: invQuantity,
        count: 1,
      };
    } else {
      acc[productName].Inv_quantity += invQuantity;
      acc[productName].count += 1;
    }

    return acc;
  }, {});

  const chartData = Object.entries(productTypeCounts).map(([key, value]: [string, { Inv_quantity: number, count: number }]) => ({
    p_name: key,
    Inv_quantity: value.Inv_quantity,
    count: value.count,
  }));

  const updatedChartData = chartData.map((data: {p_name: string, Inv_quantity: number, count: number}) => ({
    p_name: data.p_name,
    Stock: data.Inv_quantity,
  }));

  const tooltipFormatter = (value: number, name: string, entry: any, index: number): [number, string] => {
    return [parseFloat(value.toFixed(2)), name];
  };

  return (
    <ResponsiveContainer width={800} height={400}>
      <BarChart data={updatedChartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="p_name" />
        <YAxis domain={[0, maxInventory]} />
        <Tooltip/>
        <Legend />
        <Bar dataKey="Stock" fill="#05b48c" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default PerformanceMetricChart;