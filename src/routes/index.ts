import { Router } from "express";
import { getcoupons, newCoupon } from "../controllers/index.controllers";
const router = Router()

router.get('/coupons', getcoupons)
router.post('/coupons', newCoupon)
//router.put('/coupons:id', getcoupons)
//router.deleted('/coupons:id', getcoupons)

export default router