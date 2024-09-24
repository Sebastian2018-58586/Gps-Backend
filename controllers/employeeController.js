const { response, request } = require("express");
const db = require("../models");
const ModelController = require("./modelController");
const rutaImage = "public/data/uploads/employees";

const createEmployee = async (req = request, res = response) => {
  console.log("me cago en tus muertos")
  if (req.file) {
    const image = req.file.filename;
    console.log(image);
    req.body = { ...req.body, image };
    console.log(req.body);
  }
  await ModelController.create(
    req,
    res,
    db,
    "User",
    "Empleado",
    "numero de identificación"
  )
    .then((newEmployee) => {
      return res.status(200).json({
        ok: true,
        msg: `El empleado con nombre ${newEmployee.name} ha sido registrado.`,
      });
    })
    .catch((error) => {
      return res.status(400).json({
        ok: false,
        msg: error,
      });
    });
};

const findEmployee = async (req = request, res = response) => {
  const list = ["id", "name", "surname", "phoneNumber", "adress","image", "email"];
  await ModelController.findOne(req, res, db, "User", "Empleado", "id", list)
    .then((employee) => {
      return res.status(200).json({
        ok: true,
        obj: {
          id: employee.id,
          name: employee.name,
          surname: employee.surname,
          phoneNumber: employee.phoneNumber,
          adress: employee.adress,
          email: employee.email,
          image: employee.image,
        },
      });
    })
    .catch((error) => {
      return res.status(400).json({
        ok: false,
        msg: error,
      });
    });
};

const findEmployees = async (req = request, res = response) => {
  const list = ["id", "name", "surname", "adress", "phoneNumber"];
  await ModelController.findAll(req, res, db, "User", list);
};

const updateEmployee = async (req = request, res = response) => {
  try {
    const attributesToUpdate = [
      "name",
      "surname",
      "phoneNumber",
      "adress",
      "password",
    ];
    const attributesToSearch = [
      "id",
      "name",
      "surname",
      "phoneNumber",
      "adress",
      "image",
      "password",
    ];
    if (req.file) {
      console.log(req.file);
      const image = req.file.filename;
      req.body = { ...req.body, image };
      attributesToUpdate.push("image");
    }
    await ModelController.findOne(
      req,
      res,
      db,
      "User",
      "Empleado",
      "id",
      attributesToSearch
    ).then(async (employee) => {
      if (employee.image !== null) {
        const urlFileDelete = `${rutaImage}/${employee.image}`;
        ModelController.deleteFile(urlFileDelete);
      }
      attributesToUpdate.forEach((element) => {
        employee[element] = req.body[element];
      });
      await employee.save();
      return res.status(200).json({
        ok: true,
        msg: `El empleado ${employee.name} ${employee.surname} ha sido editado.`,
      });
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: `Debes comunicarte con el administrador.`,
    });
  }
};

const deleteEmployee = async (req = request, res = response) => {
  try {
    const attributesToSearch = ["id", "name", "surname", "image"];
    await ModelController.findOne(
      req,
      res,
      db,
      "User",
      "Empleado",
      "id",
      attributesToSearch
    ).then(async (employee) => {
      if (employee) {
        await employee.destroy();
        if (employee.image !== null) {
          const urlFileDelete = `${rutaImage}/${employee.image}`;
          ModelController.deleteFile(urlFileDelete);
        }
        return res.status(200).json({
          ok: true,
          mgs: `El Empleado ${employee.name} ${employee.surname}fue eliminado.`,
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
  createEmployee,
  findEmployee,
  deleteEmployee,
  updateEmployee,
  findEmployees,
};
