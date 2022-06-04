// #Importing Sound Effects
const introMusic = new Audio("./music/introSong.mp3");
const shootingSound = new Audio("./music/shoooting.mp3");
const killEnemySound = new Audio("./music/killEnemy.mp3");
const gameOverSound = new Audio("./music/gameOver.mp3");
 
// #Basic Environment Setup
const canvas = document.createElement("canvas");
document.querySelector(".myGame").appendChild(canvas);
canvas.width = innerWidth;
canvas.height = innerHeight;
const context = canvas.getContext("2d");
const damage = 10; 
let difficulty = 2;
const form = document.querySelector("form");
const scoreBoard = document.querySelector(".scoreBoard");
let playerScore = 0;

// #Basic Functions

introMusic.play();

// *Event Listener for Difficulty form
document.querySelector("input").addEventListener("click", (e) => 
{
  e.preventDefault();
  introMusic.pause();                                                       // stoping Music 
  form.style.display = "none";                                              // making form invisble
  scoreBoard.style.display = "block";                                       // making scoreBoard visble

  const userValue = document.getElementById("difficulty").value;            // getting diffculty selected by user

  if (userValue === "Easy") 
  {   setInterval(spawnEnemy, 2000);
      return (difficulty = 5);   }
  else if (userValue === "Medium") 
  {   setInterval(spawnEnemy, 1400);
      return (difficulty = 8);   }
  else if (userValue === "Hard") 
  {   setInterval(spawnEnemy, 1000);
      return (difficulty = 10);   }
  else if (userValue === "Insane") 
  {   setInterval(spawnEnemy, 700);
      return (difficulty = 12);   }
});

// *Endscreen
const gameoverLoader = () => 
{
  const gameOverBanner = document.createElement("div");                     // Creating endscreenDiv, playAgainButton, highScoreDiv
  const gameOverBtn = document.createElement("button");
  const highScore = document.createElement("div");

  highScore.innerHTML = `High Score : ${ localStorage.getItem("highScore") ? localStorage.getItem("highScore") : playerScore }`;

  const oldHighScore = localStorage.getItem("highScore") && localStorage.getItem("highScore");

  if (oldHighScore < playerScore) 
  {   localStorage.setItem("highScore", playerScore);
      highScore.innerHTML = `High Score: ${playerScore}`;   }               // updating high score html


  gameOverBtn.innerText = "Play Again";                                     // adding text to playAgainButton
  gameOverBanner.appendChild(highScore);
  gameOverBanner.appendChild(gameOverBtn);
  gameOverBtn.onclick = () => { window.location.reload(); };                // making reload on clicking playAgain button
  gameOverBanner.classList.add("gameover"); 
  document.querySelector("body").appendChild(gameOverBanner);
};


// -------------------------------creating Player, Weapon, Enemy classes-----------------------------------
 
playerPosition = { x: canvas.width/2, y: canvas.height/2,};                 // setting player position to center
 
class Player 
{
  constructor(x, y, radius, color) 
  { this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color; }

  draw() 
  { context.beginPath();
    context.arc( this.x,
                 this.y,
                 this.radius,
                 (Math.PI / 180) * 0,
                 (Math.PI / 180) * 360,
                 false );
    context.fillStyle = this.color; 
    context.fill(); }
}


class Weapon 
{
  constructor(x, y, radius, color, velocity, damage) 
  { this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.damage = damage; }

  draw() 
  { context.beginPath();
    context.arc( this.x,
                 this.y,
                 this.radius,
                 (Math.PI / 180) * 0,
                 (Math.PI / 180) * 360,
                 false );
    context.fillStyle = this.color;
    context.fill(); }

  update() 
  { this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y; }
}
 
 
class Enemy 
{
  constructor(x, y, radius, color, velocity) 
  { this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity; }

  draw() 
  { context.beginPath();
    context.arc( this.x,
                 this.y,
                 this.radius,
                 (Math.PI / 180) * 0,
                 (Math.PI / 180) * 360,
                 false );
    context.fillStyle = this.color;
    context.fill(); }

  update() 
  { this.draw();
    (this.x += this.velocity.x), (this.y += this.velocity.y); }
}


// --------------------------------------------Main Logic Implementation-------------------------------------------

// *Creating Player Object, Weapons Array, Enemy Array etc Array

