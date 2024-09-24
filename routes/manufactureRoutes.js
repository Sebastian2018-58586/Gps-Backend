const { Router } = require("express");
const {
  createManufacture,
  findManufacture,
  updateManufacture,
  deleteManufacture,
  findManufactures,
  detailsAvailable,
  getExpenses
} = require("../controllers/manufactureController");
const { catchErrors } = require("../middlewares/catchErrors");
const validateFields = require("../validations/validate-fields");
const router = Router();

const fieldsValidate = [
  "name",
  "details",
];
const fieldsNameValidate = [
  "El nombre",
  "los detalles de la manufactura",
];
router.post(
  "/new",
  [
    validateFields.isEmpty(fieldsValidate, fieldsNameValidate),
    catchErrors,
  ],
  createManufacture
);
router.get("/:id", findManufacture);
router.get("/details/expense/:id", detailsAvailable);
router.get("/expenses/avalaibles", getExpenses);
router.post("/manufactures", findManufactures); 
router.put(
  "/edit/:id", 
  [
    catchErrors,
  ],
  updateManufacture  
);
router.delete("/:id", deleteManufacture);

module.exports = router;