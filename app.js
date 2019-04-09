
var express = require('express');
var hostname = 'localhost';
var port = 3000;
var mongoose = require('mongoose');
var options = {
    server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } },
    replset: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } }
};
var urlmongo = "mongodb+srv://samyhama:daddyQuoteDb@cluster0-wvgod.mongodb.net/test?retryWrites=true"

// mongoose.connect(urlmongo, options);
mongoose.connect(urlmongo, { useNewUrlParser: true });

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Erreur lors de la connexion'));
db.once('open', function () {
    console.log("Connexion à la base OK");
});


var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const quoteSchema = require('./quotes/models/quotes.model');

let Quote = mongoose.model('Quote', quoteSchema);
var myRouter = express.Router();
myRouter.route('/')
    .all(function (req, res) {
        res.json({ message: "Bienvenue sur notre Frugal API ", methode: req.method });
    });

myRouter.route('/quotes')
    .get(function (req, res) {
        Quote.find(function (err, quotes) {
            if (err) {
                res.send(err);
            }
            res.json(quotes);
        });
    })
    .post(function (req, res) {
        var Quote = new Quote();
        Quote.quote = req.body.quote;
        Quote.exemple = req.body.exemple;
        Quote.author = req.body.author;
        Quote.context = req.body.context;
        Quote.save(function (err) {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Bravo, la Quote est maintenant stockée en base de données' });
        });
    });

myRouter.route('/quotes/:Quote_id')
    .get(function (req, res) {
        Quote.findById(req.params.Quote_id, function (err, Quote) {
            if (err)
                res.send(err);
            res.json(Quote);
        });
    })
    .put(function (req, res) {
        Quote.findById(req.params.Quote_id, function (err, Quote) {
            if (err) {
                res.send(err);
            }
            Quote.quote = req.body.quote;
            Quote.exemple = req.body.exemple;
            Quote.author = req.body.author;
            Quote.context = req.body.context;
            Quote.save(function (err) {
                if (err) {
                    res.send(err);
                }
                res.json({ message: 'Bravo, mise à jour des données OK' });
            });
        });
    })
    .delete(function (req, res) {

        Quote.remove({ _id: req.params.Quote_id }, function (err, Quote) {
            if (err) {
                res.send(err);
            }
            res.json({ message: "Bravo, Quote supprimée" });
        });

    });
app.use(myRouter);
app.listen(port, hostname, function () {
    console.log("Mon serveur fonctionne sur http://" + hostname + ":" + port);
});
