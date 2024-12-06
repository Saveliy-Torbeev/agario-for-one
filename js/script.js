'use strict'

let newGameButton = document.querySelector('.new-game-button')

let mainBall

let speed = 0.009

let colors = [
    '0, 0, 255',
    '0, 128, 0',
    '255, 255, 0',
    '255, 0, 0',
    '0, 255, 255',
    '205, 92, 92',
    '255, 20, 147',
    '255, 140, 0',
    '240, 230, 140',
    '138, 43, 226',
    '188, 143, 143',
    '47, 79, 79',
]

let  mainBallColor = colorRandom(colors) 

let usedCords = []

let coordsX =[]
let coordsY = []

let nowCordsX = 0
let nowCordsY = 0

let mainBallCoords = []

let counter = 0

for (let i = 25; i < (+document.body.offsetWidth - 25);i+=25){
    coordsX.push(+i)
}

for(let  j = 25; j < (+document.body.offsetHeight - 25);j+=25){
    coordsY.push(+j)
}


newGameButton.onclick = function(){
    document.querySelector('.wrapper').style.display = 'none'
    mainBallCreate()
    scoreCreate()
    ballControl()
    ballCreate()
    
    setInterval(function(){
        if (counter >= 500){
            clearInterval()
        }else{
            ballCreate()
        }
        
    }
    , 5000);
    mainBallAtePoint()
    
}

function mainBallCreate(){
    mainBall = document.createElement('div')
    mainBall.classList.add('main-ball') 
    document.body.append(mainBall)
    
    mainBall.style.backgroundColor = `rgb(${mainBallColor})`
}

function scoreCreate(){
    let score = document.createElement('div')
    score.classList.add('counter')
    document.body.append(score)

    score.innerHTML = 'Вас счет:0 '
}



function ballControl(){
    let mouse = {x:0,y:0}
    let ball = {x:0,y:0}

    window.addEventListener('pointermove',function(e){
        mouse.x = e.x
        mouse.y = e.y
    })

    let tick = () =>{
        choiceSpeed()

        ball.x +=(mouse.x - ball.x) * speed
        ball.y +=(mouse.y - ball.y) * speed

        mainBall.style.transform = `translate(${ball.x}px, ${ball.y}px`

        mainBall.style.left = `-${mainBall.offsetWidth / 2}px`
        mainBall.style.top = `-${mainBall.offsetHeight / 2}px`

        window.requestAnimationFrame(tick)
    }

    tick()
}

function ballCreate(){
    if(usedCords.length >= 20){
        return
    }

    let ball = document.createElement('div')
    ball.classList.add('ballPoint')

    ballRandomCoords()

    ball.style.top = `${nowCordsY-13}px`
    ball.style.left = `${nowCordsX-13}px`
    ball.style.backgroundColor = `rgb(${colorRandom(colors)})`

    document.body.append(ball)
    
    return ballCreate()
    
}

 
function colorRandom(arr){
   return arr[+(Math.floor(Math.random() * arr.length))]
}
function ballRandomCoords(){
    let x = coordsX[+(Math.floor(Math.random() * coordsX.length))]
    let y = coordsY[+(Math.floor(Math.random() * coordsY.length))]

    if (!(mainBallCoords.includes(`${x}:${y}`)) && !(usedCords.includes(`${x}:${y}`))){

        usedCords.push(`${x}:${y}`)

        nowCordsX = x
        nowCordsY = y
    }
    
}

function mainBallAtePoint(){
    window.addEventListener('pointermove',function(e){
        let mainBallX = Math.floor(mainBall.getBoundingClientRect().left + (mainBall.offsetWidth/2))
        let mainBallY = Math.floor(mainBall.getBoundingClientRect().top +(mainBall.offsetHeight/2))

        mainBallCoords = []
       
        for(let i = 0; i <= (mainBall.offsetWidth/2); i += 25){
            for (let j = 0;j < 50; j++){
                let mainBallCoordsX = roundToMultiple((mainBallX + i * Math.cos(2*Math.PI * j /50)),25)
                let mainBallCoordsY = roundToMultiple((mainBallY + i * Math.sin(2*Math.PI * j /50)),25)

                mainBallCoords.push(`${mainBallCoordsX}:${mainBallCoordsY}`)
            }
        }
        
        for(let i = 0 ; i < mainBallCoords.length; i++){
            if(usedCords.includes(mainBallCoords[i])){
                let index = usedCords.indexOf(mainBallCoords[i]);

                if (index !== -1) {
                    usedCords.splice(index, 1);
                }

                increaseSize()

                let cordBall = mainBallCoords[i].split(':') 

                let elementToDelete = document.elementsFromPoint(cordBall[0], cordBall[1]);
              
                
                for (let i = 0; i < elementToDelete.length; i++){
                    if (elementToDelete[i].classList.contains('ballPoint')) {
                        elementToDelete[i].remove(elementToDelete[i])
                    }
                }             
            }
        }
       
    })
}

function mainBallCoordsFn(steps,radius,centerX,centerY){
    let coordsX = [centerX]
    let coordsY = [centerY]

    for (let i = 0;i< steps; i++){
        coordsX[i] = (centerX + radius * Math.cos(2*Math.PI * i /steps))
        coordsY[i] = (centerY + radius * Math.sin(2*Math.PI * i /steps))
    }
}


function increaseSize(){
    let width = mainBall.offsetWidth
    let height = mainBall.offsetHeight

    mainBall.style.width = `${width + 2}px`
    mainBall.style.height = `${height + 2}px`
    mainBall.style.borderWidth = `${mainBall.offsetWidth * 0.02}px`
    
    counter++

    win()
    
    document.querySelector('.counter').innerHTML = `Вас счет:${counter} `
}



function win(){
    if (counter ==500){
    setTimeout(function(){
        document.body.innerHTML = '<div class = "winner">Вы победили!</div>'
    },1500)}
    
}

function roundToMultiple(num, multiple) {
    return Math.round(num/multiple)*multiple;
}

function choiceSpeed(){
  if(counter <= 50){
    speed = 0.009
  } else if(counter <= 100){
    speed = 0.008
  } else if(counter <= 150){
    speed = 0.007
  } else if(counter <= 200){
    speed = 0.006
  } else if(counter <= 250){
    speed = 0.005
  } else if(counter <= 300){
    speed = 0.004
  } else if(counter <= 350){
    speed = 0.003
  } else if(counter <= 400){
    speed = 0.002
  }
}