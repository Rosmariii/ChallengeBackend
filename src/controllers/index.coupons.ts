import { Request, Response, } from "express"
import { pool } from "../basedato"
import { QueryResult } from "pg";
import {validationCoupon, validationDate, getErrors} from './validations'
import * as EmailValidator from 'email-validator';


export const getcoupons = async (req: Request, res: Response): Promise<Response> => {
    try {
        // Acá podemos aprovechar la destructuracion de objetos de JS para tener un código más limpio.
        const { email, coupon } = req.query;

        const response: QueryResult = await pool.query('SELECT * FROM coupons WHERE customer_email = $1 and code = $2', [email, coupon]);

        // no hace falta el === 0, ya que si es 0 es falsy y si es mayor a 0 es truthy. También ojo con usar sólo ==, siempre ===
        if (response.rowCount){ 
            return res.status(404).json({message: 'Not found'})
        } 
        
        // no hace falta el else, ya que si el if de arriba es true, el código termina en el return y no sigue ejecutando
        return res.status(200).json(response.rows)
    }
    catch (e) {
        // siempre loguea el error para entender mejor.
        console.log(e)
        return res.status(500).json('internal error');
    }
}

export const newCoupon = async (req: Request, res: Response): Promise<Response> => {
    
    const {assignedAt, code, expiresAt} = req.body

    // Lo paso a una variable que explica lo que esta validando para que el if sea más legible
    const validateInputs = validationCoupon(code) && validationDate(assignedAt) && validationDate(expiresAt)
    if(!validateInputs) {
        // puse el 422 acá. Si algo no esta bien, respondo. Si tenemos más lógica de negocio más adelante, va por afuera del if.
        return res.status(422).json(getErrors(code,expiresAt,assignedAt));
    }
    
    const response: QueryResult = await pool.query('INSERT INTO coupons (assigned_at, code, expires_at) VALUES ($1, $2, $3)', [assignedAt, code, expiresAt]);
    res.status(201).json({messege:'coupon saved',body: {code, assignedAt, expiresAt,}})
}

export const assignCoupon = async (req: Request, res: Response): Promise<Response> => {
    
    const { email, code } = req.body;
    const chekemail = EmailValidator.validate(email);
    
    // evitamos tantos ifs anidados, nunca son lindos de leer.
    if (chekemail) {
        return res.status(422).json({message: 'the email format is not correct'})
    }  

    const resEmail: QueryResult = await pool.query('SELECT * FROM coupons WHERE customer_email = $1', [email]);
    if(!resEmail.rowCount) {
        return res.status(406).json({message: 'Error: The email was already assigned to a coupon or the coupon does not exist '})   
    } 

    const assignCoupon: QueryResult = await pool.query('UPDATE coupons SET customer_email = $1 WHERE code = $2', [email, code]);
    return res.status(201).json({message: 'saved correctly', body: {email,code} })
}

export const deleteCoupon = async (req: Request, res: Response): Promise<Response> => {
    try { 
        const id = parseInt(req.params.id);

        const result = await pool.query('SELECT * FROM coupons WHERE id = $1 and code is not null and customer_email is null', [id]);
        if (!result.rowCount) {
            return res.status(404).json({ message: 'the code is not valid or does not exist'})
        } 

        await pool.query('DELETE FROM coupons WHERE id = $1', [id]);
        return res.status(200).json({message: 'deleting'})
    }
    catch(e) {
        return res.send(e)
    }
}
