import { Router } from "express";
import { getcoupons, newCoupon, assignCoupon, deleteCoupon } from "../controllers/index.coupons";
import { getStore, newStore, deleteStore } from "../controllers/index.stores";
const router = Router()

router.get('/coupons', getcoupons)
router.post('/coupons', newCoupon)
router.patch('/coupons', assignCoupon)
router.delete('/coupons/:id', deleteCoupon)

router.get('/store', getStore)
router.post('/store', newStore)
router.delete('/store/:id', deleteStore)


export default router