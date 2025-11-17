import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as productSchema from "../database/schemas/product.schema"
import * as seoSchema from "../database/schemas/seo.schema"

const connection = mysql.createPool({
    host: process.env.DB_HOST, // localhost
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

// ...Object => Destructure a componnet to individual objects
export const db = drizzle(connection, {
    schema: {
        ...productSchema,
        ...seoSchema
    },
    mode: "default"
});