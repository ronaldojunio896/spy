import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from '@/db/schema';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.DATABASE_URL || '';

// Cria a conexão global para o projeto
const poolConnection = mysql.createPool(connectionString);
export const db = drizzle(poolConnection, { schema, mode: 'default' });