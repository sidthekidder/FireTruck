var mongoose = require('mongoose')

var logSchema = mongoose.Schema({
  problemType: { type: String, required: true },
  location: String,
  plan: String, 
  handset: String,
  severity: Number,
  description: String
},
{
    timestamps: true
})

module.exports = mongoose.model('Log', logSchema);
