const { response, request } = require("express");
const db = require("../models");
const ModelController = require("./modelController");

const createCategory = async (req = request, res = response) => {
  await ModelController.create(req, res, db, "Category", "categoría", "nombre")
    .then((newCategory) => {
      return res.status(200).json({
        ok: true,
        msg: `La categoria con nombre ${newCategory.name} ha sido registrada.`,
      });
    })
    .catch((error) => {
      res.status(400).json({
        ok: false,
        msg: error,
      });
    });
};

const findCategory = async (req = request, res = response) => {
  const list = ["id", "name", "state", "description"];
  await ModelController.findOne(
    req,
    res,
    db,
    "Category",
    "categoría",
    "id",
    list
  )
    .then((category) => {
      return res.status(200).json({
        ok: true,
        obj: { id: category.id, name: category.name },
      });
    })
    .catch((error) => {
      return res.status(400).json({
        ok: false,
        msg: error ,
      });
    });
};

const updateCategory = async (req = request, res = response) => {
  const list = ["name", "state", "description"];
  await ModelController.update(req,res,db,"Category","categoría","id",list).then(
    (category)=>{
      return res.status(200).json({
        ok: true,
        msg:`La categoria con nombre ${category.name} ha sido editado.`
      })
    }
  ).catch(
    error=>{
      return res.status(400).json({
        ok:false,
        msg:error
      })
    }
  );
};

const deleteCategory = async (req = request, res = response) => {
  await ModelController.delete(req, res, db, "Category", "categoría", "id");
};

module.exports = {
  createCategory,
  findCategory,
  updateCategory,
  deleteCategory,
};
