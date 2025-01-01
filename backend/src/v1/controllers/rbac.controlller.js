'use strict';

const { SuccessResponse } = require('../core/success.response');
const { createResource, createRole, resourceList, roleList } = require('../services/rbac.service');


/**
 * @description create new role
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
const newRole = async (req, res, next) => {
	new SuccessResponse({
		message: 'Role created successfully',
		metadata: await createRole(req.body)
	}).send(res);
}

const newResources = async (req, res, next) => {
	new SuccessResponse({
		message: 'Resource created successfully',
		metadata: await createResource(req.body)
	}).send(res);
}

const listRole = async (req, res, next) => {
	new SuccessResponse({
		message: 'Role list',
		metadata: await roleList(req.body)
	}).send(res);
}

const listResources = async (req, res, next) => {
	new SuccessResponse({
		message: 'Resource list',
		metadata: await resourceList(req.body)
	}).send(res);
}


module.exports = {
	newRole,
	newResources,
	listResources,
	listRole
}