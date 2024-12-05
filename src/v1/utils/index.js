"use strict";

const _ = require("lodash");

const getInfoData = ({ fields = [], object = {} }) => {
  return _.pick(object, fields);
};

const getSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 1]))
}

const unSelectData = (select = []) => {
  return Object.fromEntries(select.map(el => [el, 0]))
}

const removeUndefinedObject = object => {
  Object.keys(object).forEach(item => {
    if (object[item] == null) {
      delete object[item];
    }
  })

  return object
}

const updateNestedObjectParse = (object) => {
  const final = {};

  for (const [key, value] of Object.entries(object)) {
    if (typeof value === 'object' && !Array.isArray(value)) {
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

module.exports = {
  getInfoData,
  getSelectData,
  unSelectData,
  removeUndefinedObject,
  updateNestedObjectParse
};
