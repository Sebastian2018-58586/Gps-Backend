const { response, request } = require("express");
const db = require("../models");
const ModelController = require("./modelController");
const { Op, Sequelize } = require("sequelize");
const { countOrdersDone, countOrdersEarring } = require("../socket/config");
const createOrder = async (req = request, res = response) => {
  try {
    const { details } = req.body;
    const ArrayDetailsOrder = [];
    const details_parse = JSON.parse(details);
    await ModelController.create(req, res, db, "Order", "pedido", "nombre")
      .then(async (newOrder) => {
        if (newOrder) {
          console.log(details_parse);
          for (const detail of details_parse) {
            ArrayDetailsOrder.push({
              amount: detail.amount,
              price: detail.price,
              idProduct: detail.Product.id,
              idOrder: newOrder.id,
            });
          }
          console.log(ArrayDetailsOrder);
          await db.Detail_Order.bulkCreate(ArrayDetailsOrder);
          await countOrdersEarring(res, db, newOrder.id);
          return res.status(200).json({
            ok: true,
            msg: `El pedido ${newOrder.name} ha sido solicitado.`,
            obj: newOrder,
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

const findOrder = async (req = request, res = response) => {
  try {
    const listAttributes = ["id", "createdAt", "total_price"];
    const listAttributesUser = [
      "id",
      "name",
      "adress",
      "surname",
      "phoneNumber",
    ];
    const listAttributesDetails_Order = ["id", "amount", "price"];
    const listAttributesProduct = ["id", "name", "image"];
    const searchObj = { id: req.params.id };
    const order = await db.Order.findOne({
      attributes: listAttributes,
      where: searchObj,
      include: [
        {
          model: db.User,
          attributes: listAttributesUser,
          required: false,
        },
      ],
    });
    if (order) {
      const details = await order.getDetail_Orders({
        attributes: listAttributesDetails_Order,
        include: [
          {
            model: db.Product,
            attributes: listAttributesProduct,
          },
        ],
      });

      if (details) {
        return res.status(200).json({
          ok: true,
          obj: {
            id: order.id,
            name: order.name,
            state: order.state,
            createdAt: order.createdAt,
            total_price: order.total_price,
            Customer: order.User,
            details: details,
          },
        });
      }
    } else {
      return res.status(400).json({
        ok: false,
        msg: "No se encontraron resultados",
      });
    }
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "Debes comunicarte con el administrador.",
    });
  }
};

const getAmountDetailOrders = async (req = request, res = response) => {
  try {
    const idCustomer = req.params.idCustomer;
    const objSearch = { state: "pendiente", idCustomer };
    const { count, rows } = await db.Detail_Order.findAndCountAll({
      attributes: ["id", "amount", "price"],
      include: [
        {
          model: db.Order,
          where: objSearch,
        },
        {
          model: db.Product,
          attributes: ["id", "name", "description"],
        },
      ],
    });
    if (count || count === 0) {
      return res.status(200).json({
        ok: true,
        count,
        rows,
      });
    }
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "Debes comunicarte con el administrador.",
    });
  }
};
const getAMountOrders = async (req = request, res = response) => {
  try {
    const objSearch = { state: "pagado" };
    const { count } = await db.Order.findAndCountAll({
      where: objSearch,
    });
    if (count || count === 0) {
      return res.status(200).json({
        ok: true,
        count,
      });
    }
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "Debes comunicarte con el administrador.",
    });
  }
};

const findDetailsOrderByCustomer = async (req = request, res = response) => {
  try {
    const attributesToSearchProduct = ["id", "name", "image"];
    const attributesToSearchDetailsSale = ["id", "amount", "price"];
    const attributesToSearchOrder = ["id"];
    const idCustomer = req.params.idCustomer;
    const order = await db.Order.findOne({
      where: { idCustomer },
      attributes: attributesToSearchOrder,
    });
    if (order) {
      detailsOrder = await order.getDetail_Orders({
        attributes: attributesToSearchDetailsSale,
        include: [{ model: db.Product, attributes: attributesToSearchProduct }],
      });

      return res.status(200).json({
        ok: true,
        obj: {
          id: order.id,
          detail: detailsOrder,
        },
      });
    } else {
      return res.status(400).json({
        ok: false,
        msg: "El cliente todavia no ha agregado productos al carrito de compras.",
      });
    }
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "Debes comunicarte con el administrador.",
    });
  }
};

