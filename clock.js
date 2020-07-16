let timerObj={
    minutes:0,
    seconds:0,
    timerId:0
}
function soundAlarm(){
    let amount=3;
    let audio=new Audio("clock_s.mp3");
    audio.play();
    function playSound(){
        audio.pause();
        audio.currentTime=0;
        audio.play();
    }
    for(let i=0;i<amount;i++){
        setTimeout(playSound,1200*i)
    }
}
function updateValue(key,value){
    if(value<0){
        value=0;
        console.log("positive numbers only");
    }
    if(key=="seconds"){
        if(value<10){
            value="0"+value;
        }
        if(value>59){
            value=59;
        }
    }
    $("#"+key).html(value || 0);
    timerObj[key]=value;
}

//bellow is a self calling function
(function detectChanges(key){
    console.log("detect changes");
    let input="#"+key+"-input";

    $(input).change(function(){
        updateValue(key,$(input).val());
    });
    $(input).keyup(function(){
        updateValue(key,$(input).val());
    });

    return arguments.callee;

})("minutes")("seconds");

//function to start timer and freeze the timer as well as enable the Pause and stop button
function startTimer(){
    buttonManager(["start",false],["Pause",true],["stop",true]);
    freezeInputs();

    timerObj.timerId=setInterval(function(){
        timerObj.seconds--;
        if(timerObj.seconds<0){
            if(timerObj.minutes==0){
                soundAlarm();
                return stopTimer();
            }
            timerObj.seconds=59;
            timerObj.minutes--;
        }
        updateValue("minutes",timerObj.minutes);
        updateValue("seconds",timerObj.seconds);
    },1000);
}

//function to stop timer and unfreeze the timer as well as disable the Pause and stop button
function stopTimer(){
    clearInterval(timerObj.timerId);
    buttonManager(["start",true],["Pause",false],["stop",false]);
    unfreezeInputs();
    updateValue("minutes",$("#minutes-input").val());
    let seconds=$("#seconds-input").val();
    if(seconds<10){
        seconds="0"+seconds;
    }
    updateValue("seconds",seconds);
}

//function to pause timer enable the Start and stop button
function pauseTimer(){
    buttonManager(["start",true],["Pause",false],["stop",true]);
    clearInterval(timerObj.timerId);
}

//we will use rest operator here which will let you pass as many arguments as you want to a function
//here every elements in the array will be an array
function buttonManager(...buttonArray){
    for(let i=0;i<buttonArray.length;i++){
        let button='#'+buttonArray[i][0]+"-button";
        if(buttonArray[i][1]){
            $(button).removeAttr("disabled");
        }else{
            $(button).attr("disabled","disabled");
        }
    }  
}

function freezeInputs(){
    $("#minutes-input").attr("disabled","disabled");
    $("#seconds-input").attr("disabled","disabled");
}

function unfreezeInputs(){
    $("#minutes-input").removeAttr("disabled");
    $("#seconds-input").removeAttr("disabled");
}

