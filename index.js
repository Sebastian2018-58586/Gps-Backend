const express = require("express");
const cors = require("cors");
//const path = require("path");
const { createServer } = require("http");
const socketConfig = require("./socket/config");
const { sequelize } = require("./models");
require("dotenv").config();

//crear el servidor
const app = express();
const server = createServer(app);
socketConfig.configSocket(server);
//conexión a la base de datos
async function main() {
  try {
    await sequelize.authenticate();
    console.log("Conectado en la BD");
  } catch (error) {
    console.error("No se puedo establecer la conexion en la base de datos");
  }
}

main();

//Directorio público
app.use(express.static("public"));

//Cors
app.use(cors());

//Lectura y parseo del body
app.use(express.json());



//Rutas
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/producto", require("./routes/productRoutes"));
app.use("/api/estadistica",require("./routes/statisticRoutes"));
app.use("/api/proveedor",require("./routes/supplierRoutes"));
app.use("/api/cliente", require("./routes/customerRoutes"));
app.use("/api/empleado",require("./routes/employeeRoutes"));
app.use("/api/gasto", require("./routes/expenseRoutes"));
app.use("/api/venta", require("./routes/saleRoutes"));
app.use("/api/pedido",require('./routes/orderRoutes'));
app.use("/api/manufactura",require("./routes/manufactureRoutes"));
app.use("/api/categoria",require("./routes/categoryRoutes"));

//conexión al puerto 
server.listen(process.env.PORT,() => {
  console.log(`El puerto ${process.env.PORT} esta conectado  `); 
});
