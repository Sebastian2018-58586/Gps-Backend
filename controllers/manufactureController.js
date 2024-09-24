const { response, request } = require("express");
const db = require("../models");
const { QueryTypes, Sequelize, Op } = require("sequelize");

const ModelController = require("./modelController");
const createManufacture = async (req = request, res = response) => {
  try {
    const { details } = req.body;
    const idExpenses = [];
    const updateDetailsExpense = [];
    const ArrayDetailsManufacture = [];
    const details_parse = JSON.parse(details);
    console.log(details_parse);
    await ModelController.create(
      req,
      res,
      db,
      "Manufacture",
      "manufactura",
      "nombre"
    )
      .then(async (newManufacture) => {
        if (newManufacture) {
          for (const detail of details_parse) {
            if (detail.category !== "manufacture") {
              if (idExpenses.indexOf(detail.Expense.id) === -1) {
                idExpenses.push(detail.Expense.id);
              }
            }
            ArrayDetailsManufacture.push({
              amount: detail.amount,
              amountLost: detail.amountLost || null,
              category: detail.category,
              idProduct: detail.Product.id,
              idExpense: detail.Expense ? detail.Expense.id : null,
              idManufacture: newManufacture.id,
            });
          }
          console.log(ArrayDetailsManufacture);
          await db.Detail_manufacture.bulkCreate(ArrayDetailsManufacture);
          await ModelController.getDetail_expenses(
            idExpenses.toString(),
            "'disponible'",
            db
          ).then(async (details) => {
            if (details) {
              for (const detail of details) {
                if (detail.amountAvalaible == 0) {
                  updateDetailsExpense.push(detail.idDetailExpense);
                }
              }

              if (updateDetailsExpense.length > 1) {
                await db.Detail_expense.update(
                  { use: "usado" },
                  {
                    where: {
                      id: { [Op.in]: updateDetailsExpense },
                    },
                  }
                );
              }
              return res.status(200).json({
                ok: true,
                msg: `El gasto ${newManufacture.name} ha sido registrado.`,
              });
            }
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
      msg: "Debes comunicarte con el administrador",
    });
  }
};

const findManufacture = async (req = request, res = response) => {
  try {
    const listAtributes = ["id", "name", "createdAt"];
    const listAttributesEmployee = ["id", "name", "surname"];
    const listAttributesExpense = ["id", "name", "createdAt"];
    const listAttributesDetailsManufacture = [
      "id",
      "amount",
      "amountLost",
      "category",
    ];
    const listAttributesProduct = ["id", "name", "amount"];
    const getManufacture = await db.Manufacture.findOne({
      where: { id: req.params.id },
      attributes: listAtributes,
      include: [
        {
          model: db.User,
          attributes: listAttributesEmployee,
        },
      ],
    });

    if (getManufacture) {
      const detail_manufactures = await getManufacture.getDetail_manufactures({
        attributes: listAttributesDetailsManufacture,
        include: [
          {
            model: db.Expense,
            attributes: listAttributesExpense,
          },
          {
            model: db.Product,
            attributes: listAttributesProduct,
          },
        ],
      });

      if (detail_manufactures) {
        const arrayIdExpenses = [];
        for (let detail of detail_manufactures) {
          if (detail.Expense !== null) {
            if (arrayIdExpenses.indexOf(detail.Expense.id) === -1) {
              arrayIdExpenses.push(detail.Expense.id);
            }
          }
        }

        const expenses = await ModelController.getDetail_expenses(
          arrayIdExpenses.toString(),
          "'disponible'",
          db
        );
        if (expenses) {
          outer: for (let i = 0; i < expenses.length; i++) {
            second: for (let j = 0; j < detail_manufactures.length; j++) {
              if (detail_manufactures[j].Expense !== null) {
                if (
                  detail_manufactures[j].Expense.id === expenses[i].idExpense &&
                  detail_manufactures[j].Product.id === expenses[i].idProduct
                ) {
                  const amountAvalaible =
                    Number(detail_manufactures[j].amount) +
                    Number(expenses[i].amountAvalaible);
                  detail_manufactures[j].setDataValue(
                    "amountAvalaible",
                    amountAvalaible
                  );
                  continue outer;
                }
              } else {
                continue second;
              }
            }
          }
          return res.status(200).json({
            ok: true,
            obj: {
              id: getManufacture.id,
              createdAt: getManufacture.createdAt,
              name: getManufacture.name,
              employee: getManufacture.User,
              details: detail_manufactures,
            },
          });
        }
        /*  */
      }
    }
    return res.status(400).json({
      ok: false,
      msg: "No se encontro la manufacturación.",
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "Debes comunicarte con el administrador",
    });
  }
};

const findManufactures = async (req = request, res = response) => {
  try {
    console.log("epa");
    const listAtributesSearch = ["id", "name", "createdAt"];
    const objSearchElementsManufacture = {};
    if (req.body.createdAt !== "") {
      const date = new Date(req.body.createdAt);
      objSearchElementsManufacture["createdAt"] = {
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
    const manufactures = await db.Manufacture.findAll({
      attributes: listAtributesSearch,
      where: objSearchElementsManufacture,
    });
    if (manufactures) {
      return res.status(200).json({
        ok: true,
        list: manufactures,
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

const updateManufacture = async (req = request, res = response) => {
  try {
    const { details } = req.body;
    const idExpenses = [];
    const updateUseDetailsExpense = [];
    const updateNoUseDetailsExpense = [];
    const ArrayDetailsManufacture = [];
    const details_parse = JSON.parse(details);
    const listAttributes = ["idEmployee"];
    await ModelController.update(
      req,
      res,
      db,
      "Manufacture",
      "Manufactura",
      "id",
      listAttributes
    ).then(async (manufacture) => {
      if (manufacture) {
        for (const detail of details_parse) {
          if (detail.category !== "manufacture") {
            if (idExpenses.indexOf(detail.Expense.id) === -1) {
              idExpenses.push(detail.Expense.id);
            }
          }
          ArrayDetailsManufacture.push({
            amount: detail.amount,
            amountLost: detail.amountLost || null,
            category: detail.category,
            idProduct: detail.Product.id,
            idExpense: detail.Expense ? detail.Expense.id : null,
            id: detail.id,
          });
        }
        console.log(ArrayDetailsManufacture);
        await db.Detail_manufacture.bulkCreate(ArrayDetailsManufacture, {
          updateOnDuplicate: ["id", "amount", "amountLost"],
        });

        const detailsExpenses = await ModelController.getDetail_expenses(
          idExpenses.toString(),
          "'disponible','usado'",
          db
        );

        if (detailsExpenses) {
          for (const detail of detailsExpenses) {
            if (detail.amountAvalaible == 0) {
              updateUseDetailsExpense.push(detail.idDetailExpense);
            } else {
              updateNoUseDetailsExpense.push(detail.idDetailExpense);
            }
          }

          if (updateUseDetailsExpense.length > 1) {
            await db.Detail_expense.update(
              { use: "usado" },
              {
                where: {
                  id: { [Op.in]: updateUseDetailsExpense },
                },
              }
            );
          }
          if (updateNoUseDetailsExpense.length > 1) {
            await db.Detail_expense.update(
              { use: "disponible" },
              {
                where: {
                  id: { [Op.in]: updateNoUseDetailsExpense },
                },
              }
            );
          }
          return res.status(200).json({
            ok: true,
            msg: `La manufactura con nombre ${manufacture.name} ha sido editada.`,
          });
        }
      }
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: error,
    });
  }
};

const deleteManufacture = async (req = request, res = response) => {
  try {
    const obj = { id: req.params.id };
    const attributesToSearchDetail = ["id", "category"];
    const attributesToSearchExpense = ["id"];
    const idExpenses = [];
    const updateUseDetailsExpense = [];
    const manufacture = await db.Manufacture.findOne({ where: obj });
    if (manufacture) {
      const detail_manufactures = await manufacture.getDetail_manufactures({
        attributes: attributesToSearchDetail,
        include: [
          {
            model: db.Expense,
            attributes: attributesToSearchExpense,
          },
        ],
      });

      if (detail_manufactures) {
         await manufacture.destroy();
        for (const detail of detail_manufactures) {
          if (detail.category !== "manufacture") {
            idExpenses.push(detail.Expense.id);
          }
        }
        const detailsExpenses = await ModelController.getDetail_expenses(
          idExpenses.toString(),
          "'usado'",
          db
        );
        if (detailsExpenses) {
          for (const detail of detailsExpenses) {
            if (detail.amountAvalaible > 0) {
              updateUseDetailsExpense.push(detail.idDetailExpense);
            }
          }
          await db.Detail_expense.update(
            { use: "disponible" },
            {
              where: {
                idExpense: { [Op.in]: updateUseDetailsExpense },
              },
            }
          );
          return res.status(200).json({
            ok: true,
            msg: `la manufactura con nombre ${manufacture.name} fue eliminado.`,
          });
        }
      }
    }
    return res.status(400).json({
      ok: false,
      msg: `No se puedo eliminar la manufactura`,
    });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: error,
    });
  }
};

const detailsAvailable = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    await ModelController.getDetail_expenses(id, "'disponible'", db).then(
      (details_expense_avalaible) => {
        if (details_expense_avalaible) {
          return res.status(200).json({
            ok: true,
            list: details_expense_avalaible,
          });
        }
        return res.status(400).json({
          ok: true,
          msg: "No hay valores para consultar",
        });
      }
    );
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "Debes comunicarte con el administrador",
    });
  }
};

const getExpenses = async (req = request, res = response) => {
  try {
    const expenses = await db.sequelize.query(
      `SELECT expenses.id AS id, expenses.name As name,'disponible' AS state, expenses.total_price AS total_price, expenses.createdAt AS createdAt
           FROM detail_expenses
            INNER JOIN expenses ON detail_expenses.idExpense = expenses.id
            WHERE detail_expenses.use='disponible'
            GROUP BY  detail_expenses.idExpense ASC
             `,

      {
        type: QueryTypes.SELECT,
      }
    );
    if (expenses) {
      return res.status(200).json({
        ok: true,
        list: expenses,
      });
    }
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: error,
    });
  }
};

module.exports = {
  createManufacture,
  findManufacture,
  findManufactures,
  updateManufacture,
  deleteManufacture,
  detailsAvailable,
  getExpenses,
};
