const { response, request } = require("express");
const db = require("../models");
const ModelController = require("./modelController");

const createCustomer = async (req = request, res = response) => {
  await ModelController.create(
    req,
    res,
    db,
    "User",
    "Cliente",
    "nombre y apellido"
  )
    .then((newCustomer) => {
      return res.status(200).json({
        ok: true,
        msg: `El cliente con nombre ${newCustomer.name} ha sido registrado.`,
      });
    })
    .catch((error) => {
      return res.status(400).json({
        ok: false,
        msg: error,
      });
    });
};

const findCustomer = async (req = request, res = response) => {
  const list = ["id", "name", "surname", "phoneNumber", "adress"];
  await ModelController.findOne(req, res, db, "User", "Cliente", "id", list)
    .then((customer) => {
      return res.status(200).json({
        ok: true,
        obj: {
          id: customer.id,
          name: customer.name,
          surname: customer.surname,
          phoneNumber: customer.phoneNumber,
          adress: customer.adress,
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

const findCustomers = async (req = request, res = response) => {
  const list = ["id", "name", "surname", "adress", "phoneNumber"];
  await ModelController.findAll(req, res, db, "User", list, list);
};

const updateCustomer = async (req = request, res = response) => {
  const list = ["name", "surname", "phoneNumber", "adress"];
  await ModelController.update(
    req,
    res,
    db,
    "User",
    "Cliente",
    "id",
    list,
  )
    .then((customer) => {
      return res.status(200).json({
        ok: true,
        msg: `El cliente con nombre ${customer.name} ha sido editado.`,
      });
    })
    .catch((error) => {
      return res.status(400).json({
        ok: false,
        msg: error,
      });
    }); 
};

const deleteCustomer = async (req = request, res = response) => {
  await ModelController.delete(req, res, db, "User", "Cliente", "id");
};
module.exports = {
  createCustomer,
  findCustomer, 
  deleteCustomer,
  updateCustomer,
  findCustomers,
};
