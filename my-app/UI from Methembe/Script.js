// variable to hold loading progress

let fill=0;

//function to load the bar
function load_bar(){

    window.setInterval(function(){
        fill+=1;
        if (fill===100){
            clearInterval();
        }
        else{
            document.getElementById("progress_one").style.width=fill+"%";
        }

 }, 50);

}

