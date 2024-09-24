const { Router } = require("express");
const {
  createSale,
  findSale,
  findSales,
  updateSale,
  deleteSale,
  findSaleByCustomer,
  findSalesByCustomer,
} = require("../controllers/saleController");
const { catchErrors } = require("../middlewares/catchErrors");
const validateFields = require("../validations/validate-fields");

const router = Router();

const fieldsValidate = ["name", "state", "total_price", "details"];
const fieldsNameValidate = [
  "El nombre",
  "El estado",
  "El total de la compra",
  "los detalles de la compra",
];
router.post(
  "/new", 
  [
    validateFields.isEmpty(fieldsValidate, fieldsNameValidate),
    validateFields.validNumber(
      ["total_price"],
      ["el total de la venta debe ser un valor numerico"]
    ),
    catchErrors,
  ],
  createSale
);
router.get("/sales/:idCustomer",findSalesByCustomer);
router.get("/:id", findSale);
router.post("/sales", findSales);
router.put("/edit/:id", updateSale);
router.delete("/:id", deleteSale);

module.exports = router;
