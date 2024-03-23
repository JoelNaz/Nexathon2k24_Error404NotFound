const express = require('express');
const multer = require('multer');
const { UserReport, Authority } = require('../models/User');
const { jwtDecode } = require('jwt-decode');

const router = express.Router();

// Multer configuration for handling file uploads

router.post('/postUserReports', async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwtDecode(token);
        console.log(token)
        const { title, description, location, department ,image } = req.body;

        // Access the uploaded file via req.file
        //const image = req.file.buffer;

        // Create a new UserReport instance
        const newUserReport = new UserReport({
            title,
            description,
            location,
            image,
            department,
            createdBy: decoded.userId,
        });

        // Save the user report to the database
        await newUserReport.save();

        res.status(201).json({ message: 'User report created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/reportstatus/:status', async (req, res) => {
    try {
  
      const { status } = req.params;
  
      // Find all user reports with status 'pending'
      const reports = await UserReport.find({ status: status });
  
      // Send the list of pending reports as a response
      res.json(reports);
      console.log(reports)
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  router.post('/updateReportStatus/:reportId', async (req, res) => {
    try {
      const { reportId } = req.params;
      const { status } = req.body;
  
      // Validate if the provided status is valid (you can customize this based on your status values)
      const validStatusValues = ['pending', 'accepted', 'rejected'];
      if (!validStatusValues.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
  
      // Update the status of the user report
      const updatedReport = await UserReport.findByIdAndUpdate(
        reportId,
        { status },
        { new: true }
      );
  
      if (!updatedReport) {
        return res.status(404).json({ message: 'User report not found' });
      }
  
      res.status(200).json({ message: 'Report status updated successfully', updatedReport });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });



  router.post('/assignReport/:reportId/:department', async (req, res) => {
    try {
      const { reportId } = req.params;
      const { department } = req.params;
      // const token = req.headers.authorization;
      // const decoded = jwtDecode(token);

      const userReport = await UserReport.findById(reportId );

      if (!userReport) {
        return res.status(404).json({ message: 'User report not found' });
      }

      // Find the Authority document based on the admin parameter (assuming admin is the username)
       // Define username variable with appropriate value

      const authority = await Authority.findOne({ department });

      if (!authority) {
        return res.status(404).json({ message: 'Authority not found' });
      }

      // Update the reportsAssigned field of the Authority document
      authority.reportsAssigned.push(userReport._id);

      // Save the updated Authority document
      await authority.save();

      res.json(userReport);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/getReportsAssigned', async (req, res) => {
    try {
        const token = req.headers.authorization;
        const decoded = jwtDecode(token);
  
      // Find the Authority document based on the provided ID
      const authority = await Authority.findById(decoded.userId);
  
      if (!authority) {
        return res.status(404).json({ message: 'Authority not found' });
      }
  
      // Retrieve reports assigned to the authority
      const assignedReports = await UserReport.find({ _id: { $in: authority.reportsAssigned } });
      
      res.json(assignedReports);
      console.log(assignedReports);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
    
  });


  router.get('/recent-user-reports', async (req, res) => {
    try {
      // Calculate the date and time 1 hour ago
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);
  
      // Query for user reports created in the last 1 hour
      const recentUserReports = await UserReport.find({
        createdAt: { $gte: oneHourAgo },
      });
  
      // Check if the count is more than 5
      const reportCount = recentUserReports.length;
  
      if (reportCount > 5) {
        // Send an alert to the frontend
        res.json({
          message: `Alert: ${reportCount} reports generated in the last 1 hour.`,
          reports: recentUserReports,
          showAlert: true,
        });
      } else {
        // No alert, just return an empty response
        res.json({});
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  



module.exports = router;