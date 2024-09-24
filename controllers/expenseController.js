const { response, request } = require("express");
const db = require("../models");
const { Op, Sequelize } = require("sequelize");
const ModelController = require("./modelController");

const createExpense = async (req = request, res = response) => {
  try {
    const { details } = req.body;
    const details_parse = JSON.parse(details);
    await ModelController.create(req, res, db, "Expense", "gasto", "nombre")
      .then(async (newExpense) => {
        if (newExpense) {
         
          for (const detail of details_parse) {
            await newExpense.createDetail_expense({
              amount: detail.amount,
              price: detail.price,
              use:detail.use, 
              idProduct: detail.Product.id,  
            });
          }
          console.log(newExpense);
          return res.status(200).json({
            ok: true,
            msg: `El gasto ${newExpense.name} ha sido registrado.`, 
          });
        }
      })
      .catch((error) => {
        return res.status(200).json({
          ok: false,
          msg: error,
        });
      });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "No se pudo registrar el gasto.", 
    });
  }
};

const findExpense = async (req = request, res = response) => {
  const listAttributes = ["id", "createdAt", "total_price"];
  const listAttributesProduct = ["id", "name", "amount", "price"];
  const listAttributesDetails_Expense = ["id", "price", "amount"];
  const listAttributesSupplier = ["id", "name", "adress","phoneNumber"];
  await ModelController.findOne(
    req,
    res,
    db,
    "Expense",
    "Gasto",
    "id",
    listAttributes
  )
    .then(async (getExpense) => {
      if (getExpense) {
        const details = await getExpense.getDetail_expenses({
          attributes: listAttributesDetails_Expense,
          include: [
            {
              model: db.Product,
              attributes: listAttributesProduct,
              include:[
                {
                  model: db.Supplier,
                  attributes: listAttributesSupplier,
                  required: false,
                }
              ]
            },
          ],
        });
        const detail_manufactures = await getExpense.getDetail_manufactures();
        console.log(detail_manufactures)
        let editExpense = true;
        if(detail_manufactures.length > 0){
          editExpense= false;
        }
        if(details){
          return res.status(200).json({
            ok: true,
            obj: {
              id: getExpense.id,
              createdAt: getExpense.createdAt,
              total_price: getExpense.total_price,
              editExpense,
              details: details,
            },
          });
        }

      }
    })
    .catch((error) => {
      return res.status(400).json({
        ok: false,
        msg: error,
      });
    });
};

const findExpenses = async (req = request, res = response) => {
  try {
    const listAtributesSearch = ["id", "name", "total_price", "createdAt"];
    const objSearchElementsExpense = {};
    if (req.body.createdAt !== "") {
      const date = new Date(req.body.createdAt);
      objSearchElementsExpense["createdAt"] = {
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
    const expenses = await db.Expense.findAll({
      attributes: listAtributesSearch,
      where: objSearchElementsExpense
    });
    if (expenses) {
      return res.status(200).json({
        ok: true,
        list: expenses,
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
      msg: "Debes comunicarte con el administrador",
    });
  }
};
const updateExpense = async (req = request, res = response) => {
  try {
    console.log('edit');
    const { details } = req.body;
    const details_parse = JSON.parse(details);
    const listAttributes = ["createdAt", "total_price"];
    await ModelController.update(
      req,
      res,
      db,
      "Expense",
      "Gasto",
      "id",
      listAttributes
    ).then(async (expense) => {
      if(expense){
        const getDetails = await expense.getDetail_expenses();
        if(getDetails){
          for (const detail of getDetails) {
              await db.Detail_expense.destroy({
                where:{id:detail.id}
              });
          }
        }
         for (const detailUpdate of details_parse) {
          await expense.createDetail_expense({amount:detailUpdate.amount,price:detailUpdate.price,idProduct:detailUpdate.Product.id});
         }
         return res.status(200).json({
           ok: true,
           msg: `El gasto con nombre ${expense.name} ha sido editado.`,
         });
      }
    }).catch((err) => {
      return res.status(400).json({
        ok: false,
        msg: err,
      });
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "No se ha podido editar el gasto.",
      error,
    });
  }
};

const deleteExpense = async (req = request, res = response) => {
  await ModelController.delete(req, res, db, "Expense", "gasto", "id");
};

module.exports = {
  createExpense,
  updateExpense,
  findExpense,
  deleteExpense,
  findExpenses,
};
