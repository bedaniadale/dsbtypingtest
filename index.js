
var curr = 0;
var currloading =0; 
var userTime = 0; 
var errors = 0; 
var timeInterval; 
var loadingInterval ;

var restartbtn = document.querySelector("#res")


function startTime() { 
    timeInterval = setInterval(()=> { 
        userTime++; 
        // sconsole.log("user time: ",  userTime)
    }, 1000)
    
}

function calculateAccuracy() { 
    let correct=document.querySelectorAll(".user").length - errors
    
    return (correct / document.querySelectorAll(".user").length) * 100
}

function startAnimation() { 

    let loadings = [
        'Generating words.',
        'Generating words..',
        'Generating words...'
    ]

    let lw = document.querySelector("#loadingword")
    loadingInterval = setInterval(()=>{ 
        lw.innerHTML = loadings[currloading]
        currloading++
        if(currloading== 3){ 
            currloading =0 
        }
    }, 200)
}

function stopLoading() {
    document.querySelector(".loading").style.display = 'none'
    clearInterval(loadingInterval)
    
} 


function calculateWpm() { 
    let total = document.querySelectorAll(".user").length;
    let acpw = total / 10;
    let ccc = total - errors;
    
    //Make sure 'acpw' is not zero to avoid division by zero
    let wpm = acpw !== 0 ? (ccc / acpw) * (60 / userTime) : 0;
    
    let userwpm = wpm.toString().split(".")[0] 

   //calculate acc 
   let accuracy = calculateAccuracy()
   let useracc  = accuracy.toString().split('.')[0]
   document.querySelector("#wpm").innerHTML = userwpm
   document.querySelector("#acc").innerHTML = `${useracc}% accuracy`
   document.querySelector(".result").style.display= 'flex'

}
function gameOver() { 
    calculateWpm()
    userTime = 0;
    errors = 0;
    clearInterval(timeInterval)
    
}


async function assembleWords(words) { 
    let word = ''
    for(let i = 0; i < words.length; i++) { 
        word+=words[i]
        if(i != words.length-1) word+=" " 
    }
    return word
}

async function fetchWords() { 
    document.querySelector(".result").style.display = 'none'
    document.querySelector(".loading").style.display = 'flex'
    let words = []
    let apiUrl = "https://random-word-api.herokuapp.com/word"
    startAnimation()
    for(let j = 0; j < 10; j++) { 
        let word = await fetch(apiUrl).then((res)=> { 
            return res.json()
        })

        if(word) { 
            words.push(word)
        }
    }

    stopLoading()
    let assembled = await assembleWords(words)
    
    let tab = ''
    for(let x= 0; x < assembled.length; x++) { 
        if(assembled[x] == ' ') { 
            tab+="<h1 class = 'user'>&nbsp;</h1>"
        }
        else  { 
            tab+=`<h1 class = 'user'>${assembled[x]}</h1>`
        }
    }

    document.querySelector(".words").innerHTML = tab
}


document.addEventListener('keydown', function(event) {
    let allKeys = document.querySelectorAll(".user")
    let x = event.key
    let y = allKeys[curr].innerHTML 
    if(isAlphabetKey(event)){ 
        if(curr == 0){ 
            startTime()
            document.querySelector("#reminder").style.display = 'none'
        }

        if(x === y) { 
            allKeys[curr].classList.add("correct")
        } else { 
            errors++; 
            allKeys[curr].classList.add("wrong")
            
        }
        curr++
        if(curr == allKeys.length) { 
            gameOver()
            return 

        }
    }


    if(event.key == ' ') { 
        if(allKeys[curr].innerHTML != "&nbsp;") { 

            allKeys[curr].classList.add("wrong")
            errors++; 
        } 
        curr++
    }
    
    

    if(event.key == 'Backspace') { 
        curr--; 
        let lastClassIndex = allKeys[curr].classList.length - 1;
        if(allKeys[curr].classList[1] == 'correct' || allKeys[curr].classList[1] == 'wrong' ){ 
            allKeys[curr].classList.remove(allKeys[curr].classList[lastClassIndex]);
        }

        
        return
    }

    
    
})

function isAlphabetKey(event) {
    // Check if the pressed key is a letter from A to Z
    return /^[a-zA-Z]$/.test(event.key);
}



fetchWords()

restartbtn.addEventListener("click",()=> { 
    errors = 0; 
    userTime = 0;
    fetchWords()
    console.log("clicked")

}) 