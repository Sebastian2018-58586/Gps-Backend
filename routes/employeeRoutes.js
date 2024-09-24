const { Router } = require("express");
const multer = require("multer");
const {
  createEmployee,
  updateEmployee,
  findEmployee,
  findEmployees,
  deleteEmployee,
} = require("../controllers/employeeController.js");
const validateFields = require("../validations/validate-fields");
const { catchErrors } = require("../middlewares/catchErrors.js");
const router = Router();
const path = require("path");
const fs = require("fs");
const date = Date.now();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('epa');
    let dir = `public/data/uploads/employees`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const filename =`${req.body?.name.replace(/\s+/g, "")}-image-${date}` + path.extname(file.originalname);

    cb(null, filename);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file) {
      cb(null, true);
    } else {
      cb(null, false); 
    }
  },
});
const fields = [
  "id",
  "name",
  "surname",
  "phoneNumber",
  "adress",
  "email",
  "password",
];
const nameFields = [
  "La identificacion",
  "El nombre",
  "El apellido",
  "El numero celular",
  "La dirección",
  "El correo",
  "La contraseña",
];

router.post(
  "/new",
  upload.single('file'),
  [
    validateFields.isEmpty(fields, nameFields),
    validateFields.isLength(
      ["id", "phoneNumber"],
      [
        "La identificación debe ser de 7,8 o 10 digitos",
        "El numero de celular debe ser de 10 digitos.",
      ],
      [
        { min: 7, max: 10 },
        { min: 10, max: 10 },
      ]
    ),
    validateFields.validNumber(
      ["id", "phoneNumber"],
      [
        "La identificación debe ser numeríca",
        "El numero celular debe ser numeríco",
      ]
    ),
    validateFields.validName(["name", "surname"], ["El nombre", "El apellido"]),
    catchErrors,
  ],
  createEmployee
);

router.get("/:id", findEmployee);

router.post("/empleados/", findEmployees);

router.put(
  "/edit/:id",
  upload.single('file'),
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
    validateFields.validName(["name", "surname"], ["El nombre", "El apellido"]),
    catchErrors,
  ],
  updateEmployee
);

router.delete("/:id", deleteEmployee);

module.exports = router; 
