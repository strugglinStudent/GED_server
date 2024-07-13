const Company = require('../models/company');
const { errorCatch } = require('../shared/utils');

// Create a new company
const createCompany = async (req, res) => {
  try {
    const { name, address, email } = req.body;

    if (!name || !address || !email) {
      return res.status(400).json({ message: 'Name, address, email are required' });
    }
    let existingCompany = await Company.findOne({ name });
    if (existingCompany) {
      return res.status(400).json({ message: 'Company with this name already exists' });
    }
    // Check if email already exists
    existingCompany = await Company.findOne({ email });
    if (existingCompany) {
      return res.status(400).json({ message: 'Email already exists' });
    }
    existingCompany = await Company.findOne({ address });
    if (existingCompany) {
      return res.status(400).json({ message: 'Address already exists' });
    }
    const newCompany = new Company({ name, address, email });
    const savedCompany = await newCompany.save();
    return res.status(201).json(savedCompany);
  } catch (e) {
    return errorCatch(e, res);
  }
};

// Get all companies
const getCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    return res.status(200).json(companies);
  } catch (e) {
    return errorCatch(e, res);
  }
};

// Get a single company by name
const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findOne({ name: id });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    return res.status(200).json(company);
  } catch (e) {
    return errorCatch(e, res);
  }
};

// Update a company by name
const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const company = await Company.findById(id)
      .exec();
    if (!company) {
      return res.status(404)
        .json({ message: 'Company not found' });
    }
    if (company.name !== updates.name) {
      const existingCompany = await Company.findOne({ name: updates.name });
      if (existingCompany) {
        return res.status(400)
          .json({ message: 'Company with this name already exists' });
      }
    }
    // Check if email already exists
    if (company.email !== updates.email) {
      const existingCompany = await Company.findOne({ email: updates.email });
      if (existingCompany) {
        return res.status(400)
          .json({ message: 'Email already exists' });
      }
    }
    if (company.address !== updates.address) {
      const existingCompany = await Company.findOne({ address: updates.address });
      if (existingCompany) {
        return res.status(400).json({ message: 'Address already exists' });
      }
    }
    // const updatedCompany = await Company.findOneAndUpdate({ name: companyName }, { $set: updates }, { new: true }).exec();
    // Update the company
    company.name = updates.name;
    company.address = updates.address;
    company.email = updates.email;

    const updatedCompany = await company.save();
    return res.status(200).json(updatedCompany);
  } catch (e) {
    return errorCatch(e, res);
  }
};

// Delete a company by name
const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findByIdAndDelete(id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    return res.status(200).json({ message: 'Company deleted successfully' });
  } catch (e) {
    return errorCatch(e, res);
  }
};

module.exports = {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
