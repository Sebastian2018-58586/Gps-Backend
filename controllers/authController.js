const { response, request } = require("express");
const { generateJWT } = require("../helpers/jwt");
const db = require("../models");
const ModelController = require("./modelController");
const rutaImage = "public/data/uploads/profiles";

const createUser = async (req = request, res = response) => {
  console.log(req.body);
  await ModelController.create(req, res, db, "User", "usuario", "email")
    .then(async (newUser) => {
      console.log(newUser);
      if (newUser) {
        //Generar  el JWT
        const token = await generateJWT(newUser.id, newUser.name);
        //Generar Respuesta
        return res.status(200).json({
          ok: true,
          uid: newUser.id,
          name: newUser.name,
          surname: newUser.surname,
          adress: newUser.adress,
          phoneNumber: newUser.phoneNumber,
          email: newUser.email,
          rol: 'cliente',
          token,
        }); 
      }
    })
    .catch((error) => {
      return res.status(400).json({
        ok: false,
        msg: error,
      });
    });
};

const UpdateUser = async (req = request, res = response) => {
  try {
    const attributesToUpdate = [
      "phoneNumber",
      "adress",
      "password",
    ];
    const attributesToSearch = [
      "id",
      "name",
      "surname",
      "phoneNumber",
      "adress",
      "image",
      "password",
    ];
    console.log('puto');
    console.log(req.body);
    if (req.file) { 
      const image = req.file.filename;
      req.body = { ...req.body, image };
      attributesToUpdate.push("image");
    }
    await ModelController.findOne(
      req,
      res,
      db,
      "User",
      req.body.rol,
      "id",
      attributesToSearch 
    ).then(async (user) => {
      if(user){
        console.log(user);
        if (user.image !== null) {
          const urlFileDelete = `${rutaImage}/${user.image}`;
          console.log(urlFileDelete);
          ModelController.deleteFile(urlFileDelete);
        }
        console.log('me cago');
        attributesToUpdate.forEach((element) => {
          user[element] = req.body[element];
        });
        console.log('me cago')
        await user.save();
        console.log('Guardado')
        return res.status(200).json({
          ok: true,
          msg: `El ${req.body.rol}  ha sido editado.`,
        });
      }
    });
  } catch (error) { 
    return res.status(400).json({
      ok: false,
      msg: `Debes comunicarte con el administrador.`,
    });
  }
};

const loginUser = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const dbUser = await db.User.findOne({ where: { email } });
    console.log("dbUser", dbUser);

    if (!dbUser) {
      return res.status(400).json({
        ok: false,
        msg: "Verifique si la contraseña y el correo son correctos",
      });
    }

    //confirmar si el password existe hace match
    const validatePassword = dbUser.validPassword(password, dbUser.password);
    if (!validatePassword) {
      return res.status(400).json({
        ok: false,
        msg: "Verifique si la contraseña y el correo son correctos",
      });
    }

    //Generar el JWT
    const token = await generateJWT(dbUser.id, dbUser.name);

    const rolUser = await dbUser.getRole();
    const getNameRole = rolUser.id == 4 ? 'cliente' : rolUser.name
    //Respuesta del servicio
    return res.json({
      ok: true,
      uid: dbUser.id,
      name: dbUser.name,
      surname: dbUser.surname,
      adress: dbUser.adress,
      phoneNumber: dbUser.phoneNumber,
      image: dbUser.image,
      email: dbUser.email,
      rol: getNameRole ,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador",
    });
  }
};

const revalidateToken = async (req, res = response) => {
  const { uid } = req;

  //leer la base de datos
  const dbUser = await db.User.findOne({ where: { id: uid } });

  //Generar el JWT
  const token = await generateJWT(uid, dbUser.name);
  const rolUser = await dbUser.getRole();
  const getNameRole = rolUser.id == 4 ? 'cliente' : rolUser.name
  res.json({
    ok: true,
    name: dbUser.name,
    surname: dbUser.surname,
    adress: dbUser.adress,
    phoneNumber: dbUser.phoneNumber, 
    image: dbUser.image,
    email: dbUser.email,
    rol: getNameRole,
    uid,
    token,
  });
};

module.exports = {
  createUser,
  loginUser,
  revalidateToken,
  UpdateUser,
};
