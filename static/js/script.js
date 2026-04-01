$(window).ready(function(){
    let team1score = 0;
    let team2score = 0;
    let currentPoints = 0;
    let currentModal = "";
    let showAnswer = false;
    let time = 0;
    let closeModal;

    $(".card-number").click(function(){
        closeModal = false;
        showAnswer = false; 
        time = 60;     
        let cardId = $(this).attr("id");
        currentModal = "#"+cardId+"-m";
        if(!$(this).hasClass("cardClicked")){   
            $(currentModal).css("display", "flex");          
            timeVal = timer(time);
            $(".btn-close").click(function(){  
                closeModal = true;    
                currentPoints = parseInt(currentModal.slice(6,9));
                $(".card-modal-wrapper").css("display", "none");
                $("#"+cardId).addClass("cardClicked");
            }); 
        }
    });  

    function timer(time){
        let timer = setInterval(function(){
            console.log(closeModal);
            if(time == 0 && showAnswer == false && closeModal == false){   
                $(currentModal+' .seconds').text(time+"s");             
                $(currentModal+" .question").css("display", "none");
                $(currentModal+" .timesUp").css("display", "block");
                $(currentModal+" .btn-steal").removeAttr("disabled");   
                clearInterval(timer);        
            } else if(showAnswer == true && closeModal == false){
                clearInterval(timer);
            } else if(time > 0 && showAnswer == false && closeModal == false){
                $(currentModal+' .seconds').text(time+"s");
                time--;
            } else if(closeModal == true){
                closeModal = false;
                clearInterval(timer);               
            }           
        }, 1000);
    }

    $(".btn-showAnswer").click(function(){         
        $(currentModal+" .question").css("display", "none");
        $(currentModal+" .timesUp").css("display", "none");
        $(currentModal+" .card-answer").css("display", "block");
        showAnswer = true;
    }); 

    $(".btn-steal").click(function(){
        $(currentModal+" .question").css("display", "block");
        $(currentModal+" .timesUp").css("display", "none");
    });

    
    $("#team1score-btn").click(function(){
        team1score = parseInt($(".team1score").text()) + currentPoints;
        $(".team1score").text(team1score);
        currentPoints = 0;
        currentModal = "";
    })

    $("#team2score-btn").click(function(){
        team2score = parseInt($(".team2score").text()) + currentPoints;
        $(".team2score").text(team2score);
        currentPoints = 0;
        currentModal = "";
    })
    
});
    
