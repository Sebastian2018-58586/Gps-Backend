const { response, request } = require("express");
const db = require("../models");
const ModelController = require("./modelController");
const { Op, Sequelize } = require("sequelize");
const { countOrdersDone } = require("../socket/config");

const createSale = async (req = request, res = response) => {
  try {
    const { details, updateOrders } = req.body;
    const detailsParsed = JSON.parse(details);

    const newSale = await ModelController.create(
      req,
      res,
      db,
      "Sale",
      "venta",
      "nombre"
    );

    if (newSale) {
      const detailsSales = detailsParsed.map((detail) => ({
        amount: detail.amount,
        price: detail.price,
        idProduct: detail.Product.id,
        idSale: newSale.id,
      }));

      await db.Detail_sale.bulkCreate(detailsSales);

      if (updateOrders) {
        await countOrdersDone(res, db);
      }

      return res.status(200).json({
        ok: true,
        msg: `La venta ${newSale.name} ha sido registrada.`,
      });
    }
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "Debes comunicarte con el administrador.",
      error,
    });
  }
};

const findSale = async (req = request, res = response) => {
  try {
    const sale = await db.Sale.findOne({
      attributes: ["id", "name", "createdAt", "state", "total_price"],
      where: { id: req.params.id },
      include: [
        {
          model: db.User,
          attributes: ["id", "name", "adress", "surname", "phoneNumber"],
          required: false,
        },
      ],
    });

    if (!sale) {
      return res.status(400).json({
        ok: false,
        msg: "No se encontraron resultados",
      });
    }

    const details = await sale.getDetail_sales({
      attributes: ["amount", "price"],
      include: [
        {
          model: db.Product,
          attributes: ["id", "name", "price", "amount", "image"],
        },
      ],
    });

    return res.status(200).json({
      ok: true,
      obj: { ...sale.toJSON(), details },
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "Debes comunicarte con el administrador.",
      error,
    });
  }
};

const findSalesByCustomer = async (req = request, res = response) => {
  try {
    const orders = await db.Sale.findAll({
      where: { idCustomer: req.params.idCustomer },
      attributes: ["id", "name", "total_price", "createdAt"],
    });

    if (!orders.length) {
      return res.status(400).json({
        ok: false,
        msg: "El cliente todavía no ha agregado productos al carrito de compras.",
      });
    }

    return res.status(200).json({
      ok: true,
      list: orders,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "Debes comunicarte con el administrador.",
      error,
    });
  }
};

const findSales = async (req = request, res = response) => {
  try {
    const { name, createdAt, stateSale } = req.body;

    const objSearchCustomer = name ? { name: { [Op.like]: `%${name}%` } } : {};
    const objSearchElementsSale = {};

    if (createdAt) {
      const date = new Date(createdAt);
      objSearchElementsSale["createdAt"] = {
        [Op.and]: [
          Sequelize.where(
            Sequelize.fn("MONTH", Sequelize.col("createdAt")),
            date.getMonth() + 1
          ),
          Sequelize.where(
            Sequelize.fn("YEAR", Sequelize.col("createdAt")),
            date.getFullYear()
          ),
          Sequelize.where(
            Sequelize.fn("DAY", Sequelize.col("createdAt")),
            date.getDate()
          ),
        ],
      };
    }

    if (stateSale !== "todas") {
      objSearchElementsSale["state"] = stateSale;
    }

    const sales = await db.Sale.findAll({
      attributes: ["id", "name", "total_price", "state", "createdAt"],
      where: objSearchElementsSale,
      include: [
        {
          model: db.User,
          where: objSearchCustomer,
          attributes: ["id", "name", "adress", "surname", "phoneNumber"],
          required: Boolean(name),
        },
      ],
    });

    if (!sales.length) {
      return res.status(400).json({
        ok: false,
        msg: "No se encontraron resultados",
      });
    }

    return res.status(200).json({
      ok: true,
      list: sales,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "Debes comunicarte con el administrador.",
      error,
    });
  }
};

const updateSale = async (req = request, res = response) => {
  try {
    const { details } = req.body;
    const detailsParsed = JSON.parse(details);

    const sale = await ModelController.update(
      req,
      res,
      db,
      "Sale",
      "Venta",
      "id",
      ["state", "total_price", "idCustomer", "createdAt"]
    );

    if (sale) {
      await db.Detail_sale.destroy({ where: { idSale: sale.id } });
      const newDetails = detailsParsed.map((detail) => ({
        amount: detail.amount,
        price: detail.price,
        idProduct: detail.Product.id,
        idSale: sale.id,
      }));
      await db.Detail_sale.bulkCreate(newDetails);

      return res.status(200).json({
        ok: true,
        msg: `La venta con nombre ${sale.name} ha sido editada.`,
      });
    }
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "No se ha podido editar la venta.",
      error,
    });
  }
};

const deleteSale = async (req = request, res = response) => {
  try {
    await ModelController.delete(req, res, db, "Sale", "venta", "id");
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "No se ha podido eliminar la venta.",
      error,
    });
  }
};

module.exports = {
  createSale,
  findSale,
  findSales,
  updateSale,
  deleteSale,
  findSalesByCustomer,
};
