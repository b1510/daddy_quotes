var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const quoteSchema = new Schema({
    quote: String,
    exemple: String,
    author: String,
    context: String,
 });