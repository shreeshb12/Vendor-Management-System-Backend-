const HistoricalPerformance = require('../models/historicalPerformanceSchema');

exports.getHistoricalPerformance = async (req, res) => {
    try {
        const { vendorId } = req.params;
        
        // Fetch historical performance data for the specified vendor
        const performanceRecords = await HistoricalPerformance.find({ vendor: vendorId })
            .sort({ date: -1 })  // Sort by date in descending order
            .exec();
        
        if (!performanceRecords.length) {
            return res.status(404).json({ message: 'No historical performance data found for this vendor' });
        }

        res.status(200).json(performanceRecords);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving historical performance data', error });
    }
};
