const canvas = document.getElementById("main canvas");
const ctx = canvas.getContext("2d");
const backCanvas = document.getElementById("back canvas")
const Bctx = backCanvas.getContext("2d");




//images

//'game' = moving backgound and stuff
//'loading' = what do u think
//'start?' = titleScreen shown, if start(unicode 13) is pressed,
//  then go to game
let g_BGstats = 'loading';

//moves
const linkUp = document.getElementById("playerUp");
const linkDown = document.getElementById("playerDown");
const linkLeft = document.getElementById("playerLeft");
const linkRight = document.getElementById("playerRight");

//sheilds
const shield = document.getElementById("shield");

//swords
const swordUp = document.getElementById("sword up");
const swordDown = document.getElementById("sword down");
const swordLeft = document.getElementById("sword left");
const swordRight = document.getElementById("sword right");

//BG
const boundaries = document.getElementById("boundaries");
const background = document.getElementById("background");
const titleScreen = document.getElementById("title screen");

//swordswing
const swordswingDown = document.getElementById("swordswing down");
const swordswingLeft = document.getElementById("swordswing left");
const swordswingRight = document.getElementById("swordswing right");
const swordswingUp = document.getElementById("swordswing up");

//enemy stance
const enemyImages = {
	'swordsmen': document.getElementById('swordsmen'),
	'shieldsmen': document.getElementById('shieldsmen'),
	'spearsmen': document.getElementById('spearsmen'),
	'bombermen': document.getElementById('bombermen'),
}
const enemyDeath = document.getElementById('enemy death');

//player's stuff
const stand_jonny = document.getElementById('player jonny');
const sword = document.getElementById('sword left');
const swordswing = document.getElementById('swordswing left');
const swordSpin = document.getElementById('sword spin');
const jonnyWinPose = document.getElementById('jonny win pose');

const cursor = document.getElementById('cursor');
const textBox = document.getElementById('text box');

//letter
var letterList = {
	'a': document.getElementById('letterA'),
	'b': document.getElementById('letterB'),
	'c': document.getElementById('letterC'),
	'd': document.getElementById('letterD'),
	'e': document.getElementById('letterE'),
	'f': document.getElementById('letterF'),
	'g': document.getElementById('letterG'),
	'h': document.getElementById('letterH'),
	'i': document.getElementById('letterI'),
	'j': document.getElementById('letterJ'),
	'k': document.getElementById('letterK'),
	'l': document.getElementById('letterL'),
	'm': document.getElementById('letterM'),
	'n': document.getElementById('letterN'),
	'o': document.getElementById('letterO'),
	'p': document.getElementById('letterP'),
	'q': document.getElementById('letterQ'),
	'r': document.getElementById('letterR'),
	's': document.getElementById('letterS'),
	't': document.getElementById('letterT'),
	'u': document.getElementById('letterU'),
	'v': document.getElementById('letterV'),
	'w': document.getElementById('letterW'),
	'x': document.getElementById('letterX'),
	'y': document.getElementById('letterY'),
	'z': document.getElementById('letterZ'),

	'/': document.getElementById('slash'),
	',': document.getElementById('comma'),
	':': document.getElementById('colon'),
	'.': document.getElementById('period'),
	'?': document.getElementById('question'),
	';': document.getElementById('semi colon'),
	"'": document.getElementById('single quote'),

	'0': document.getElementById('number0'),
	'1': document.getElementById('number1'),
	'2': document.getElementById('number2'),
	'3': document.getElementById('number3'),
	'4': document.getElementById('number4'),
	'5': document.getElementById('number5'),
	'6': document.getElementById('number6'),
	'7': document.getElementById('number7'),
	'8': document.getElementById('number8'),
	'9': document.getElementById('number9'),
}






// VARIABLEs
// the amount in pixels it moves every time you click it
let speed = 10;

//num of px(on screen) in a px(on game)
const PX_NUM = 3;

const g_screenSizeX = 1200;
const g_screenSizeY = 750;

const centerX = g_screenSizeX / 2;
const centerY = g_screenSizeY / 2;

// which frame it's on (enemy animation)
let appearFrame = 0;

// which frame it's on (walking animation)
let g_frameNum = 0;

// which frame the sword swing is on
let g_swordFrame = -1;

//player postion
let playerPosX = 0;
let playerPosY = 0;


// the amount added to playerx and playery to get to the spawn point
playerPosX -= 2247 - (g_screenSizeX/PX_NUM)/2;
playerPosY -= 2851 - (g_screenSizeY/PX_NUM)/2; 


let direct = 2;

// the letters to be printed
var letterPrint = [];

// 1 = on 0 = not on 2 = was the last to be pressed
var currentKey = {
	//start button
	// return
	'13': false,
	//move buttons
	'222': false,
	'76': false,
	'80': false,
	'186': false,
	//swordswing button
	// "s"
	'83': false,
	//Y button, (w);
	'119': false,
	//A button, (d)
	'68': false,

};

// x and y of the button you are on
let g_mousePos = [0, 0];

//the action that is going to be done after select the enemy
let g_selectedAction;