const shubham = new Player(playerPosition.x, playerPosition.y, 15, "white");
const weapons = []; 
const enemies = []; 
 
// *Function To Spawn Enemy (producing offspring) at Random Location 

const spawnEnemy = () => 
{
  const enemySize = Math.random() * (40-5) + 5;                             // generating random size for enemy
  const enemyColor = `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`;  // generating random color for enemy

  let random;                                                               // random is enemy spawn position
  if (Math.random() < 0.5)                                                  // making enemy's initial location  
  {                                                                         // making X very left/right off of screen & Y any 
    random = { x: Math.random()<0.5 ? canvas.width+enemySize : 0-enemySize, y: Math.random()*canvas.height, };
  } 
  else 
  {                                                                         // making X any & Y very up/down off of screen 
    random = { x: Math.random()*canvas.width, y: Math.random()<0.5 ? canvas.height+enemySize : 0-enemySize, };
  }
 
  const myAngle = Math.atan2( canvas.height/2 - random.y, canvas.width/2 - random.x );    // angle between center & enemy 
  const velocity = { x: Math.cos(myAngle)*difficulty, y: Math.sin(myAngle)*difficulty, }; // velocity based on difficulty 
  enemies.push(new Enemy(random.x, random.y, enemySize, enemyColor, velocity));           // adding enemy to enemies array
};
 
// *Creating Animation Function  

let animationId;
function animation() 
{
  animationId = requestAnimationFrame(animation);                           // making recursion
  scoreBoard.innerHTML = `Score : ${playerScore}`;                          // updating Player Score in Score board in html
  context.clearRect(0, 0, canvas.width, canvas.height);                     // clearing canvas on each frame
  shubham.draw();                                                           // drawing player
 
  weapons.forEach((weapon, weaponIndex) =>                                  // generating bullets
  { 
    weapon.update();

    if(weapon.x+weapon.radius<1 || weapon.y+weapon.radius<1 || weapon.x-weapon.radius>canvas.width || weapon.y-weapon.radius>canvas.height)
    weapons.splice(weaponIndex, 1);                                         // removing Weapons if they are off screen
  });


  enemies.forEach((enemy, enemyIndex) =>                                    // generating enemies
  { 
    enemy.update();                                          
                                                                            // finding distance between player and enemy
    const distanceBetweenPlayerAndEnemy = Math.hypot( shubham.x-enemy.x, shubham.y-enemy.y );  
 
    if (distanceBetweenPlayerAndEnemy-shubham.radius-enemy.radius < 1)     // stopping Game if enemy hits player
    { cancelAnimationFrame(animationId);

      gameOverSound.play(); 
      shootingSound.pause(); 
      killEnemySound.pause();
      return gameoverLoader(); }
  
    weapons.forEach((weapon, weaponIndex) => 
    {                                                                       // finding Distance between weapon and enemy
      const distanceBetweenWeaponAndEnemy = Math.hypot( weapon.x-enemy.x, weapon.y-enemy.y );  

      if (distanceBetweenWeaponAndEnemy-weapon.radius-enemy.radius < 1) 
      { killEnemySound.play();

        playerScore += 10;                                                  // finding distance between weapon and enemy
        scoreBoard.innerHTML = `Score : ${playerScore}`;                    // rendering player Score in scoreboard html element
        setTimeout(() => { enemies.splice(enemyIndex, 1); weapons.splice(weaponIndex, 1); }, 0); }  
    });
  });
}

// *Adding Event Listeners 

canvas.addEventListener("click", (e) =>                                     // Event Listener for Weapon (on left click)
{
  shootingSound.play();
                                                                            // finding angle between player & click co-ordinates
  const myAngle = Math.atan2( e.clientY - canvas.height/2, e.clientX - canvas.width/2 );    
  const velocity = { x: Math.cos(myAngle) * 6, y: Math.sin(myAngle) * 6, }; // making const speed for weapon

  weapons.push( new Weapon( canvas.width/2,                                 // adding weapon in weapons array
                            canvas.height/2,
                            6,
                            "white",
                            velocity,
                            damage ) );
}); 
 
addEventListener("contextmenu", (e) => { e.preventDefault(); });
addEventListener("resize", () => { window.location.reload(); });
animation();






