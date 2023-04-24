import sql from 'mssql';

const config = {
  server: 'cougarsupplyden3380.database.windows.net',
  authentication: {
    type: 'default',
    options: {
      userName: 'employee',
      password: 'CougarSupplyDen1!',
    },
  },
  options: {
    database: 'CougarSupplyDen',
    encrypt: true, // If using Azure SQL Database or other cloud-based servers, set this to true
  },
};

export async function getConnection(): Promise<sql.ConnectionPool> {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
}