var timestamp1=0;
var timestamp2=0;
var timestamp = 0;
var ptime = 0;


class Vec{
    constructor(x = 0,y = 0)
    {
        this.x = x;
        this.y = y;
    }

    get len(){
        return Math.sqrt(this.x*this.x + this.y*this.y)
    }

    set len(value){
        const fact = value / this.len;
        this.x *= fact;
        this.y *= fact;
    }
}

class Rect{
    constructor(x =0 , y = 0){
        this.pos = new Vec();
        this.size = new Vec(x,y);
    }
    get left(){
        return this.pos.x - this.size.x / 2;
    }

    get right(){
        return this.pos.x + this.size.x / 2;
    }

    get top(){
        return this.pos.y - this.size.y / 2;
    }

    get bottom(){
        return this.pos.y + this.size.y / 2;
    }
}

class Ball extends Rect
{
    constructor()
    {
        super(10,10);
        this.vel = new Vec;
    }
}

class Player extends Rect{
    constructor(){
        super(20,100);
        this.score = 0;
    }
}

class Pong{
    constructor(canvas){
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.ball = new Ball;



        this.players = [
            new Player,
            new Player,
        ];

        this.players[0].pos.x = 40;
        this.players[1].pos.x = this.canvas.width - 40;
        this.players.forEach(player => {
            player.pos.y = this.canvas.height / 2 ;
        });
        let lastTime;
        const callback = (milis) => {
            if(lastTime){
                this.update((milis - lastTime)/1000);
            }
            lastTime = milis;
            requestAnimationFrame(callback);
        };
        callback();
        this.CHAR_PIXEL = 10;
        this.CHARS = [
            '111101101101111',
            '010010010010010',
            '111001111100111',
            '111001111001111',
            '101101111001001',
            '111100111001111',
            '111100111101111',
            '111001001001001',
            '111101111101111',
            '111101111001111',
        ].map(str => {
            const canvas = document.createElement('canvas')
            const s = this.CHAR_PIXEL;
            canvas.height = this.CHAR_PIXEL * 5;
            canvas.width = this.CHAR_PIXEL * 3;
            const context = canvas.getContext('2d');
            context.fillStyle = '#fff';
            str.split('').forEach((fill,i) => {
                if(fill === '1'){
                    context.fillRect((i % 3) * s, (i / 3 | 0) * s, s, s);
                }        
            });
            return canvas;
        });
        
        

        this.reset();
    }
    collide(player,ball){
        if(player.left < ball.right && player.right > ball.left && player.top<ball.bottom && player.bottom > ball.bottom){
            const len = ball.vel.len;
            ball.vel.x = -ball.vel.x;
            ball.vel.y += 300 * (Math.random() - .5)
            ball.vel.len = len * 1.05; 
        }
    }
    draw(){
        this.context.fillStyle = '#000'
        this.context.fillRect(0,0,this.canvas.width,this.canvas.height)
    
        this.drawRect(this.ball);
        this.players.forEach(player => this.drawRect(player));
    
        this.drawScore();
    }

    drawRect(rect){
        this.context.fillStyle = "#fff";
        this.context.fillRect(rect.left,rect.top,rect.size.x,rect.size.y);
    }

    drawScore(){
        const align = this.canvas.width / 3;
        const cw = this.CHAR_PIXEL * 4;
        this.players.forEach((player, index) => {
            const chars = player.score.toString().split('');
            const offset = align * (index + 1) - (cw * chars.length / 2) + this.CHAR_PIXEL / 2;
            chars.forEach((char, pos) => {
                this.context.drawImage(this.CHARS[char|0], offset + pos * cw, 20);
            });
        });
    }

    reset(){
        this.ball.pos.x = this.canvas.width/2;
        this.ball.pos.y = this.canvas.height/2;

        this.ball.vel.x = 0;
        this.ball.vel.y = 0;
    }
    start(){
        if(this.ball.vel.x === 0  && this.ball.vel.y ===0){
            this.ball.vel.x = 300 * (Math.random()>0.5 ? 1 : -1);
            this.ball.vel.y = 300 * (Math.random() * 2 -1 );
            this.ball.vel.len = 200
        }
    }
    update(dt){
        this.ball.pos.x += this.ball.vel.x * dt;
        this.ball.pos.y += this.ball.vel.y * dt;
    
        if(this.ball.left < 0 || this.ball.right > this.canvas.width){
            const playerID = this.ball.vel.x <0 | 0;
            this.players[playerID].score ++;
            if(this.players[0].score === 6 || this.players[1].score === 6){
                location.reload();
            }
            var date = new Date();
            var timestamp2 = date.getTime();
            ptime +=timestamp2;
            console.log(timestamp2)   
            console.log(playerID)
            this.reset();
            if(this.players[1].score === 5){
                document.getElementById('result').textContent = 'You Lost !'
                var test = ptime - timestamp1;
                var min = Math.floor((test/1000/60) << 0)
                var sec = Math.floor((test/1000) % 60);
                document.getElementById('test').textContent = 'Played for '+min+' mins and '+sec+' seconds';
            }
            if(this.players[0].score === 5){
                document.getElementById('result').textContent = 'You Won !'
                var test = ptime - timestamp1;
                var min = Math.floor((test/1000/60) << 0)
                var sec = Math.floor((test/1000) % 60);
                document.getElementById('test').textContent = 'Played for '+min+' mins and '+sec+' seconds';
            }
            
        }
    
        if(this.ball.top < 0 || this.ball.bottom > this.canvas.height){
            this.ball.vel.y = -this.ball.vel.y;
        }

        this.players[1].pos.y = (this.ball.pos.y)*.95;

        this.players.forEach(player => this.collide(player, this.ball));

        this.draw();
    }
}

const canvas=document.getElementById('pong');
const pong = new Pong(canvas);  

canvas.addEventListener('mouseover',event => {
    const scale = event.offsetY / event.target.getBoundingClientRect().height;
    pong.players[0].pos.y = canvas.height * scale;
    
});

canvas.addEventListener('click',event =>{
    pong.start();
    var date = new Date();
    timestamp = date.getTime();
    timestamp1 += timestamp;
    console.log(timestamp);
});


document.addEventListener('keydown',event =>{
    if(event.keyCode === 40){
        pong.players[0].pos.y += 25 ;
        //console.log(pong.players[0].pos.y )
    }
});

document.addEventListener('keydown',event =>{
    if(event.keyCode === 38){
        pong.players[0].pos.y -= 25 ;
        //console.log(pong.players[0].pos.y )
    }
});

document.querySelector('#up').addEventListener('click',functionL);
document.querySelector('#down').addEventListener('click',functionR);
document.querySelector('#dummy').addEventListener('click',functionD);



function functionR(){
    pong.players[0].pos.y += 35 ;
}
function functionL(){
    pong.players[0].pos.y -= 35 ;
}
function functionD(){
    pong.start();
    var date = new Date();
    timestamp = date.getTime();
    timestamp1 += timestamp;
    console.log(timestamp);
}


function play(){
    location.reload();
}