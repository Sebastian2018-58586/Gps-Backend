const { Router } = require("express");
const {
  createExpense,
  updateExpense,
  findExpense,
  deleteExpense,
  findExpenses
} = require("../controllers/expenseController");
const validateFields = require("../validations/validate-fields");
const { catchErrors } = require("../middlewares/catchErrors");
const router = Router();

const fieldsValidate = ['total_price','details'];
const fieldsNameValidate = ["El total del gasto", "los detalles del gasto"];
router.post(
  "/new",
  [
    validateFields.isEmpty(fieldsValidate, fieldsNameValidate),
    validateFields.validNumber(['total_price'],['el total del gasto debe ser un valor numerico']),
    catchErrors,
  ],
  createExpense
);
router.get("/:id", findExpense);
router.post("/expenses", findExpenses);
router.put(
  "/edit/:id",
  [
    validateFields.isEmpty(fieldsValidate, fieldsNameValidate),
    validateFields.validNumber(['total_price'],['el total del gasto debe ser un valor numerico']),
    catchErrors,
  ],
  updateExpense
);
router.delete("/:id", deleteExpense);

module.exports = router;
