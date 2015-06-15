  

    window.onload = function() {
        var iframe = document.getElementById('graph');
            iframe.src = iframe.src;

        var rbtn = document.getElementById('refreshPicture');
        rbtn.onclick = function(){
        	iframe.src = iframe.src;
        }



    };