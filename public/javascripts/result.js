/*This does only one thing: refresh the pic in case it does not appear.*/  

window.onload = function() {
    var iframe = document.getElementById('graph');
        iframe.src = iframe.src;
//give return button the onclick event that it will reset the src attribute of the graph
    var rbtn = document.getElementById('refreshPicture');
    rbtn.onclick = function(){
        iframe.src = iframe.src;
    }
};