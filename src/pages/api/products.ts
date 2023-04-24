import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '@/../db';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pool = await getConnection();

  if (req.method === 'GET') {
    try {
      const result = await pool.request().query(`
        SELECT ProductID, p_name, Inv_quantity, prod_type, date_add, supp, cost, url_link, num_sold
        FROM [dbo].[PRODUCT]
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
      await pool.request()
      .input('ProductID', productData.ProductID) 
      .input('p_name', productData.p_name)
      .input('Inv_quantity', productData.Inv_quantity)
      .input('prod_type', productData.prod_type)
      .input('date_add', productData.date_add)
      .input('supp', productData.supp)
      .input('cost', productData.cost)
      .input('url_link', productData.url_link || 'https://via.placeholder.com/150') 
      .input('num_sold', productData.num_sold || 0)
      .query(`
        INSERT INTO [dbo].[PRODUCT] (ProductID, p_name, Inv_quantity, prod_type, date_add, supp, cost, url_link, num_sold)
        VALUES (@ProductID, @p_name, @Inv_quantity, @prod_type, @date_add, @supp, @cost, @url_link, @num_sold)
      `);

      console.log('POST response being sent');
      res.status(201).json({ message: 'Product created successfully' });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'PUT') {
    const ProductID = req.query.ProductID;
    const productData = req.body;
  
    try {
      await pool.request()
      .input('ProductID', ProductID)
      .input('p_name', productData.p_name)
      .input('Inv_quantity', productData.Inv_quantity)
      .input('prod_type', productData.prod_type)
      .input('date_add', productData.date_add)
      .input('supp', productData.supp)
      .input('cost', productData.cost)
      .input('url_link', productData.url_link)
      .input('num_sold', productData.num_sold)
      .query(`
        UPDATE [dbo].[PRODUCT]
        SET p_name = @p_name,
            Inv_quantity = @Inv_quantity,
            prod_type = @prod_type,
            date_add = @date_add,
            supp = @supp,
            cost = @cost,
            url_link = @url_link,
            num_sold = @num_sold
        WHERE ProductID = @ProductID
      `);

      console.log('PUT response being sent');
      console.log('productData:', productData);
    
      return res.status(200).json({ message: 'Product updated successfully' });
    } catch (error) {
      console.error('Error updating product:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'DELETE') {
    const productId = req.query.productId;

    await pool.request()
    .input('productId', productId)
    .query(`
      DELETE FROM [dbo].[PRODUCT]
      WHERE ProductID = @productId
    `);

    console.log('DELETE response being sent');
    res.status(200).json({ message: 'Product deleted successfully' });
  } else {
    console.log('Method not allowed response being sent');
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

export default handler;