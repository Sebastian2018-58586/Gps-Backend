const { Router } = require("express");
const multer = require("multer");
const { catchErrors } = require("../middlewares/catchErrors");
const path = require("path");
const fs = require("fs");
const date = Date.now();
const validateFields = require("../validations/validate-fields");
const {
  createProduct,
  findProduct,
  updateProduct,
  deleteProduct,
  findProducts,
  findProductByName,
} = require("../controllers/productController");
const router = Router();
function eliminarDiacriticos(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g,"");
}
let bucle = 0;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let nameRoute = eliminarDiacriticos(req.body?.name.replace(/\s+/g,""));
    let nameUseRoute = nameRoute.replace(/\//g, "-");
    let dir = `public/data/uploads/${nameUseRoute}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    } 
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    let filename = "";

    if (file.fieldname === "singleFile") {
      let nameRoute = eliminarDiacriticos(req.body?.name.replace(/\s+/g,""));
      let nameUseRoute = nameRoute.replace(/\//g, "-");
      filename =
        `${nameUseRoute}-image-${date}` +
        path.extname(file.originalname);
    } else {
      bucle += 1;
      let nameRoute = eliminarDiacriticos(req.body?.name.replace(/\s+/g,""));
      let nameUseRoute = nameRoute.replace(/\//g, "-");
      filename =
        `${nameUseRoute}-images-${date}${bucle}` +
        path.extname(file.originalname);
    }
    cb(null, filename);
  },
});
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (req.body.idCategory == "2" && file) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});
const updaloadMultiple = upload.fields([
  { name: "singleFile", maxCount: 1 },
  { name: "multipleFiles", maxCount: 4 },
]);
const fieldsValidate = ["name", "price", "amount"];
const fieldsNameValidate = ["El nombre", "El precio", "La cantidad"];
router.post(
  "/new",
  updaloadMultiple,
  [
    validateFields.isEmpty(fieldsValidate, fieldsNameValidate),
    validateFields.validNumber(
      ["price"],
      ["El precio solo debe tener numeros."]
    ),
    catchErrors,
  ],
  createProduct
);
router.get("/:id", findProduct);
router.get("/name/:name", findProductByName); 
router.post("/products", findProducts);
router.put(
  "/edit/:id",
  updaloadMultiple,
  [
    validateFields.isEmpty(fieldsValidate, fieldsNameValidate),
    validateFields.validNumber(
      ["price"],
      ["El precio solo debe tener numeros."]
    ),
    catchErrors,
  ],
  updateProduct
);
router.delete("/:id", deleteProduct);

module.exports = router;
