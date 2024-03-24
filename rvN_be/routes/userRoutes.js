const express = require('express');
const multer = require('multer');
const { UserReport, Authority, User , Message } = require('../models/User');
const { jwtDecode } = require('jwt-decode');
const { SentimentAnalyzer, PorterStemmer, WordTokenizer } = require('natural');

// Initialize the sentiment analyzer for English
const analyzer = new SentimentAnalyzer('English', PorterStemmer, 'afinn');

// Import the 'natural' package
const natural = require('natural');

// Use PorterStemmer from 'natural'
const stemmer = natural.PorterStemmer;

const router = express.Router();

// Multer configuration for handling file uploads


function analyzeSentiment(title, description) {
  // Tokenize and stem the text for analysis
  const tokenizer = new natural.WordTokenizer();
  const titleTokens = tokenizer.tokenize(title);
  const descriptionTokens = tokenizer.tokenize(description);
  const titleStems = titleTokens.map(token => stemmer.stem(token));
  const descriptionStems = descriptionTokens.map(token => stemmer.stem(token));

  // Calculate sentiment scores for title and description
  const titleScore = analyzer.getSentiment(titleStems);
  const descriptionScore = analyzer.getSentiment(descriptionStems);

  // Combine scores or use other criteria to determine priority
  const overallScore = (titleScore + descriptionScore) / 2;
  let priority;

  // Assign priority based on sentiment score
  if (overallScore < 0) {
    priority = 'Medium';
  } else if (overallScore < 2) {
    priority = 'low';
  } else {
    priority = 'High';
  }

  return priority;
}







router.post('/postUserReports', async (req, res) => {
  try {
      const token = req.headers.authorization;
      const decoded = jwtDecode(token);
      const { title, description, location, department, image } = req.body;

      // Perform sentiment analysis to determine priority
      const priority = analyzeSentiment(title, description);

      // Create a new UserReport instance
      const newUserReport = new UserReport({
          title,
          description,
          location,
          image,
          department,
          priority,
          createdBy: decoded.userId,
      });

      // Save the user report to the database
      await newUserReport.save();
      console.log(newUserReport)

      res.status(201).json({ message: 'User report created successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
  }
});
//
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
  

  router.get('/getuserreports/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      // Find reports posted by the user with the provided user ID
      const userReports = await UserReport.find({ createdBy: userId });
  
      if (!userReports) {
        return res.status(404).json({ message: 'No reports found for this user' });
      }
  
      res.status(200).json(userReports);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });


  router.get('/messagesExists', async (req, res) => {
    try {
      // Extract the token from the request headers
      const token = req.headers.authorization;
      
      // Decode the token to get the user's ID
      const decoded = jwtDecode(token);
    
      // Find the User document based on the provided ID
      const user = await User.findById(decoded.userId);
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Use the User's ID as the receiverId
      const receiverId = user._id;
  
      // Query the Message model to find messages for the provided receiverId
      const messages = await Message.find({ receiver: receiverId });
  
      // Send the messages as a response
      res.status(200).json(messages);
      //console.log(messages)
    } catch (error) {
      console.error('Error retrieving messages:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });




module.exports = router;