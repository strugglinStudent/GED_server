const express = require('express');
const {
  createCompany,
  getCompanyById,
  getCompanies,
  updateCompany,
  deleteCompany,
} = require('../controllers/companies.controller');
const { isAuthorized, isAuth } = require('../middlewares/authorization');

const companyRoute = express.Router();

// Create a new company (accessible by superAdmin and admin)
companyRoute.post('/', isAuth, isAuthorized('SuperAdmin'), createCompany);

// Get all companies (accessible by all authenticated users)
companyRoute.get('/', isAuth, isAuthorized('SuperAdmin'), getCompanies);

// Get a single company by name (accessible by all authenticated users)
companyRoute.get('/:id', isAuth, getCompanyById);

// Update a company by name (accessible by superAdmin and admin)
companyRoute.put('/:id', isAuth, isAuthorized('SuperAdmin', 'Admin'), updateCompany);

// Delete a company by name (accessible by superAdmin and admin)
companyRoute.delete('/:id', isAuth, isAuthorized('SuperAdmin', 'Admin'), deleteCompany);

module.exports = companyRoute;
