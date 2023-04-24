import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '@/../db';


async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pool = await getConnection();

  if (req.method === 'GET') {
    try {
      const result = await pool.request().query(`
        SELECT Sup_id, Sup_name
        FROM [dbo].[SUPPLIER]
      `);
      console.log('GET response being sent');
      res.status(200).json(result.recordset);
    } catch (error) {
      console.error('Error fetching Suppliers:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    const userData = req.body;

    try {
      await pool.request()
        .input('Sup_id', userData.Sup_id)
        .input('Sup_name', userData.Sup_name)
        .query(`
          INSERT INTO [dbo].[SUPPLIER] (Sup_id, Sup_name)
          VALUES (@Sup_id, @Sup_name)
        `);

      console.log('POST response being sent');
      res.status(201).json({ message: 'Supplier created successfully' });
    } catch (error) {
      console.error('Error creating Supplier:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  
  
} else if (req.method === 'PUT') {
    const Sup_id = req.query.Sup_id;
    const userData = req.body;

    try {
      await pool.request()
        .input('Sup_id', Sup_id)
        .input('Sup_name', userData.Sup_name)
        .query(`
          UPDATE [dbo].[SUPPLIER]
            SET Sup_id = @Sup_id, 
            SET Sup_name = @Sup_name
          WHERE Sup_id = @Sup_id
        `);

      console.log('PUT response being sent');
      res.status(200).json({ message: 'Supplier updated successfully' });
    } catch (error) {
      console.error('Error updating Supplier:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
} else if (req.method === 'DELETE') {
    const Sup_id = req.query.Sup_id;
  
    try {
      await pool.request()
        .input('Sup_id', Sup_id)
        .query(`
          DELETE FROM [dbo].[SUPPLIER]
          WHERE Sup_id = @Sup_id
        `);
  
      console.log('DELETE response being sent');
      res.status(200).json({ message: 'Supplier deleted successfully' });
    } catch (error) {
      console.error('Error deleting Supplier:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    console.log('Method not allowed response being sent');
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

export default handler;