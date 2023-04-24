import type { NextApiRequest, NextApiResponse } from 'next';
import { getConnection } from '@/../db';


async function handler(req: NextApiRequest, res: NextApiResponse) {
  const pool = await getConnection();

  if (req.method === 'GET') {
    try {
      const result = await pool.request().query(`
        SELECT user_id, f_name, l_name, dob, email, phone_num, pw, userType, url_link
        FROM [dbo].[USERS]
      `);
      console.log('GET response being sent');
      res.status(200).json(result.recordset);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else if (req.method === 'POST') {
    const userData = req.body;

    try {
      await pool.request()
        .input('user_id', userData.user_id)
        .input('f_name', userData.f_name)
        .input('l_name', userData.l_name)
        .input('dob', userData.dob)
        .input('email', userData.email)
        .input('phone_num', userData.phone_num)
        .input('pw', userData.pw)
        .input('userType', userData.userType)
        .input('url_link', userData.url_link || 'https://i.postimg.cc/Pf6chd82/blank-profile-picture-973460-340.png')
        .query(`
          INSERT INTO [dbo].[USERS] (user_id, f_name, l_name, dob, email, phone_num, pw, userType, url_link)
          VALUES (@user_id, @f_name, @l_name, @dob, @email, @phone_num, @pw, @userType, @url_link)
        `);

      console.log('POST response being sent');
      res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  
  
} else if (req.method === 'PUT') {
    const user_id = req.query.user_id;
    const userData = req.body;

    try {
      await pool.request()
        .input('user_id', user_id)
        .input('f_name', userData.f_name)
        .input('l_name', userData.l_name)
        .input('dob', userData.dob)
        .input('email', userData.email)
        .input('phone_num', userData.phone_num)
        .input('pw', userData.pw)
        .input('userType', userData.userType)
        .input('url_link', userData.url_link || 'https://i.postimg.cc/Pf6chd82/blank-profile-picture-973460-340.png')
        .query(`
          UPDATE [dbo].[USERS]
          SET f_name = @f_name,
              l_name = @l_name,
              dob = @dob,
              email = @email,
              phone_num = @phone_num,
              pw = @pw,
              userType = @userType,
              url_link = @url_link
          WHERE user_id = @user_id
        `);

      console.log('PUT response being sent');
      res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
} else if (req.method === 'DELETE') {
    const user_id = req.query.user_id;
  
    try {
      await pool.request()
        .input('user_id', user_id)
        .query(`
          DELETE FROM [dbo].[USERS]
          WHERE user_id = @user_id
        `);
  
      console.log('DELETE response being sent');
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  } else {
    console.log('Method not allowed response being sent');
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

export default handler;