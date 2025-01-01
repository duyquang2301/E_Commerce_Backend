'use strict'

const { AuthFailureError } = require('../core/error.response');
const { roleList } = require('../services/rbac.service');
const rbac = require('./role.middlerware')
/**
 * 
 * @param {string} action 
 * @param {*} resource 
 */
const grantAccess = (action, resource) => {
  return async (req, res, next) => {
    try {
      rbac.setGrants(await roleList({ userId: 9999 }))
      const role_name = req.query.role;
      const permission = rbac.can(role_name)[action](resource);
      if (!permission.granted) {
        throw new AuthFailureError("you don't have enough permission to perform this action")
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = {
  grantAccess
}