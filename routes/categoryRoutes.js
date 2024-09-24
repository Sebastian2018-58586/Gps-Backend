const { Router } = require("express");
const { createCategory, findCategory, updateCategory, deleteCategory } = require("../controllers/categoryController");
const {catchErrors} = require('../middlewares/catchErrors');
const validateFields = require('../validations/validate-fields')

//Inicialización de la variable para el enrutamiento de los metodos correspondientes de las categorias de un producto
const router = Router();

//inicialización de las variables para la validación de los atributos de una categoria 
const fieldsValidate= ['name','state','description'];
const fieldsNameValidate= ['El nombre','El estado','La descripción'];

//metodo post para la creación de una categoría
router.post('/new',[
    validateFields.isEmpty(fieldsValidate,fieldsNameValidate),
    validateFields.validName(['name'],['El nombre solo debe tener letras alfabeticas.']),
    catchErrors
], createCategory);

//metodo get para la busqueda de una categoría
router.get('/:id',findCategory);

//metodo put para la edición de una categoría
router.put('/edit/:id',[
    validateFields.isEmpty(fieldsValidate,fieldsNameValidate),
    validateFields.validName(['name'],['El nombre solo debe tener letras alfabeticas.']),
    catchErrors
],updateCategory);

//metodo delete para la busqueda de una categoría
router.delete('/:id',deleteCategory);

module.exports =router