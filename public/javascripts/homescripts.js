window.onload = function(){
  
  var tk = document.getElementById('ticker');
  var fm = document.getElementById('tickerForm');
  var wbox = document.getElementById('warnBox');

  //this is the form validation function
  fm.onsubmit = function(){
    var errMsg = "";
    var vld = true;
    
    var qr = tk.value;
    var pattBegin = /^[A-Z0-9]/i;
    var patt0 = new RegExp(pattBegin);
    
    //This regex checks if the ticker symbol starts with valid letter/numbers or contains valid characters which can crash our system
    var pattBadChar = /[^A-Za-z0-9\.\-]/;
    var patt1 = new RegExp(pattBadChar);
    
    if(!patt0.test(qr) || patt1.test(qr)){
      errMsg += "Ticker Contains Invalid Character.<br />";
    }
    //This checks whether the ticker is too long, it may destroy the system.
    if(qr.length >= 10){
      errMsg += "Ticker Symbol Too Long.<br />";
    }

    if(errMsg != ""){
      wbox.innerHTML= errMsg;
      wbox.style.display = 'block';
      vld = false;
    }


    return vld;
  
  }

  tk.oninput = function(){
    wbox.style.display = 'none';

  }


}   
