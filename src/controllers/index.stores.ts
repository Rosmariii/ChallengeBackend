import { Request, Response, } from "express"
import { pool } from "../basedato"
import { QueryResult } from "pg";

export const getStore = async (req: Request, res: Response): Promise<Response> => {
    let result = []

    if(req.query.hasOwnProperty('name')) {
        const name = req.query.name;
        let response: QueryResult = await pool.query('SELECT * FROM stores WHERE name = $1', [name]);
        result = response.rows
    } else {
        let response: QueryResult = await pool.query('SELECT * FROM stores');
        result = response.rows
    }

    if(req.query.hasOwnProperty('page')) {
        const page = Number(req.query.page);
        
        if(page > 0) {
            const start = page * 10
            const end = start+10
            result = result.slice(start, end)
        }
    } else {
        result = result.slice(0, 10)
    }
    
    return res.send(result)
}

export const newStore = async (req: Request, res: Response): Promise<Response> => {
    const {name, address} = req.body;

    if(name !== null && name.length > 0 && address !== null && address.length > 0) {
        await pool.query('INSERT INTO stores (name, address) VALUES ($1, $2)', [name, address]);
        return res.status(200).json({message:'has been created successfully', body: { name, address}})
    } else {
        return res.status(422).json({message: 'the name and address field cannot be null'})
    }
}

export const deleteStore = async (req: Request, res: Response): Promise<Response> => {
    
    try { 
        const id = parseInt(req.params.id);
        const result = await pool.query('SELECT * FROM stores WHERE id = $1', [id]);

        if (result.rowCount == 1) { 
            await pool.query('DELETE FROM stores WHERE id = $1', [id]);
            return res.status(200).json({message: 'deleting'})
        } else {
            return res.status(404).json({ message: 'the id does not exist'})
        }
    }
    catch(e) {
        return res.send(e)
    }
}