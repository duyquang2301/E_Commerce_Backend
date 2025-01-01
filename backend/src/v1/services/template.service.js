'use strict';

const TEMPLATE = require('../models/template.model');
const { htmlEmailToken } = require('../utils/template.html');

const newTemplate = async ({
    tem_name,
    tem_html,
}) => {

    // 1. check template is exist

    // 2. create new template
    const template = TEMPLATE.create({
        tem_name, // unique name
        tem_html: htmlEmailToken()
    })

    return template
}

const getTemplate = async ({ tem_name }) => {
    const template = await TEMPLATE.findOne({ tem_name })

    return template
}

module.exports = {
    getTemplate,
    newTemplate
}

