const { response, request } = require("express");
const { generateJWT } = require("../helpers/jwt");
const db = require("../models");
const ModelController = require("./modelController");
const rutaImage = "public/data/uploads/profiles";

const createUser = async (req = request, res = response) => {
  try {
    const newUser = await ModelController.create(
      req,
      res,
      db,
      "User",
      "usuario",
      "email"
    );
    if (newUser) {
      const token = await generateJWT(newUser.id, newUser.name);
      return res.status(200).json({
        ok: true,
        ...newUser.get({ plain: true }),
        rol: "cliente",
        token,
      });
    }
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: error.message || "Error al crear el usuario.",
    });
  }
};

const updateUser = async (req = request, res = response) => {
  try {
    const attributesToUpdate = ["phoneNumber", "adress", "password"];
    if (req.file) {
      req.body.image = req.file.filename;
      attributesToUpdate.push("image");
    }

    const user = await ModelController.findOne(
      req,
      res,
      db,
      "User",
      req.body.rol,
      "id",
      ["id", "name", "surname", "phoneNumber", "adress", "image", "password"]
    );

    if (user) {
      if (user.image) {
        ModelController.deleteFile(`${rutaImage}/${user.image}`);
      }

      attributesToUpdate.forEach((attr) => {
        if (req.body[attr] !== undefined) user[attr] = req.body[attr];
      });

      await user.save();
      return res.status(200).json({
        ok: true,
        msg: `El ${req.body.rol} ha sido editado.`,
      });
    }
  } catch (error) {
    return res.status(400).json({
      ok: false,
      msg: "Error al actualizar el usuario.",
    });
  }
};

const loginUser = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const dbUser = await db.User.findOne({ where: { email } });
    if (!dbUser || !dbUser.validPassword(password, dbUser.password)) {
      return res.status(400).json({
        ok: false,
        msg: "Credenciales inválidas.",
      });
    }

    const token = await generateJWT(dbUser.id, dbUser.name);
    const role = await dbUser.getRole();
    const roleName = role.id === 4 ? "cliente" : role.name;

    return res.json({
      ok: true,
      ...dbUser.get({ plain: true }),
      rol: roleName,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error al iniciar sesión. Contacte al administrador.",
    });
  }
};

const revalidateToken = async (req, res = response) => {
  try {
    const { uid } = req;
    const dbUser = await db.User.findOne({ where: { id: uid } });
    const token = await generateJWT(uid, dbUser.name);
    const role = await dbUser.getRole();
    const roleName = role.id === 4 ? "cliente" : role.name;

    return res.json({
      ok: true,
      ...dbUser.get({ plain: true }),
      rol: roleName,
      uid,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      msg: "Error al revalidar el token. Contacte al administrador.",
    });
  }
};

module.exports = {
  createUser,
  updateUser,
  loginUser,
  revalidateToken,
};
