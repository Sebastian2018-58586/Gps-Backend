const { response, request } = require("express");
const db = require("../models");
const ModelController = require("./modelController");
const { Op,Sequelize }  = require("sequelize");
const { countOrdersDone } = require("../socket/config");
const createSale = async (req = request, res = response) => {
  try {
    const { details } = req.body; 
    const details_parse = JSON.parse(details);
    await ModelController.create(req, res, db, "Sale", "venta", "nombre")
      .then(async (newSale) => {
        if (newSale) {
          const detailsSales=[] 
          for (const detail of details_parse) {
            detailsSales.push({amount:detail.amount,price:detail.price,idProduct:detail.Product.id,idSale:newSale.id});
           }
          await db.Detail_sale.bulkCreate(detailsSales);
          if(req.body.updateOrders===true){
            await countOrdersDone(res,db);
          } 
          return res.status(200).json({
            ok: true,
            msg: `la venta ${newSale.name} ha sido registrada.`,
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



const findSale = async (req = request, res = response) => {
  try {
    const listAttributes = ["id", "name", "createdAt", "state", "total_price"];
    const listAttributesCustomer = [
      "id",
      "name",
      "adress",
      "surname",
      "phoneNumber",
    ];
    const listAttributesDetails_Sale = ["amount", "price"];
    const listAttributesProduct = ["id", "name", "price","amount","image"];
    const searchObj = { id: req.params.id };
    const sale = await db.Sale.findOne({
      attributes: listAttributes,
      where: searchObj,
      include: [
        {
          model: db.User,
          attributes: listAttributesCustomer,
          required: false,
        },
      ],
    });
    if (sale) {
      const details = await sale.getDetail_sales({
        attributes: listAttributesDetails_Sale,
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
            id: sale.id,
            name: sale.name,
            state: sale.state,
            createdAt: sale.createdAt,
            total_price: sale.total_price,
            customer: sale.User,
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

const findSalesByCustomer = async(req = request, res = response)=>{
  try {
    const attributesToSearchSale = ["id","name","total_price","createdAt"];
    const idCustomer = req.params.idCustomer;
    const orders = await db.Sale.findAll({
      where: { idCustomer },
      attributes: attributesToSearchSale,
    });
    if (orders) {
      return res.status(200).json({
        ok: true,
        list:orders
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
}

const findSales = async (req = request, res = response) => {
  try {
    const listAttributesCustomer = [
      "id",
      "name",
      "adress",
      "surname",
      "phoneNumber",
    ];
    const listAttributes = ["id", "name", "total_price", "state", "createdAt"];
    const objSearchCustomer = {};
    const objSearchElementsSale = {};
    let searchbynameCustomer = false;
    if (req.body.name !== "") {
      objSearchCustomer["name"] = { [Op.like]: `%${req.body.name}%` };
      searchbynameCustomer = true;
    }
    if(req.body.createdAt !== "") {
      const date = new Date(req.body.createdAt);
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
    if (req.body.stateSale !== "todas") {
      objSearchElementsSale["state"] = req.body.stateSale;
    }
    
    console.log(objSearchElementsSale)
    const sales = await db.Sale.findAll({
      attributes: listAttributes,
      where: objSearchElementsSale,
      include:[
        {
          model:db.User,
          where:objSearchCustomer,
          attributes:listAttributesCustomer,
          required:searchbynameCustomer
        }
      ]
    });
    if (sales) {
      return res.status(200).json({
        ok: true,
        list: sales,
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

const updateSale = async (req = request, res = response) => {
  try {
    const { details } = req.body;
    const details_parse = JSON.parse(details);
    const listaAtributos = ["state", "total_price", "idCustomer", "createdAt"];
   
    await ModelController.update(
      req,
      res,
      db,
      "Sale",
      "Venta",
      "id",
      listaAtributos
    ).then(async (sale) => {
      if(sale){
        const getDetails = await sale.getDetail_sales();
        if(getDetails){
          for (const detail of getDetails) {
              await db.Detail_sale.destroy({
                where:{id:detail.id}
              });
          }
        }
         for (const detailUpdate of details_parse) {
          await sale.createDetail_sale({amount:detailUpdate.amount,price:detailUpdate.price,idProduct:detailUpdate.Product.id});
         }
         return res.status(200).json({
           ok: true,
           msg: `El venta con nombre ${sale.name} ha sido editado.`,
         });
      }
       
      })
      .catch((err) => {
        return res.status(400).json({
          ok: false,
          msg: err,
        });
      });
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "No se ha podido editar la venta.",
      error,
    });
  }
};

const deleteSale = async (req = request, res = response) => {
  ModelController.delete(req, res, db, "Sale", "venta", "id");
};

module.exports = {
  createSale,
  findSale,
  findSales,
  updateSale,
  deleteSale,
  findSalesByCustomer,
};
