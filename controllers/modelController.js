const { Op } = require("sequelize");
const fs = require("fs");
const { QueryTypes } = require("sequelize");
class ModelController {
  static async create(req, res, db, model, nameModel, nameAtributeSearch) {
    try {
      if (req.searchObj) {
        const elementExistence = await db[model].findOne({
          where: req.searchObj,
        });
        if (elementExistence) {
          return res.status(400).json({
            ok: false,
            msg: `Ya existe un ${nameModel} con ese ${nameAtributeSearch}.`,
          });
        }
      }
      const modelInstance = await db[model].create(req.body);
      if (modelInstance) {
        return modelInstance;
      }
    } catch (error) {
      return res.status(400).json({
        ok: false,
        msg: "Debes comunicarte con el administrador",
        error,
      });
    }
  }

  static async findAll(req, res, db, model, listaAtributosMostrar) {
    try {
      let objSearch={};
      if(req.body.findQuery){
        objSearch = req.body.findQuery;
      }
      if (req.body.name != "") {
        objSearch["name"] = { [Op.like]: `%${req.body.name}%` };
      }
      const modelInstance = await db[model].findAll({
        attributes: listaAtributosMostrar,
        where: objSearch,
      });
      if (modelInstance) {
        return res.status(200).json({
          ok: true,
          list: modelInstance,
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
  }

  static async findOne(
    req,
    res,
    db,
    model,
    nameModel,
    nameAtributeSearch,
    attributesToSearch
  ) {
    try {
      const searchObj = {};
      searchObj[nameAtributeSearch] = req.params[nameAtributeSearch];
      const modelInstance = await db[model].findOne({
        attributes: attributesToSearch,
        where: searchObj,
      });
      if (modelInstance) {
        return modelInstance;
      }
      throw new Error(`No se encontro el ${nameModel}`);
    } catch (error) {
      return res.status(400).json({
        ok: false,
        msg: "Debes comunicarte con el administrador",
      });
    }
  }

  static async update(
    req,
    res,
    db,
    model,
    nameModel,
    nameSearch,
    attributesToUpdate
  ) {
    try {
      const obj = {};
      obj[nameSearch] = req.params[nameSearch];
      const modelIntance = await db[model].findOne({ where: obj });
      if (modelIntance) {
        this.fieldsUpdate(attributesToUpdate, req, modelIntance);
        await modelIntance.save();
        return modelIntance;
      }
      return res.status(400).json({
        ok: false,
        msg: `No se puedo editar el ${nameModel}`,
      });
    } catch (error) {
      return res.status(400).json({
        ok: false,
        msg: "Debes comunicarte con el administrador",
      });
    }
  }

  static async delete(req, res, db, model, nameModel, nameSearch) {
    try {
      const obj = {};
      obj[nameSearch] = req.params[nameSearch];
      const modelInstance = await db[model].findOne({ where: obj });
      console.log(modelInstance);
      if (modelInstance) {
        await modelInstance.destroy();
        return res.status(200).json({
          ok: true,
          msg: `El ${nameModel} ${obj[nameSearch]} fue eliminado.`,
        });
      }
      return res.status(400).json({
        ok: false,
        msg: `No se puedo eliminar el ${nameModel}`,
      });
    } catch (error) {
      return res.status(400).json({
        ok: false,
        msg: error,
      });
    }
  }

  static fieldsUpdate(list, req, classInstance) {
    list.forEach((element) => {
      classInstance[element] = req.body[element];
    });
  }

  static deleteFile(url){
    const filePath =  url;
    
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error('Error al eliminar el archivo:', err);
      } else {
        console.log('Archivo eliminado exitosamente'); 
      }
    });
  }

  static async getDetail_expenses(id,typeUse,db){
    try {
      const details_expense_avalaible = await db.sequelize.query(
        `SELECT products.id as idProduct,detail_expenses.id AS idDetailExpense, products.name,expenses.id AS idExpense,DATE_FORMAT(expenses.createdAt, "%Y-%m-%d %r")  AS date, expenses.name As nameExpense,
          (detail_expenses.amount * products.amount) - COALESCE(SUM(detail_manufactures.amount), 0) AS amountAvalaible
              FROM detail_expenses
              INNER JOIN products ON detail_expenses.idProduct = products.id
              INNER JOIN expenses ON detail_expenses.idExpense = expenses.id
              LEFT JOIN detail_manufactures ON products.id = detail_manufactures.idProduct AND 
              expenses.id = detail_manufactures.idExpense
              WHERE detail_expenses.idExpense IN (${id})  AND  detail_expenses.use IN (${typeUse})
              GROUP BY  detail_expenses.id `,
              
        {
          type: QueryTypes.SELECT,
        }
      );
      if (Object.entries(details_expense_avalaible).length !== 0) {
        return details_expense_avalaible;
      }
    } catch (error) {
      throw new Error('Debes comunicarte con el administrador');
    }
  }
}



module.exports = ModelController;
