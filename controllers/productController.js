const { request, response } = require("express");
const db = require("../models");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const rutaImages = "public/data/uploads";
const ModelController = require("./modelController");

const createProduct = async (req = request, res = response) => {
  const fileUndefined = Object.keys(req.files).length === 0;
  if (fileUndefined === false) {
    console.log(req.files.singleFile[0].filename);
    const image = req.files.singleFile[0].filename;
    req.body = { ...req.body, image };
    let images = "";
    for (let index = 0; index < req.files.multipleFiles.length; index++) {
      const element = req.files.multipleFiles[index].filename;
      if (index === req.files.multipleFiles.length - 1) {
        images = images + `${element}`;
      } else {
        images = images + `${element},`;
      }
    }

    req.body = { ...req.body, images };
  }
console.log(req.body);  
  await ModelController.create(req, res, db, "Product", "Producto", "Codigo")
    .then((newProduct) => {
      return res.status(200).json({
        ok: true,
        msg: `El producto con nombre ${newProduct.name} ha sido registrado.`,
        obj: newProduct,
      });
    })
    .catch((error) => {
      return res.status(400).json({
        ok: false,
        msg: error,
      });
    });

}


function deleteFolder(product) {
  const FOLDER_TO_REMOVE = path.join(
    `${rutaImages}/${product.name.replace(/\s+/g, "")}`
  );
  if (fs.existsSync(FOLDER_TO_REMOVE)) {
    fs.readdirSync(FOLDER_TO_REMOVE).forEach((file) => {
      const curPath = FOLDER_TO_REMOVE + "/" + file;

      if (fs.lstatSync(curPath).isDirectory()) {
        // Recursivamente eliminar subcarpetas
        deleteFolderRecursive(curPath);
      } else {
        // Eliminar archivo
        fs.unlinkSync(curPath);
      }
    });
    // Eliminar carpeta vacía
    fs.rmdirSync(FOLDER_TO_REMOVE);
  }
}

const findProductByName = async (req = request, res = response) => {
  try {
    const attributesToSearch = [
      "id",
      "name",
      "description",
      "price",
      "amount",
      "image",
      "images",
      "idCategory",
    ];
    await ModelController.findOne(
      req,
      res,
      db,
      "Product",
      "producto",
      "name",
      attributesToSearch
    )
      .then((product) => {
        if (product) {
          return res.status(200).json({
            ok: true,
            obj : {
              id: product.id,
              name: product.name,
              description: product.description,
              price: product.price,
              amount: product.amount,
              image: product.image,
              images: product.images,
            }
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
      msg: "Debes comunicarte con el administrador",
    });
  }
};

const findProduct = async (req = request, res = response) => {
  try {
    let obj;
    const attributesToSearch = [
      "id",
      "name",
      "description",
      "price",
      "amount",
      "image",
      "images",
      "idCategory",
    ];
    await ModelController.findOne(
      req,
      res,
      db,
      "Product",
      "producto",
      "id",
      attributesToSearch
    )
      .then((product) => {
        if (product.idCategory === 2) {
          obj = {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
            amount: product.amount,
            image: product.image,
            images: product.images,
          };
          return res.status(200).json({
            ok: true,
            obj,
          });
        } else {
          obj = {
            id: product.id,
            name: product.name,
            price: product.price,
            amount: product.amount,
          };

          return res.status(200).json({
            ok: true,
            obj,
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
      msg: "Debes comunicarte con el administrador",
    });
  }
};

const findProducts = async (req = request, res = response) => {
  const list = ["id", "name", "amount", "price", "image"];
  await ModelController.findAll(req, res, db, "Product", list);
};

const updateProduct = async (req = request, res = response) => {
  try {
    const fileUndefined = Object.keys(req.files).length === 0;
    if (fileUndefined === false) {
      if(req.files.singleFile !== undefined){
        const image = req.files.singleFile[0].filename;
        req.body = { ...req.body, image };
      }
      if(req.files.multipleFiles !== undefined){
        let images = "";
        for (let index = 0; index < req.files.multipleFiles.length; index++) {
          const element = req.files.multipleFiles[index].filename;
          if (index === req.files.multipleFiles.length - 1) {
            images = images + `${element}`;
          } else {
            images = images + `${element},`; 
          }
        }
        req.body = { ...req.body, images };
      }
    }
    const attributesToSearch = [
      "id",
      "name",
      "description",
      "price",
      "amount",
      "image",
      "images",
      "idCategory",
    ];
    let attributesToUpdate = [];
    await ModelController.findOne(
      req,
      res,
      db,
      "Product",
      "producto",
      "id",
      attributesToSearch
    ).then(async (product) => {
      if (product) {
        if (product.idCategory === 2 && fileUndefined === false) {
          attributesToUpdate = [
            "name",
            "description",
            "price",
            "amount",
          ];
          if(req.files.singleFile !== undefined){
            attributesToUpdate.push('image')
            const urlFileDelete = `${rutaImages}/${product.name.replace(
              /\s+/g,
              ""
            )}/${product.image}`;
            ModelController.deleteFile(urlFileDelete); 
          }
          if(req.files.multipleFiles !== undefined){ 
            attributesToUpdate.push('images');
            const images = product.images.split(","); 
            images.forEach((element) => {
              const urlFilesDelete = `${rutaImages}/${product.name.replace(
                /\s+/g,
                ""
              )}/${element}`;
              ModelController.deleteFile(urlFilesDelete);
            });
          }
        } else {
          attributesToUpdate = ["name", "price", "amount","description"];
        }
        attributesToUpdate.forEach((element) => {
          product[element] = req.body[element]|| null;
        });
        await product.save();
        return res.status(200).json({
          ok: true,
          msg: `El Producto ${product.name} ha sido editado.`,
        });
      }
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "Debes comunicarte con el administrador",
    });
  }
};

const deleteProduct = async (req = request, res = response) => {
  try {
    const attributesToSearch = ["id", "name", "image", "idCategory"];
    await ModelController.findOne(
      req,
      res,
      db,
      "Product",
      "producto",
      "id",
      attributesToSearch
    ).then(async (product) => {
      if (product) {
        await product.destroy();
        if (product.idCategory == 2) {
          deleteFolder(product);
        }
        return res.status(200).json({
          ok: true,
          mgs: `El Producto ${product.name} fue eliminado.`,
        });
      }
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "Debes comunicarte con el administrador",
    });
  }
};

module.exports = {
  createProduct,
  findProduct,
  updateProduct,
  deleteProduct,
  findProducts,
  findProductByName
};
