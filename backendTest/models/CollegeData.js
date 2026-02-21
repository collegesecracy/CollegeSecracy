import mongoose from 'mongoose';

const collegeDataSchema = new mongoose.Schema({
  counsellingType: {
    type: String,
    required: true,
    enum: ['JOSAA', 'CSAB', 'UPTAC', 'OTHERS'],
    uppercase: true
  },

  year: {
    type: Number,
    required: true,
    min: 2000,
    max: new Date().getFullYear() + 1
  },

  round: {
    type: String,
    required: true,
    enum: ['1', '2', '3', '4', '5', '6', 'AR'],
    validate: {
      validator: function (v) {
        return /^[1-6]$|^AR$/.test(v);
      },
      message: props =>
        `${props.value} is not a valid round! Use 1-6 or AR`
    }
  },

  // ================= DATA ARRAY =================
data: [
  {
    Institute: { type: String },

    'Academic Program Name': {
      type: String
    },

    Quota: { type: String },

    'Seat Type': { type: String },

    Gender: { type: String },

    'Opening Rank': {
      type: Number
    },

    'Closing Rank': {
      type: Number
    },

    Round: {
      type: String,
      enum: ['1', '2', '3', '4', '5', '6', 'AR'],
      default: '1'
    },

    // ===== UPTAC Specific =====
    State: String,
    Remark: String,
    Program: String,
    'Seat Gender': String,
    Category: String,

    // ===== Extra Generic =====
    'Institute Type': String,
    'Candidate Category': String,
    'PD Status': String
  }
],

  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
});


// =====================================================
// 🔥 COMPOUND & MULTIKEY INDEXES (PREDICTOR BOOST)
// =====================================================

// Unique dataset constraint
collegeDataSchema.index(
  { counsellingType: 1, year: 1, round: 1 },
  { unique: true }
);


// 🚀 Core Rank Predictor Index
collegeDataSchema.index({
  "data.Opening Rank": 1,
  "data.Closing Rank": 1
});


// 🚀 Predictor Filter Compound Index
collegeDataSchema.index({
  counsellingType: 1,
  year: 1,
  round: 1,
  "data.Quota": 1,
  "data.Seat Type": 1,
  "data.Gender": 1
});


// 🚀 Institute Search Index
collegeDataSchema.index({
  "data.Institute": 1
});


// 🚀 Program Search Index
collegeDataSchema.index({
  "data.Academic Program Name": 1
});


// =====================================================
// ⏱ Auto update timestamp
// =====================================================
collegeDataSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});


// =====================================================
// 📦 Model Export
// =====================================================
const CollegeData = mongoose.model(
  'CollegeData',
  collegeDataSchema
);

export default CollegeData;
