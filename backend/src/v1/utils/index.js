"use strict";

const _ = require("lodash");
const { Types } = require("mongoose");

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 1]));
};

const unSelectData = (select = []) => {
  return Object.fromEntries(select.map((el) => [el, 0]));
};

const removeUndefinedObject = (object) => {
  Object.keys(object).forEach((item) => {
    if (object[item] == null) {
      delete object[item];
    }
  });

  return object;
};

const updateNestedObjectParse = (object) => {
  const final = {};

  for (const [key, value] of Object.entries(object)) {
    if (typeof value === "object" && !Array.isArray(value)) {
      const nestedObject = updateNestedObjectParse(value);
      for (const [nestedKey, nestedValue] of Object.entries(nestedObject)) {
        final[`${key}.${nestedKey}`] = nestedValue;
      }
    } else {
      final[key] = value;
    }
  }

  return final;
};

const convertToObjectIdMongodb = (id) => Types.ObjectId(id);

const replacePlaceholder = (template, params) => {
  Object.keys(params).forEach((k) => {
    const placeholder = `{{${k}}}`;
    template = template.replace(new RegExp(placeholder, "g"), params[k]);
  });
};

const randomProductId = (_) => {
  return Math.floor(Math.random() * 899999 + 100000);
};

module.exports = {
  getInfoData,
  getSelectData,
  unSelectData,
  removeUndefinedObject,
  updateNestedObjectParse,
  convertToObjectIdMongodb,
  replacePlaceholder,
  randomProductId,
};