//ENEMY DEATH ANIMATION FRAME NUMBER
let DeathFrame = 0;

//player Win ANIMATION FRAME NUMBER
let swordSpinFrame = 0;

// if it is time to do the next action.
let g_doAction = true;

// damage delt to all enemies, resets every time you attack
let g_DMG;

//frame # for the disapearing act
let disapearFrame = 0;

// the order of attack, set in main loop, when 
let g_turnList = [];

// the attack multiplyer at the start
//method shown above, may change
//damage = (40+(Math.floor(ATK*Math.random()) * (ATK/10);
let damage;

// when this turns false, the battle ends
let battle = true;
//number of enemies in the battle
let enemyNum = 1;

let swordFrame = 0;

let g_playerStatus = {
	'party': ['jonny','shine'],
	'jonny': {
		//positions on screen
		'posx': 0,
		'posy': 0,
		//stats
		'NAME': 'jonny',
		'HP': 9999,
		'FULL HP': 9999,
		'STM': 999,
		'FULL STM': 999,
		'ATK': 9999,
		//Chance of getting to attack first in a turn.
		'SPD': 3,
		//critical rate
		'CRT': null,
		//the moves Jonny can do
		'abilities': ['attack','defend','escape'],
		//the status it is on, if not, then set to none.
		'status': null,
		//images
		'stance': [document.getElementById('player jonny'), 16, 23],
		'sword': [document.getElementById('sword left'), 18, 120],
		'sword swing': [document.getElementById('swordswing left'), 121, 25],
		'sword spin': [document.getElementById('sword spin'), 18, 18],
		'win pose': [document.getElementById('jonny win pose'), 16, 24],

	},
	'shine': {
		//positions on screen
		'posx': 0,
		'posy': 0,
		//stats
		'NAME': 'shine',
		'HP': 9999,
		'FULL HP': 9999,
		'STM': 999,
		'FULL STM': 999,
		'ATK': 9999,
		//Chance of getting to attack first in a turn.
		'SPD': 8,
		//critical rate
		'CRT': null,
		//the moves Jonny can do
		'abilities': ['attack','magic','escape'],
		//the status it is on, if not, then set to none.
		'status': null,
		//images
		'stance': [document.getElementById('Shine stance'), 36, 27],
		'sword': [document.getElementById('brush left'), 18, 120],
		'sword swing': [document.getElementById('brushswing left'), 121, 25],
		'sword spin': [document.getElementById('brush spin'), 18, 18],
		'win pose': [document.getElementById('shine win pose'), 16, 24],
	}
}

//stats of all enemies in the game
const g_bestiary = {
	'swordsmen': {
		//positions on screen
		'posx': 0,
		'posy': 0,
		'NAME': 'swordsmen',
		//stats
		'HP': 90,
		'FULL HP': 90,
		'ATK': 5,
		// chance of doging attacks
		'SPD': 3,
		//critical rate
		'CRT': null,
		//a function called every time 
		'AI': () => {
            return 'attack';
		},
		'status': null,
	},
	'shieldsmen': {
		//positions on screen
		'posx': 0,
		'posy': 0,
		'NAME': 'shieldsmen',
		//stats
		'HP': 120,
		'FULL HP': 120,
		'ATK': 3,
		// chance of doging attacks
		'SPD': 1,
		//critical rate
		'CRT': null,
		//a function called every time 
		'AI': () => {
            return 'attack';
		},
		'status': null,
	},
	'spearsmen': {
		//positions on screen
		'posx': 0,
		'posy': 0,
		'NAME': 'spearsmen',
		//stats
		'HP': 90,
		'FULL HP': 90,
		'ATK': 3,
		// chance of doging attacks
		'SPD': 3,
		//critical rate
		'CRT': null,
		//a function called every time 
		'AI': () => {
            return 'attack';
		},
		'status': null,
	}
}

//current enemy you are fighting
let enemy;

//the position of the buttons(not on screen)
let g_buttonPos = [];
for (let c = 0; c < 3; c++) {
	g_buttonPos[c] = 'none';
}
//create buttons here 
g_buttonPos[0] = 'attack';
g_buttonPos[1] = 'defend';
g_buttonPos[2] = 'escape';

// percentage chance of enemy appearence every second
const enemyAppearencePerSecond = 99;

// dialogues of different people when you talk to them
// every person has a dialogue array. when you talk to them, you will call the first string in the array
// then when you press "S" you will go on to the next string.

const npc_Shine = {
	name: 'Shine',
	init_x: 1267,
	init_y: 2807,
	stanceImage: document.getElementById('Shine appearence'),
	job: 'recruit',
	dialogue:  [
		'hmm? who are you?', 
		'you are a travler? i see, and you wish to me to aid you on your adventure?', 
		'very well, since i got nothing else to do, might as well be of use.'
	],
}

const g_NPC = [
    npc_Shine, 
];
 
//the dialogue that is going to be used when in talking status
let g_currentDialogue;

const tutorial = [
	"press start to skip turoial",
    "use the buttons: p l ; '  on the keyboard to move.",
    "press s to swing sword. press d to talk.",
    "good luck."
]