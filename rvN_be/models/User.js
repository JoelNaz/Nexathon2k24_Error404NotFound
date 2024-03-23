const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
});


const authoritySchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  post: {
    type: String,
    required: true,
  },
  publicid: {
    type: String,
    required: true,
  },
  premiseid: {
    type: String,
    required: true,
  },
  reportsAssigned: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserReport', // Reference to the UserReport model
  }],
});

const centralAdminSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: true,
  },
  post: {
    type: String,
    required: true,
  },
  publicid: {
    type: String,
    required: true,
  },
  premiseid: {
    type: String,
    required: true,
  },
});


const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // OTP documents will be automatically deleted after 10 minutes
  },
});


const userReportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'pending',
  },
  image: {
    type: Buffer, // Store binary image data
    required: false,
  },
  // Reference to the user who created the report
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


const messageSchema = new mongoose.Schema({
  sender: {
    type: String,
    required: true,
  },
  receiver: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Message = mongoose.model('Message', messageSchema);


const OTP = mongoose.model('OTP', otpSchema);
const UserReport = mongoose.model('UserReport', userReportSchema);
const User = mongoose.model('User', userSchema);
const Authority = mongoose.model('Authority', authoritySchema);
const CentralAdmin = mongoose.model('CentralAdmin', centralAdminSchema);

module.exports = {User, OTP, UserReport,Authority,CentralAdmin,Message};