import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '@/../db';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pool = await getConnection();

  if (req.method === 'GET') {
    try {
      const result = await pool.request().query(`
        SELECT cart_id, cust_id, Product_id, quantity
        FROM [dbo].[SHOPPING_CART]
      `);
      console.log('GET response being sent');
      res.status(200).json(result.recordset);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    const productData = req.body;
  
    try {
      console.log('productData:', productData); // Add this line to log productData
  
      if (productData.cart_id) {
        await pool.request()
          .input('cart_id', productData.cart_id)
          .input('cust_id', productData.cust_id)
          .input('Product_id', productData.Product_id)
          .input('quantity', productData.quantity)
          .query(`
            INSERT INTO [dbo].[SHOPPING_CART] (cart_id, cust_id, Product_id, quantity)
            VALUES (@cart_id, @cust_id, @Product_id, @quantity)
          `);
      } else {
        await pool.request()
          .input('cust_id', productData.cust_id)
          .input('Product_id', productData.Product_id)
          .input('quantity', productData.quantity)
          .query(`
            INSERT INTO [dbo].[SHOPPING_CART] (cust_id, Product_id, quantity)
            VALUES (@cust_id, @Product_id, @quantity)
          `);
      }
  
      console.log('POST response being sent');
      res.status(201).json({ message: 'Product created successfully' });
    } catch (error) {
      console.error('Error creating product:', error); // Update this line to log the error
      res.status(500).json({ message: 'Internal Server Error' });
    }
  
} else if (req.method === 'PUT') {
  const cart_id = req.query.cart_id;
  const productData = req.body;
  
  try {
    await pool.request()
    .input('cart_id', cart_id)
    .input('cust_id', productData.cust_id)
    .input('Product_id', productData.Product_id)
    .input('quantity', productData.quantity)
    .query(`
      UPDATE [dbo].[SHOPPING_CART]
      SET cart_id = @cart_id,
          cust_id = @cust_id,
          Product_id = @Product_id,
          quantity = @quantity
      WHERE cart_id = @cart_id
    `);
  
    console.log('PUT response being sent');
    console.log('productData:', productData);
    
    return res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }

} else if (req.method === 'DELETE') {
  const cart_id = req.query.cart_id;

  await pool.request()
    .input('cart_id', cart_id)
    .query(`
      DELETE FROM [dbo].[SHOPPING_CART]
      WHERE cart_id = @cart_id
    `);

    console.log('DELETE response being sent');
    res.status(200).json({ message: 'Product deleted successfully' });
  } else {
    console.log('Method not allowed response being sent');
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

export default handler;