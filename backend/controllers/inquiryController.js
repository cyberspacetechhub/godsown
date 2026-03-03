const asyncHandler = require('../utils/asyncHandler');
const inquiryService = require('../services/inquiryService');
const { validateInquiryInput } = require('../validators/serviceValidator');

exports.createInquiry = asyncHandler(async (req, res) => {
  const inquiryData = validateInquiryInput(req.body);
  const inquiry = await inquiryService.createInquiry(inquiryData);
  res.status(201).json({ success: true, data: inquiry });
});

exports.getInquiryById = asyncHandler(async (req, res) => {
  const inquiry = await inquiryService.getInquiryById(req.params.id);
  res.status(200).json({ success: true, data: inquiry });
});

exports.getAllInquiries = asyncHandler(async (req, res) => {
  const inquiries = await inquiryService.getAllInquiries(req.query);
  res.status(200).json({ success: true, data: inquiries });
});
