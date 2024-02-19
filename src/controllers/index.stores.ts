import { Request, Response, } from "express"
import { pool } from "../basedato"
import { QueryResult } from "pg";

export const getStore = async (req: Request, res: Response): Promise<Response> => {
    let result = []
    let response: QueryResult = await pool.query('SELECT * FROM stores limit 100'); // por las dudas, siempre pongamos un límite, el día que sean 1000000 de registros, no va a andar.
    let count = response.rowCount
    const name = req.query.hasOwnProperty('name')
    const pageInput = req.query.hasOwnProperty('page')

    // toda esta lógica es incorrecta acá. Obtenes todos los resultados y después los cortas. Mejor pedirle a la base de datos que te devuelva sólo los que necesitas. y evitar todo el cómputo este
    // te lo va a agradecer la base de datos, el servidor y el cliente (que va a esperar menos)
    // quedaría algo así: (ojo, no lo pensé mucho, pero es para que entiendas la idea)
    const start = pageInput * 10
    const end = start+10
    const result = await pool.query('SELECT * FROM stores WHERE name = $1 limit $2 offset $3', [name, end, start]);

    
    // todo esto no va y lo del name y eso debería incluirse en la query de arriba.
    if(pageInput) {
        const page = Number(pageInput);
        
        if(page) {
            const start = page * 10
            const end = start+10
            result = result.slice(start, end)
        }
    } else {
        result = result.slice(0, 10)
    }

    
    return res.json({result, total_store: count})
}

export const newStore = async (req: Request, res: Response): Promise<Response> => {
    const {name, address} = req.body;

    const validationInput = name !== null && name.length > 0 && address !== null && address.length > 0
    if(!validationInput) {
        return res.status(422).json({message: 'the name and address field cannot be null'})
    } 

    await pool.query('INSERT INTO stores (name, address) VALUES ($1, $2)', [name, address]);
    return res.status(200).json({message:'has been created successfully', body: { name, address}})
}

export const deleteStore = async (req: Request, res: Response): Promise<Response> => {
    
    try { 
        const id = parseInt(req.params.id);
        const result = await pool.query('SELECT * FROM stores WHERE id = $1', [id]);

        if (result.rowCount) { 
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