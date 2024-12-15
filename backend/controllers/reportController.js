const Report = require('../models/Report');
const Site = require('../models/Site');
const generateTicketedCode = require('../utils/createTicketId');
const debug = require('debug')('app:ReportTicket'); // Namespace for debugging


/**
 * Create a report
 * @param {Object} req
 * @param {Object} res
 */
exports.createReport = async (req, res) => {


  debug('arguments:', req.body);

  const { title, description , dateTime, siteId} = req.body;

  debug('arguments:', title, description , dateTime, siteId);

  const site = await Site.findById(siteId);
  if(!site) {
    return res.status(400).json({ message: 'Invalid site selected' });
  }

  if(!dateTime) {
    return res.status(400).json({ message: 'Invalid date selected' });
  }

  const ticketedId = await generateTicketedCode();
 // Debugging information
 debug('ticketid:', ticketedId);

  try {
    const report = new Report({
      title,
      description,
      ticketedId,
      createdBy: req.user._id,
      dateTime: new Date(dateTime),
      site: site._id
    });
    await report.save();
    res.status(201).json(report);
  } catch (error) {
     // Debugging information
     debug('Report details:', error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all reports
 * @param {Object} req
 * @param {Object} res
 */
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('createdBy', 'name email');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update a report
 * @param {Object} req
 * @param {Object} res
 */
exports.updateReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    report.title = req.body.title || report.title;
    report.description = req.body.description || report.description;

    await report.save();
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete a report
 * @param {Object} req
 * @param {Object} res
 */
exports.deleteReport = async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
