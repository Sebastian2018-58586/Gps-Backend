const {Router} = require('express');
const { catchErrors } = require("../middlewares/catchErrors");
const validateFields = require("../validations/validate-fields");
const {createOrder,deleteOrder,findOrder,findOrders,updateOrder,getAMountOrders, findDetailsOrderByCustomer, getAmountDetailOrders, deleteDetailOrder, updateDetailOrder}= require('../controllers/orderController');
const router =Router();


const fieldsValidate = ["name", "state"];
const fieldsNameValidate = [
  "El nombre",
  "El estado",
];
router.post(
  "/new", 
  [
    validateFields.isEmpty(fieldsValidate, fieldsNameValidate),
    catchErrors,
  ],
  createOrder
);

router.get("/:id", findOrder);
/* router.get("/details/:idCustomer",findDetailsOrderByCustomer)
 */router.get("/orders/amount",getAMountOrders);
router.get("/details/amount/:idCustomer",getAmountDetailOrders);
router.post("/orders", findOrders);
router.put("/edit/:id", updateOrder);
router.put("/detail/edit/:id",updateDetailOrder);
router.delete("/:id", deleteOrder);
router.delete("/detail/:id",deleteDetailOrder);

module.exports = router;