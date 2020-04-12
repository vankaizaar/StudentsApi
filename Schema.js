//Validation Library
const Joi = require('@hapi/joi');
//This lib is used to calculate the date for earliest registration is 16 years, oldest is 100 years
const moment = require('moment');
//Regex to match +XXXXXXXXXXXX or 07XXXXXXXX
const pattern = /^07\d{8}|\+\d{12,}$/;
//Schema
const schema = Joi.object().keys({
    year_of_birth: Joi.number().integer().required().min((moment().subtract(100, 'years')).year()).max((moment().subtract(16, 'years')).year()).label('Year of birth'),
    course: Joi.string().allow('BBIT', 'BCOM').only().required().label('Course'),
    name: Joi.object().keys({
        first: Joi.string().min(3).max(30).required().label('First Name'),
        last: Joi.string().min(3).max(30).required().label('Last Name'),
    }),
    email: Joi.string().email().required(),
    phone: Joi.string().regex(pattern).required()
});

module.exports = schema;