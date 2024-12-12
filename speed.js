const api = 'http://api.quotable.io/random';
let text=document.querySelector("#text");
let btn=document.querySelector("#btn");
let input=document.querySelector("#input");
let time=document.getElementById('time');
let err=document.querySelector("#error");
let comp=document.querySelector("#comp");
let countdown;
let timeLeft = 60;
let originalText = '';  


const getFacts=async () => {
    console.log("fetching data...");
    let response=await fetch(api);
    let data =await response.json();
    originalText=data.content;
    console.log(originalText);
    text.innerText=originalText;
}

function startCountdown() {
    countdown = setInterval(function() {
        timeLeft--;
        time.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(countdown);
            time.innerText = "Time's up!";
            input.disabled=true;
        }
    }, 1000);
}
btn.addEventListener("click",function(){
    getFacts();
    input.disabled=false;
    startCountdown();
    input.value = '';  
    
});


comp.addEventListener("click",compareText);

function compareText() {
    let inputText = input.value.trim();
    let errors = 0;
    let minLength = Math.min(originalText.length, inputText.length);
    for (let i = 0; i < minLength; i++) {
        if (originalText[i] !== inputText[i]) {
            errors++;
        }
    }
    err.innerText = `Errors => ${errors}`;   
}
