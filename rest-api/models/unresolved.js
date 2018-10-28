var mongoose = require('mongoose')

var unresolvedSchema = mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  solutionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Solution' },
  resolved: Boolean
})

module.exports = mongoose.model('Unresolved', unresolvedSchema);
