const { response, request } = require("express");
const { Op, Sequelize } = require("sequelize");
const db = require("../models");
const months = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

function generarListaNumeros(inicio, fin) {
  const listaNumeros = [];

  for (let i = inicio; i <= fin; i++) {
    listaNumeros.push(i);
  }

  return listaNumeros;
}

function generarProffitAndLoss(loss, proffits) {
  const arrayLostAndProffit = [];
  for (let index = 0; index < loss.length; index++) {
    const lost = loss[index];
    second: for (let index = 0; index < proffits.length; index++) {
      const proffit = proffits[index];
      if (lost.dataValues.month === proffit.dataValues.month) {
        arrayLostAndProffit.push({
          month: lost.dataValues.month,
          lost: lost.dataValues.totalgastos,
          proffit: proffit.dataValues.totalSales,
        });
        continue second;
      }
      const indexArrayProffit = arrayLostAndProffit.findIndex(
        (element) => element.month == proffit.dataValues.month
      );
      if (indexArrayProffit === -1) {
        arrayLostAndProffit.push({
          month: proffit.dataValues.month,
          lost: 0,
          proffit: proffit.dataValues.totalSales,
        });
      }
    }
    const indexArrayLost = arrayLostAndProffit.findIndex(
      (element) => element.month == lost.dataValues.month
    );
    console.log(indexArrayLost);
    if (indexArrayLost === -1) {
      arrayLostAndProffit.push({
        month: lost.dataValues.month,
        lost: lost.dataValues.totalgastos,
        proffit: 0,
      });
    }
  }
  return arrayLostAndProffit;
}

function generarTotalPerdidadYVentasPorMeses(listMonths, arrayLostAndProffit) {
  const lostAndSalesForDate = [];
  majorFor: for (
    let indexMajor = 0;
    indexMajor < listMonths.length;
    indexMajor++
  ) {
    const month = listMonths[indexMajor];
    for (let index = 0; index < arrayLostAndProffit.length; index++) {
      const element = arrayLostAndProffit[index];
      if (month == element.month) {
        lostAndSalesForDate.push({
          month: months[month - 1],
          proffits: element.proffit,
          loss: element.lost,
        });
        continue majorFor;
      }
    }
    lostAndSalesForDate.push({
      month: months[month - 1],
      proffits: 0,
      loss: 0,
    });
  }

  return lostAndSalesForDate;
}

function generarTotalVentasPorMeses(listMonths, sales) {
  const salesFordate = [];
  majorFor: for (
    let indexMajor = 0;
    indexMajor < listMonths.length;
    indexMajor++
  ) {
    const month = listMonths[indexMajor];
    for (let index = 0; index < sales.length; index++) {
      const element = sales[index];
      if (month == element.dataValues.month) {
        salesFordate.push({
          month: months[month - 1],
          totalSales: element.dataValues.totalSales,
        });
        continue majorFor;
      }
    }
    salesFordate.push({ month: months[month - 1], totalSales: 0 });
  }

  return salesFordate;
}

const totalSalesByProduct = async (req = request, res = response) => {
  try {
    const minDate = new Date(req.body.minDate);
    const maxDate = new Date(req.body.maxDate);

    const sales = await db.Sale.findAll({
      attributes: [
        "product_id",
        [Sequelize.fn("SUM", Sequelize.col("quantity")), "totalSales"],
      ],
      where: {
        createdAt: {
          [Op.between]: [minDate, maxDate],
        },
      },
      group: ["product_id"],
    });

    if (sales) {
      return res.status(200).json({
        ok: true,
        list: sales,
      });
    }
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "Debes comunicarte con el administrador.",
    });
  }
};

const proffitAndLoss = async (req = request, res = response) => {
  try {
    const minDate = new Date(req.body.minDate);
    const maxDate = new Date(req.body.maxDate);

    const arrayMonths = generarListaNumeros(
      minDate.getMonth() + 1,
      maxDate.getMonth() + 1
    );

    const proffits = await db.Sale.findAll({
      attributes: [
        [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"],
        [Sequelize.fn("SUM", Sequelize.col("total_price")), "totalSales"],
      ],
      where: {
        createdAt: {
          [Op.between]: [minDate, maxDate],
        },
      },
      group: [Sequelize.fn("MONTH", Sequelize.col("createdAt"))],
    });

    const loss = await db.Expense.findAll({
      attributes: [
        [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"],
        [Sequelize.fn("SUM", Sequelize.col("total_price")), "totalgastos"],
      ],
      where: {
        createdAt: {
          [Op.between]: [minDate, maxDate],
        },
      },
      group: [Sequelize.fn("MONTH", Sequelize.col("createdAt"))],
    });
    const generateProffitAndLost = generarProffitAndLoss(loss, proffits);
    const totalLossAndProffistForDate = generarTotalPerdidadYVentasPorMeses(
      arrayMonths,
      generateProffitAndLost
    );
    console.log("epa");
    if (proffits) {
      return res.status(200).json({
        ok: true,
        list: totalLossAndProffistForDate,
      });
    }
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "Debes comunicarte con el administrador",
    });
  }
};

const salesForRange = async (req = request, res = response) => {
  try {
    const minDate = new Date(req.body.minDate);
    const maxDate = new Date(req.body.maxDate);

    const arrayMonths = generarListaNumeros(
      minDate.getMonth() + 1,
      maxDate.getMonth() + 1
    );
    const sales = await db.Sale.findAll({
      attributes: [
        [Sequelize.fn("MONTH", Sequelize.col("createdAt")), "month"],
        [Sequelize.fn("COUNT", Sequelize.col("id")), "totalSales"],
      ],
      where: {
        createdAt: {
          [Op.between]: [minDate, maxDate],
        },
      },
      group: [Sequelize.fn("MONTH", Sequelize.col("createdAt"))],
    });

    if (sales) {
      const arrayTotalSalesForMonths = generarTotalVentasPorMeses(
        arrayMonths,
        sales
      );
      return res.status(200).json({
        ok: true,
        list: arrayTotalSalesForMonths,
      });
    }
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "Debes comunicarte con el administrador.",
    });
  }
};

module.exports = {
  salesForRange,
  proffitAndLoss,
  totalSalesByProduct
};
