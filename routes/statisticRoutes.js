const { Router } = require("express");
const router = Router();
const {salesForRange, proffitAndLoss, totalSalesByProduct}= require('../controllers/statisticController.js')
router.post('/sales',salesForRange);
router.post('/proffitsLoss',proffitAndLoss);
router.post('/salesPerProduct',totalSalesByProduct);
module.exports = router;