require('dotenv').config();

const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const socketConfig = require("./socket/config");
const { sequelize } = require("./models");
const morgan = require("morgan");
const { User } = require("./models");

// Crear la aplicación de Express
const app = express();
const server = createServer(app);
socketConfig.configSocket(server);

// Conexión a la base de datos
async function main() {
  try {
    await sequelize.authenticate();
    console.log("Conectado a la BD");
  } catch (error) {
    console.error("No se pudo establecer la conexión a la base de datos:", error);
  }
}

main();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static("public")); 
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.json({ message: "Hola" });
});

app.get("/user-count", async (_req, res) => {
  try {
    const userCount = await User.count();
    res.json({ count: userCount });
  } catch (error) {
    console.error("Error al obtener la cantidad de usuarios:", error);
    res.status(500).json({ error: "Error al obtener la cantidad de usuarios" });
  }
});

// Rutas
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/producto", require("./routes/productRoutes"));
app.use("/api/estadistica", require("./routes/statisticRoutes"));
app.use("/api/proveedor", require("./routes/supplierRoutes"));
app.use("/api/cliente", require("./routes/customerRoutes"));
app.use("/api/empleado", require("./routes/employeeRoutes"));
app.use("/api/gasto", require("./routes/expenseRoutes"));
app.use("/api/venta", require("./routes/saleRoutes"));
app.use("/api/pedido", require('./routes/orderRoutes'));
app.use("/api/manufactura", require("./routes/manufactureRoutes"));
app.use("/api/categoria", require("./routes/categoryRoutes"));

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
