import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function dropTables() {
  const connection = await mysql.createPool(process.env.DATABASE_URL || '');
  
  console.log('Limpando tabelas antigas...');
  await connection.query('DROP TABLE IF EXISTS logs, spylinks, investigators;');
  console.log('Tabelas apagadas com sucesso!');
  
  process.exit(0);
}

dropTables();