import { Request, Response, } from "express"
import { pool } from "../basedato"
import { QueryResult } from "pg";
import {validationCoupon, validationDate, getErrors} from './validations'
import * as EmailValidator from 'email-validator';


export const getcoupons = async (req: Request, res: Response): Promise<Response> => {
    try {
        const email = (req.query.email);
        const coupon = (req.query.coupon);
        const response: QueryResult = await pool.query('SELECT * FROM coupons WHERE customer_email = $1 and code = $2', [email, coupon]);
        if (response.rowCount == 0){ 
            return res.status(404).json({message: 'Not found'})
        } else {
            return res.status(200).json(response.rows)
        }     
    }
    catch (e) {
        return res.status(500).json('internal error');
    }
}

export const newCoupon = async (req: Request, res: Response): Promise<Response> => {
    
    const {assignedAt, code, expiresAt} = req.body

    if(validationCoupon(code) && validationDate(assignedAt) && validationDate(expiresAt)) {
        const response: QueryResult = await pool.query('INSERT INTO coupons (assigned_at, code, expires_at) VALUES ($1, $2, $3)', [assignedAt, code, expiresAt]);
        return res.status(201).json({messege:'coupon saved',body: {code, assignedAt, expiresAt,}})
    } else {
        return res.status(422).json(getErrors(code,expiresAt,assignedAt));
    }
}

export const assignCoupon = async (req: Request, res: Response): Promise<Response> => {
    
    const {email, code} = (req.body);
    const chekemail = EmailValidator.validate(email);
    
    if (chekemail) {  
        const resEmail: QueryResult = await pool.query('SELECT * FROM coupons WHERE customer_email = $1', [email]);
        if(resEmail.rowCount == 0) {
            const assignCoupon: QueryResult = await pool.query('UPDATE coupons SET customer_email = $1 WHERE code = $2', [email, code]);
            return res.status(201).json({message: 'saved correctly', body: {email,code} })
        } else {
            return res.status(406).json({message: 'Error: The email was already assigned to a coupon or the coupon does not exist '})
            }           
    } else {
        return res.status(422).json({message: 'the email format is not correct'})
    }
}

export const deleteCoupon = async (req: Request, res: Response): Promise<Response> => {
    try { 
        const id = parseInt(req.params.id);
        const result = await pool.query('SELECT * FROM coupons WHERE id = $1 and code is not null and customer_email is null', [id]);
        if (result.rowCount == 1) {
            await pool.query('DELETE FROM coupons WHERE id = $1', [id]);
            return res.status(200).json({message: 'deleting'})
        } else {
            return res.status(404).json({ message: 'the code is not valid or does not exist'})
        }
    }
    catch(e) {
        return res.send(e)
    }
}
