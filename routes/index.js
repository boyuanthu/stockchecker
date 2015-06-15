var express = require('express');
var router = express.Router();

/*Modules below are required by Bo*/
var util = require('util');
var yahooFinance = require('yahoo-finance');
var _ = require('lodash');
var PLOTLY = require('plotly')("yuanb10", "ma28tmtelj");

/*The fileds is used for querying Yahoo Finance API*/
var FIELDS = _.flatten([
  // Pricing
  ['a', 'b', 'b2', 'b3', 'p', 'o'],
  // Dividends
  ['y', 'd', 'r1', 'q'],
  // Date
  ['c1', 'c', 'c6', 'k2', 'p2', 'd1', 'd2', 't1'],
  // Averages
  ['c8', 'c3', 'g', 'h', 'k1', 'l', 'l1', 't8', 'm5', 'm6', 'm7', 'm8', 'm3', 'm4'],
  // Misc
  ['w1', 'w4', 'p1', 'm', 'm2', 'g1', 'g3', 'g4', 'g5', 'g6'],
  // 52 Week Pricing
  ['k', 'j', 'j5', 'k4', 'j6', 'k5', 'w'],
  // System Info
  ['i', 'j1', 'j3', 'f6', 'n', 'n4', 's1', 'x', 'j2'],
  // Volume
  ['v', 'a5', 'b6', 'k3', 'a2'],
  // Ratio
  ['e', 'e7', 'e8', 'e9', 'b4', 'j4', 'p5', 'p6', 'r', 'r2', 'r5', 'r6', 'r7', 's7'],
  // Misc
  ['t7', 't6', 'i5', 'l2', 'l3', 'v1', 'v7', 's6', 'e1']
  ]);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Welcome' });
});


router.post('/', function(req, res){
  var SYMBOL = req.body.ticker;
  var duration = req.body.optradio;
  // require('colors');
  
  //get current date
  var ct = DateUtil.getCurrentDateTime();

  console.log("YOYO CHECK HERE!!"+ct);
  //add the certain amount of time duration 
	var pt = DateUtil.getPreviousDateTime(duration);
  
  console.log("YOYO CHECK tHERE!!"+pt);

  yahooFinance.historical({
      symbol: SYMBOL,
      from: pt,
      to: ct,
      period: 'd'
    }, function (err, quotes) {
      
    if (err) { throw err; }
    console.log(util.format(
        '=== %s (%d) ===',
        SYMBOL,
        quotes.length
    ).cyan);

    
    if (quotes[0]) {
        // console.log(
        //   '%s\n...\n%s',
        //   JSON.stringify(quotes[0], null, 2),
        //   JSON.stringify(quotes[quotes.length - 1], null, 2)
        // );

    } else {
      console.log('N/A');
      
    }

    yahooFinance.snapshot({
      fields: FIELDS,
      symbol: SYMBOL
    }, function (err, snapshot) {
      if (err) { throw err; }

      console.log(util.format('=== %s ===', SYMBOL).cyan);
      console.log(JSON.stringify(snapshot, null, 2));
      
      res.render('result', { 
        query: SYMBOL,
        page:'result',
        data: quotes,
        info: snapshot,
        plotly:PLOTLY
      });

    });

  });

});


//DateUtil encapsulates all the methods we need to manipulate the date string in our project
var DateUtil = {

	dateFormatting:function(date){
		var year = date.getFullYear();

    	var month = date.getMonth() + 1;
    	month = (month < 10 ? "0" : "") + month;

   		 var day  = date.getDate();
    	day = (day < 10 ? "0" : "") + day;

      return year + "-" + month + "-" + day;

	},

	getCurrentDateTime:function() {

    	var date = new Date();

    	return  this.dateFormatting(date);
	},

	getPreviousDateTime:function(op) {

    	var today       =new Date();
  		var pdate;
  		
    	
    	switch(op){
    		case 'week':
    			pdate   =new Date(new Date().setDate(new Date().getDate()-7));
    			break;

    		case 'month':
    			pdate   =new Date(new Date().setDate(new Date().getDate()-30));
    			break;

    		case 'season':
    			pdate   =new Date(new Date().setDate(new Date().getDate()-90));
    			break;

    		case 'year':
    			pdate   =new Date(new Date().setDate(new Date().getDate()-365));
    			break;

    	}

    	return  this.dateFormatting(pdate );
	 }


}




module.exports = router;
