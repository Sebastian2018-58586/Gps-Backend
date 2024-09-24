const { response, request } = require("express");
const db = require("../models");
const ModelController = require("./modelController");
const { where } = require("sequelize");

const createSupplier = async (req = request, res = response) => {
  try {
    const { products } = req.body;
    const supplierproducts = JSON.parse(products);
    console.log(supplierproducts);
    await ModelController.create(
      req,
      res,
      db,
      "Supplier",
      "proveedor",
      "nombre"
    )
      .then(async (newSupplier) => {
        if (newSupplier) {
          for (let index = 0; index < supplierproducts.length; index++) {
            supplierproducts[index]['idSupplier']= newSupplier.id;
          }
          await db.Product.bulkCreate(supplierproducts) 
          return res.status(200).json({
            ok: true,
            msg: `El proveedor con nombre ${newSupplier.name} ha sido registrado.`,
          });
        }
      })
      .catch((error) => {
        return res.status(400).json({
          ok: false,
          msg: error,
        });
      });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: error,
    });
  }
};

const findSupplier = async (req = request, res = response) => {
  const listAttributes = ["id", "name", "phoneNumber", "adress"];
  const listAttributesProducts = ["id", "name", "amount", "price"];
  await ModelController.findOne(
    req,
    res,
    db,
    "Supplier",
    "proveedor",
    "id",
    listAttributes
  ).then(async (supplier) => {
    const products = await supplier.getProducts({
      attributes: listAttributesProducts,
    });
    if (products) {
      return res.status(200).json({
        ok: true,
        obj: {
          id: supplier.id,
          name: supplier.name,
          phoneNumber: supplier.phoneNumber,
          adress: supplier.adress,
          products,
        },
      });
    }
  });
};

const findSuppliers = async (req = request, res = response) => {
  const listAttributes = ["id", "name", "adress", "phoneNumber"];
  await ModelController.findAll(req, res, db, "Supplier", listAttributes);
};



const updateSupplier = async (req = request, res = response) => {
  try {
    const { products } = req.body;
    const Supplierproducts = JSON.parse(products);
    const attributes = ["name", "phoneNumber", "adress"];
    await ModelController.update(
      req,
      res,
      db,
      "Supplier",
      "proveedor",
      "id",
      attributes
    )
      .then(async (supplier) => {
        if(supplier){
          for (const product of Supplierproducts) {
            const getProduct = db.Product.findOne({where:{id:product.id}})
            if(getProduct){
              getProduct.name= product.name;
              getProduct.amount = product.amount;
              getProduct.price= product.price;
            }else{
              await supplier.createProduct(product)
            }
          }
          console.log('epa');
          return res.status(200).json({
            ok: true,
            msg: `El proveedor con nombre ${supplier.name} ha sido editado.`,
          });
        }
      })
      .catch((err) => {
        return res.status(400).json({
          ok: false,
          msg: err,
        });
      });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "Debes comunicarte con el administrador.",
    });
  }
};

const deleteSupplier = async (req = request, res = response) => {
  ModelController.delete(req, res, db, "Supplier", "proveedor", "id");
};

module.exports = {
  createSupplier,
  findSupplier,
  findSuppliers,
  updateSupplier,
  deleteSupplier,
};
