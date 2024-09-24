const { Router } = require("express");
const {
  createCustomer,
  findCustomer,
  deleteCustomer,
  updateCustomer,
  findCustomers,
} = require("../controllers/customerController");
const { catchErrors } = require("../middlewares/catchErrors");
const validateFields = require("../validations/validate-fields");
const router = Router();

const fields = ["name", "surname", "phoneNumber", "adress"];
const nameFields = [
  "El nombre",
  "El apellido",
  "El numero celular",
  "La dirección",
];
router.post(
  "/new",
  [
    validateFields.isEmpty(fields, nameFields),
    validateFields.isLength(
      ["phoneNumber"],
      ["El numero de celular debe ser de 10 digitos."],
      [{ min: 10, max: 10 }]
    ),
    validateFields.validNumber(
      ["phoneNumber"],
      ["El numero celular debe ser numeríco"]
    ),
    validateFields.validName(
      ["name", "surname"],
      ["solo debe contener letras alfabeticas."]
    ),
    catchErrors,
  ],
  createCustomer
);

router.get("/view/:id", findCustomer);

router.post("/customers/", findCustomers);

router.put(
  "/edit/:id",
  [
    validateFields.isEmpty(fields, nameFields),
    validateFields.isLength(
      ["phoneNumber"],
      ["El numero de celular debe ser de 10 digitos."],
      [{ min: 10, max: 10 }]
    ),
    validateFields.validNumber(
      ["phoneNumber"],
      ["El numero celular debe ser numeríco"]
    ),
    validateFields.validName(
      ["name"],
      ["solo debe contener letras alfabeticas."]
    ),
    catchErrors,
  ],
  updateCustomer
);

router.delete("/:id", deleteCustomer);

module.exports = router;
