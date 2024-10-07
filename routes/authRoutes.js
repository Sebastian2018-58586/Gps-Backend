const { Router } = require("express");
const multer = require("multer");
const { check } = require("express-validator");
const { createUser, loginUser, revalidateToken, UpdateUser } = require("../controllers/authController");
const { catchErrors } = require("../middlewares/catchErrors");
const validateFields = require('../validations/validate-fields');
const { validateJWT } = require("../middlewares/validate-jwt");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dir = `public/data/uploads/profiles`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    cb(null, dir); 
  },
  filename: function (req, file, cb) {
    console.log(req.body);
    const filename =`${req.body?.name.replace(/\s+/g, "")}-image-${Date.now()}` + path.extname(file.originalname);
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
//Inicialización de la variable para el enrutamiento de los metodos correspondientes del usuario(Administrador, Cliente)
const router = Router();

//inicializacion de las variables para la validación del usuario 
const fields= ['name','email','password','phoneNumber','adress'];
const nameFields=['El nombre','El correo','La contraseña','El numero celular','La dirección'];
const fieldsEdit= ['password','phoneNumber','adress'];
const nameFieldsEdit=['La contraseña','El numero celular','La dirección'];
const fieldsLength=['password','phoneNumber'];
const fieldsLengthMsgs=['La contraseña debe tener minimo 8 digitos.','El numero de celular debe ser de 10 digitos.'];
const Lenghts =[{min:8},{min:10,max:10}];


//metodo post para la creación de un usuario
router.post(
  "/new",
  [
    validateFields.isEmpty(fields,nameFields),
    validateFields.isEmail(),
    validateFields.isLength(fieldsLength,fieldsLengthMsgs,Lenghts),
    validateFields.validNumber(['phoneNumber'],['El numero celular debe ser numeríco']),
    validateFields.validName(['name'],['El nombre solo debe contener letras alfabeticas.']),
    catchErrors
  ],
  createUser
);
//Login de usuario
const fieldsLogin= ['email','password'];
const nameFieldsLogin=['El correo','La contraseña'];
router.post(
    "/",
    [
      validateFields.isEmpty(fieldsLogin,nameFieldsLogin),
      validateFields.isEmail(),
      check("password", "La contraseña debe tener más de 8 caracteres.").isLength({ min: 8 }),
      catchErrors,
    ],
    loginUser
  );
  
router.put("/edit/:id",upload.single('file'),[
  validateFields.isEmpty(fieldsEdit,nameFieldsEdit),
  validateFields.isLength(fieldsLength,fieldsLengthMsgs,Lenghts),
  validateFields.validNumber(['phoneNumber'],['El numero celular debe ser numeríco']),
  catchErrors
],UpdateUser)
//Validar y revalidar token
router.get("/renew", validateJWT, revalidateToken);
module.exports = router;