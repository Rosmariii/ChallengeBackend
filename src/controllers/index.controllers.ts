import { Request, Response, } from "express"
import { pool } from "../basedato"
import { QueryResult } from "pg";

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
    console.log(req.body)
    return res.send('received')

}
