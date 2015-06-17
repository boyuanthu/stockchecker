var express = require('express');
var router = express.Router();

/*Modules below are required by Bo*/
var yahooFinance = require('yahoo-finance');
var PLOTLY = require('plotly')("yuanb10", "ma28tmtelj");//it seems dangerous to reveal my api id and key here.

/*modules below are required by yahoo-finance api*/
var _ = require('lodash');
var util = require('util');

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
  
  
/*DateUtil encapsulates all the methods we need to manipulate the date string in our project*/
var DateUtil = {
/*convert data to "YYYY-MM-DD"*/
	dateFormatting:function(date){
		var year = date.getFullYear();

    	var month = date.getMonth() + 1;
    	month = (month < 10 ? "0" : "") + month;

   		 var day  = date.getDate();
    	day = (day < 10 ? "0" : "") + day;

      return year + "-" + month + "-" + day;

	},
/*get current time in "YYYY-MM-DD"*/
	getCurrentDateTime:function() {

    	var date = new Date();

    	return  this.dateFormatting(date);
	},
/*get previous time in "YYYY-MM-DD"*/
	getPreviousDateTime:function(op) {

    	var today       =new Date();
  		var pdate;
  		
    	/*
      * We simplify the situation by assume 
      * 1 weeek = 7 days;
      * 1 month  = 30 days;
      * 3 months = 90 days;
      * 1 year  = 365 days;
      */
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


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Welcome' });
  });

/* POST to the result page*/
router.post('/', function(req, res){
  var SYMBOL = req.body.ticker;
  var duration = req.body.optradio;
  
/* Manipulate the post information to get query*/ 
  //get current date
  var ct = DateUtil.getCurrentDateTime();
  //add the certain amount of time duration 
	var pt = DateUtil.getPreviousDateTime(duration);
  
 
/*Call Yahoo Financial API to query and get data*/
yahooFinance.historical({
      symbol: SYMBOL,
      from: pt,
      to: ct,
      period: 'd'
    }, function (err, quotes) {
      
    if (err) { throw err; }
        console.log(util.format(//output the query information to console
          '=== %s (%d) ===',
          SYMBOL,
          quotes
    ).cyan);

    
    if (quotes[0]) {//if quotes returns data, then print the 1st and last records to console
        console.log(
          '%s\n...\n%s',
          JSON.stringify(quotes[0], null, 2),
          JSON.stringify(quotes[quotes.length - 1], null, 2)
        );

    } else {//if no data log 'N/A' to console
      console.log('N/A');
    }

    yahooFinance.snapshot({//using yahoo finance api to get snapshot of the company.
      fields: FIELDS,
      symbol: SYMBOL
    }, function (err, snapshot) {
        if (err) { throw err; }
        /*log snapshot information to console*/
        console.log(util.format('=== %s ===', SYMBOL).cyan);
        console.log(JSON.stringify(snapshot, null, 2));
      
      /* render the query information to web client, using result route*/
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






module.exports = router;
