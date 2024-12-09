const Report = require('../models/Report');

/**
 * Create a report
 * @param {Object} req
 * @param {Object} res
 */
exports.createReport = async (req, res) => {
  const { title, description } = req.body;

  try {
    const report = new Report({
      title,
      description,
      createdBy: req.user._id,
    });
    await report.save();
    res.status(201).json(report);
  } catch (error) {
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
