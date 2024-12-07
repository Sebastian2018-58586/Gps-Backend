const { request, response } = require("express");
const db = require("../models");
const { Op } = require("sequelize");
const fs = require("fs");
const path = require("path");
const rutaImages = "public/data/uploads";
const ModelController = require("./modelController");

/**
 * Helper para concatenar nombres de archivos en una cadena separada por comas.
 */
const getConcatenatedFileNames = (files) =>
  files.map((file) => file.filename).join(",");

/**
 * Helper para eliminar una carpeta y su contenido.
 */
const deleteFolder = (folderPath) => {
  if (fs.existsSync(folderPath)) {
    fs.readdirSync(folderPath).forEach((file) => {
      const curPath = path.join(folderPath, file);
      fs.lstatSync(curPath).isDirectory()
        ? deleteFolder(curPath)
        : fs.unlinkSync(curPath);
    });
    fs.rmdirSync(folderPath);
  }
};

const createProduct = async (req = request, res = response) => {
  try {
    if (req.files && Object.keys(req.files).length > 0) {
      const { singleFile, multipleFiles } = req.files;

      if (singleFile) {
        req.body.image = singleFile[0].filename;
      }

      if (multipleFiles) {
        req.body.images = getConcatenatedFileNames(multipleFiles);
      }
    }

    const newProduct = await ModelController.create(
      req,
      res,
      db,
      "Product",
      "Producto",
      "Codigo"
    );
    return res.status(200).json({
      ok: true,
      msg: `El producto con nombre ${newProduct.name} ha sido registrado.`,
      obj: newProduct,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: error.message,
    });
  }
};

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

    const product = await ModelController.findOne(
      req,
      res,
      db,
      "Product",
      "producto",
      "name",
      attributesToSearch
    );

    if (product) {
      const responseObj = {
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
        obj: responseObj,
      });
    }
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "Debes comunicarte con el administrador",
    });
  }
};

const findProducts = async (req = request, res = response) => {
  try {
    const attributes = ["id", "name", "amount", "price", "image"];
    await ModelController.findAll(req, res, db, "Product", attributes);
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "Debes comunicarte con el administrador",
    });
  }
};

const updateProduct = async (req = request, res = response) => {
  try {
    const { files, body } = req;
    const hasFiles = files && Object.keys(files).length > 0;

    const product = await ModelController.findOne(
      req,
      res,
      db,
      "Product",
      "producto",
      "id",
      ["id", "name", "description", "price", "amount", "image", "images", "idCategory"]
    );

    if (!product) throw new Error("Producto no encontrado");

    const attributesToUpdate = ["name", "description", "price", "amount"];

    if (hasFiles) {
      if (files.singleFile) {
        const imagePath = path.join(
          rutaImages,
          product.name.replace(/\s+/g, ""),
          product.image
        );
        ModelController.deleteFile(imagePath);
        body.image = files.singleFile[0].filename;
        attributesToUpdate.push("image");
      }

      if (files.multipleFiles) {
        const imagesPaths = product.images.split(",").map((img) =>
          path.join(rutaImages, product.name.replace(/\s+/g, ""), img)
        );
        imagesPaths.forEach(ModelController.deleteFile);
        body.images = getConcatenatedFileNames(files.multipleFiles);
        attributesToUpdate.push("images");
      }
    }

    attributesToUpdate.forEach((attr) => (product[attr] = body[attr] || product[attr]));
    await product.save();

    return res.status(200).json({
      ok: true,
      msg: `El Producto ${product.name} ha sido editado.`,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: error.message || "Debes comunicarte con el administrador",
    });
  }
};

const deleteProduct = async (req = request, res = response) => {
  try {
    const product = await ModelController.findOne(
      req,
      res,
      db,
      "Product",
      "producto",
      "id",
      ["id", "name", "image", "idCategory"]
    );

    if (!product) throw new Error("Producto no encontrado");

    await product.destroy();

    if (product.idCategory == 2) {
      const folderPath = path.join(
        rutaImages,
        product.name.replace(/\s+/g, "")
      );
      deleteFolder(folderPath);
    }

    return res.status(200).json({
      ok: true,
      msg: `El Producto ${product.name} fue eliminado.`,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: error.message || "Debes comunicarte con el administrador",
    });
  }
};

module.exports = {
  createProduct,
  findProductByName,
  findProducts,
  updateProduct,
  deleteProduct,
};