const findOrders = async (req = request, res = response) => {
  try {
    const listAttributes = ["id", "name", "total_price", "state", "createdAt"];
    const listAttributesCustomer = ["id", "name", "surname"];
    const objSearchElementsOrder = {};
    if (req.body.idCustomer !== undefined) {
      objSearchElementsOrder["idCustomer"] = req.body.idCustomer;
    }
    objSearchElementsOrder["state"] = { [Op.or]: req.body.stateOrder };
    if (req.body.createdAt !== "") {
      const date = new Date(req.body.createdAt);
      objSearchElementsOrder["createdAt"] = {
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

    const orders = await db.Order.findAll({
      attributes: listAttributes,
      where: objSearchElementsOrder,
      order:[["createdAt","DESC"]],
      include: [
        {
          model: db.User,
          attributes: listAttributesCustomer,
        },
      ],
    });
    if (orders) {
      return res.status(200).json({
        ok: true,
        list: orders,
      });
    } else {
      return res.status(400).json({
        ok: false,
        msg: "No se encontraron resultados",
      });
    }
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "Debes comunicarte con el administrador.",
    });
  }
};

const updateDetailOrder = async (req = request, res = response) => {
  try {
    const { details } = req.body;
    const ArrayDetailsOrder = [];
    const attributesToSearch = ["id", "name", "total_price"];
    const details_parse = JSON.parse(details);
    await ModelController.findOne(
      req,
      res,
      db,
      "Order",
      "Pedido",
      "id",
      attributesToSearch
    ).then(async (order) => {
      if (order) {
        const detailOrder = {};
        for (const detail of details_parse) {
          detailOrder["amount"] = detail.amount;
          detailOrder["price"] = detail.price;
          detailOrder["idProduct"] = detail.Product.id;
          detailOrder["idOrder"] = order.id;
        }
        const details_order = await order.getDetail_Orders({
          attributes: ["id", "idProduct"],
        });
        if (details_order) {
          for (const detail of details_order) {
            if (detail.idProduct === details_parse[0].Product.id) {
              detailOrder["id"] = detail.id;
            }
          }
          ArrayDetailsOrder.push(detailOrder);
          await db.Detail_Order.bulkCreate(ArrayDetailsOrder, {
            updateOnDuplicate: ["id", "amount", "price"],
          });
          await countOrdersEarring(res, db, order.id);
          return res.status(200).json({
            ok: true,
            msg: "Se han agregado los productos",
            obj: order,
          });
        }
      }
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "Debes comunicarte con el administrador.",
    });
  }
};

const updateOrder = async (req = request, res = response) => {
  try {
    const attributesToSearch = ["id", "state", "total_price"];
    await ModelController.findOne(
      req,
      res,
      db,
      "Order",
      "Pedido",
      "id",
      attributesToSearch
    ).then(async (order) => {
      if (order) {
        const detailsOrder = await order.getDetail_Orders({
          attributes: ["price"],
        });
        let total_price = 0;
        for (const detail of detailsOrder) {
          total_price = total_price + detail.price;
        }
        order.total_price = total_price;
        order.state = req.body.state;
        console.log(total_price);
        await order.save();
        await countOrdersEarring(res, db, order.id);
        await countOrdersDone(res, db);
        return res.status(200).json({
          ok: true,
          msg: "El pedido se ha realizado",
        });
      }
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "No se ha podido editar la venta.",
      error,
    });
  }
};

const deleteOrder = async (req = request, res = response) => {
  ModelController.delete(req, res, db, "Order", "venta", "id");
};
const deleteDetailOrder = async (req = request, res = response) => {
  try {
    const attributesToSearch = ["id", "idOrder"];
    console.log("epa");
    await ModelController.findOne(
      req,
      res,
      db,
      "Detail_Order",
      "detalle del pedido",
      "id",
      attributesToSearch
    ).then(async (detailOrder) => {
      if (detailOrder) {
        await detailOrder.destroy();
        await countOrdersEarring(res, db, detailOrder.idOrder);
        return res.status(200).json({
          ok: true,
          msg: "El detalle ha sido eliminado",
        });
      }
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "No se ha podido editar la venta.",
      error,
    });
  }
};

module.exports = {
  createOrder,
  findOrder,
  findOrders,
  updateOrder,
  deleteOrder,
  getAMountOrders,
  findDetailsOrderByCustomer,
  getAmountDetailOrders,
  deleteDetailOrder,
  updateDetailOrder,
};
