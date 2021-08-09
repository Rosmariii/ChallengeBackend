import { Router } from "express";
import { getcoupons, newCoupon, assignCoupon, deleteCoupon } from "../controllers/index.controllers";
const router = Router()

router.get('/coupons', getcoupons)
router.post('/coupons', newCoupon)
router.patch('/coupons', assignCoupon)
router.delete('/coupons/:id', deleteCoupon)

export default router