const { check } = require("express-validator");

class validateFields {
  static isEmpty(fields, nameFields) {
    const errors = [];
    for (let index = 0; index < fields.length; index++) {
      errors.push(
        check(fields[index], `${nameFields[index]} es obligatorio.`).trim()
          .not()
          .isEmpty()
      );
    }
    return errors;
  }

  static isEmail(){
   return check("email", "El email es obligatorio").trim().isEmail()
  };

  static isLength(fields,msgs,Lenghts){
    const errors = [];
    for (let index = 0; index < fields.length; index++) {
      errors.push(
        check(fields[index],msgs[index]).trim()
          .isLength(Lenghts[index])
      );
    }
    return errors;
  }

  static validNumber(fields,msgFields){
    const errors = [];
    for (let index = 0; index < fields.length; index++) {
      errors.push(
        check(fields[index], msgFields[index]).trim()
          .matches(`^[0-9]+$`)
      );
    }
    return errors;
  }

  static validName(fields,msgFields){
    const errors = [];
    for (let index = 0; index < fields.length; index++) {
      errors.push(
        check(fields[index], `${msgFields[index]} solo debe contener letras alfabeticas.`).trim()
          .matches(`^[a-zA-ZÀ-ÿ ]+$`)
      );
    }
    return errors;
  }

}

module.exports = validateFields;
