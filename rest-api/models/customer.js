var mongoose = require('mongoose')

var customerSchema = mongoose.Schema({
  location: String,
  plan: String,
  handset: String,
  phone: String
})

module.exports = mongoose.model('Customer', customerSchema);
