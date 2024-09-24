const { Router } = require("express");
const {
  createSupplier,
  findSupplier,
  findSuppliers,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplierController");
const { catchErrors } = require("../middlewares/catchErrors");
const validateFields = require("../validations/validate-fields");
const router = Router();

const fieldsValidate = [
  "name",
  "adress",
  "phoneNumber",
  "products"
];
const fieldsNameValidate = [
  "El nombre",
  "La dirección",
  "El numero de telefono",
  "los productos del proveedor"
];
router.post(
  "/new",
  [
    validateFields.isEmpty(fieldsValidate, fieldsNameValidate),
    validateFields.validNumber(
      ["phoneNumber"],
      ["el numero de telefono debe ser un valor numerico"]
    ),
    catchErrors,
  ],
  createSupplier
);
router
router.get("/:id", findSupplier);
router.post("/suppliers", findSuppliers);
router.put(
  "/edit/:id",
  [
    validateFields.isEmpty(fieldsValidate, fieldsNameValidate),
    validateFields.validNumber(
        ["phoneNumber"],
        ["el numero de telefono debe ser un valor numerico"]
      ),
    catchErrors,
  ],
  updateSupplier
);
router.delete("/:id", deleteSupplier);

module.exports = router;