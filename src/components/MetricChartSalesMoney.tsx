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

interface MetricChartSalesMoney {
  products?: Product[];
}
  
  const PerformanceMetricChart: React.FC<MetricChartSalesMoney> = ({
    products = [],
  }) => {
  
    // Calculate the maximum inventory value
    const maxInventory = products.reduce((max, product) => {
      return product.num_sold > max ? product.num_sold : max;
    }, 0);
  
    // Process the products data for the chart here
    // For examples, you can create an array containing the number of products per product type
  
    const productTypeCounts = products.reduce((acc, product) => {
      if (!acc[product.p_name]) {
        acc[product.p_name] = product.num_sold * product.cost;
      } else {
        acc[product.p_name] += product.num_sold * product.cost;
      }
      return acc;
    }, {});
    
    const chartData = Object.entries(productTypeCounts).map(([key, value]) => ({
      p_name: key,
      count: value,
    }));

    const tooltipFormatter = (value: number, name: string, entry: any, index: number): [number, string] => {
      return [parseFloat(value.toFixed(2)), name];
    };

    const updatedChartData = chartData.map((data: {p_name: string, count: number}) => ({
      p_name: data.p_name,
      Revenue: data.count, 
    }));

  
    return (
      <ResponsiveContainer width={800} height={400}>
        <BarChart data={updatedChartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="p_name" />
          <YAxis domain={[0, maxInventory]} />
          <Tooltip formatter={tooltipFormatter} />
          <Legend />
          <Bar dataKey="Revenue" fill="#05b48c" />
        </BarChart>
      </ResponsiveContainer>
    );
  };
  
  export default PerformanceMetricChart;