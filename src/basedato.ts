import {Pool} from "pg";
import dotenv from "dotenv";
dotenv.config()

export const pool = new Pool ({
        user: "postgres",
        host: "localhost",
        port: 5432,
        password: "rosmari92",
        database: "postgres",
    
})