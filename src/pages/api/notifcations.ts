import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '@/../db';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pool = await getConnection();

  if (req.method === 'GET') {
    try {
      const result = await pool.request().query(`
        SELECT MessageId, ProductId, MessageText, TIMESTAMP, Loc_acc
        FROM [dbo].[LowStockMessages]
      `);
      console.log('GET response being sent');
      res.status(200).json(result.recordset);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    const notificationData = req.body;

    try {
      await pool.request()
        .input('ProductId', notificationData.ProductId)
        .input('MessageText', notificationData.MessageText)
        .input('TIMESTAMP', notificationData.TIMESTAMP)
        .input('Loc_acc', notificationData.Loc_acc)
        .query(`
          INSERT INTO [dbo].[LowStockMessages] (ProductId, MessageText, TIMESTAMP, Loc_acc)
          VALUES (@ProductId, @MessageText, @TIMESTAMP, @Loc_acc)
        `);

      console.log('POST response being sent');
      res.status(201).json({ message: 'Notification created successfully' });
    } catch (error) {
      console.error('Error creating notification:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'PUT') {
    const MessageId = req.query.MessageId;
    const notificationData = req.body;

    try {
      await pool.request()
        .input('MessageId', MessageId)
        .input('ProductId', notificationData.ProductId)
        .input('MessageText', notificationData.MessageText)
        .input('TIMESTAMP', notificationData.TIMESTAMP)
        .input('Loc_acc', notificationData.Loc_acc)
        .query(`
          UPDATE [dbo].[LowStockMessages]
          SET ProductId = @ProductId,
              MessageText = @MessageText,
              TIMESTAMP = @TIMESTAMP,
              Loc_acc = @Loc_acc
          WHERE MessageId = @MessageId
        `);

      console.log('PUT response being sent');
      res.status(200).json({ message: 'Notification updated successfully' });
    } catch (error) {
      console.error('Error updating notification:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'DELETE') {
    const MessageId = req.query.MessageId;

    try {
      await pool.request()
        .input('MessageId', MessageId)
        .query(`
          DELETE FROM [dbo].[LowStockMessages]
          WHERE MessageId = @MessageId
        `);

      console.log('DELETE response being sent');
      res.status(200).json({ message: 'Notification deleted successfully' });
    } catch (error) {
      console.error('Error deleting notification:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    console.log('Method not allowed response being sent');
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

export default handler;