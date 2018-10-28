var mongoose = require('mongoose')

var solutionSchema = mongoose.Schema({
  problemType: String,
  solution: String,
  keywords: Object, 
  confidence: Object
})

module.exports = mongoose.model('Solution', solutionSchema);
