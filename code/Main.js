// tells you if an element is in an array
const is_in = (a, vector) => {
	for (let i=0;i < vector.length; i++) {
		if (vector[i] === a) {
			return true;
		}
	}
	return false;
}

// when button uo it resets the unicode number to Null.
const handleKeyUp = e => {

	lastPos = [g_mousePos[0], g_mousePos[1]];

	//changing the position of the curor 
	if (currentKey['40']) g_mousePos[1] += 1;
	if (currentKey['37']) g_mousePos[0] -= 1;
	if (currentKey['38']) g_mousePos[1] -= 1;
	if (currentKey['39']) g_mousePos[0] += 1;

	//if the player presses B
    if (currentKey['65'] && g_BGstats === 'select target') {
		g_BGstats = 'jonny action';	
	}

	//if they select a move to use

	if (currentKey['83'] && g_BGstats.split(" ")[1] === 'action') {
		g_BGstats = 'select target';
		g_selectedAction = g_buttonPos[g_mousePos[1]]
	} else if (currentKey['83'] && g_BGstats === 'select target'){
		actionManagement(g_selectedAction, g_turnList[0], enemy[g_mousePos[1]]);
	}

	//if the mouse is outside the button selection list
	if (g_mousePos[0] < 0 || g_mousePos[1] < 0) {
		g_mousePos = lastPos;
	}
	// diaogue shi*
	if (currentKey['68']) {
		for (let i = 0; i < g_NPC.length; i++) {
			npcX = g_NPC[0].init_x;
			npcY = g_NPC[0].init_y;
			//you need to find the distance between you and the NPC.
			// note that the number is divided by PX_NUM
			distanceX = 0-playerPosX - (npcX-g_screenSizeX/2/PX_NUM);
			distanceY = 0-playerPosY - (npcY-g_screenSizeY/2/PX_NUM);

			if (distanceX < 30 && distanceX > -30) {
				if (distanceY <= 30 && distanceY >= -30) {
					//changes BGstats, and set the dialogue strings
					g_currentDialogue = g_NPC[i].dialogue;
					g_BGstats = 'talk';
				}
			}
		}
	}
	// if in diaogue and you press next ("s"key)
	if (currentKey['83']) {
		if ( g_BGstats === 'talk' || g_BGstats === 'tutorial') {
			g_currentDialogue.shift();
			if (g_currentDialogue.length === 0) {
				g_currentDialogue = undefined;
				g_BGstats = 'game';
			}
		}
	}
	// if you press 'W', you go to menu
	if (currentKey['119']) {
		g_BGstats = 'menu';
	}
	//resetting keys

	// walking system needs this because of the diagnal walks.
	if (currentKey['222'] == 1) { currentKey['222'] = 2 };
	if (currentKey['76'] == 1) { currentKey['76'] = 2 };
	if (currentKey['80'] == 1) { currentKey['80'] = 2 };
	if (currentKey['186'] == 1) { currentKey['186'] = 2 };

	if (currentKey['222'] == 2) { currentKey['222'] = 0 };
	if (currentKey['76'] == 2) { currentKey['76'] = 0 };
	if (currentKey['80'] == 2) { currentKey['80'] = 0 };
	if (currentKey['186'] == 2) { currentKey['186'] = 0 };

	currentKey['37'] = 0;
	currentKey['38'] = 0;
	currentKey['39'] = 0;
	currentKey['40'] = 0;
	//action buttons
	currentKey['83'] = 0;
	currentKey['65'] = 0;
    currentKey['68'] = 0;
	currentKey['13'] = 0;
	g_frameNum = 0;
}

// when button down sets the unicode to the button pressed.
const handleKeyDown = e => {
	currentKey[e.keyCode] = 1;
	// up = p left = l right = ' down = ;'
	if (e.keyCode === 83)
		g_swordFrame = 0;

	if (currentKey[13] === 1) {
		if (g_BGstats === 'start?') {
			g_BGstats = 'tutorial';
			g_currentDialogue = tutorial;
		} else if (g_BGstats === 'tutorial') {
			g_BGstats = 'game';
		}	
	}
	
};

//draws EVERY THING
const drawBG = () => {
	// clear canvas
	//ctx.clearRect(0, 0, ctx.width, ctx.height);
	ctx.beginPath();

	//re filling background. 
	ctx.fillStyle = '#7c7c7c';
	ctx.lineWidth = '5';
	
	if (g_BGstats !== 'end') {
		ctx.fillRect(0, 0, g_screenSizeX, g_screenSizeY);
		ctx.rect(0, 0, g_screenSizeX, g_screenSizeY);
	} else {
		ctx.fillStyle = '#000'
		ctx.fillRect(0,0, g_screenSizeX, g_screenSizeY)
	}
	ctx.stroke();
	
	switch (g_BGstats) {
		
		case 'loading':
			writeWord('loading', 900, 700)
		break;

		case 'start?':
			ctx.drawImage(titleScreen, 0, 0, g_screenSizeX, g_screenSizeY);
		break;

		case 'tutorial':
		    ctx.fillStyle = '#f00';
			ctx.fillRect(0,0, g_screenSizeX, g_screenSizeY);

			const text = g_currentDialogue[0];
			const textWidth = text.length * 8 * PX_NUM;
			const textHeight = 8 * PX_NUM;
			const x = g_screenSizeX / 2 - textWidth / 2;
			const y = g_screenSizeY / 2 - textHeight / 2;

			writeWord(text, x, y, 'centered');
		break;

		case 'game':
				
			imgx = playerPosX * PX_NUM;
			imgy = playerPosY * PX_NUM;

			//draw the bounderies skin first.	
			Bctx.drawImage(boundaries, imgx, imgy, 4109 * PX_NUM, 4110 * PX_NUM);

			ctx.drawImage(background, imgx, imgy, 4109 * PX_NUM, 4110 * PX_NUM);

			drawPlayer();
			//drawShield();
			drawSword();

			//drawing Shine
			drawNPCs();
		break;
		
		case 'talk':
				
			imgx = playerPosX * PX_NUM;
			imgy = playerPosY * PX_NUM;

			ctx.drawImage(background, imgx, imgy, 4109 * PX_NUM, 4110 * PX_NUM);

			drawPlayer();
			//drawShield();
     
			//drawing npcs
			drawNPCs();
			//writing the dialogue
			ctx.drawImage(textBox, 10,0, 387*PX_NUM, 78*PX_NUM); 
			writeWord(g_currentDialogue[0], 10*PX_NUM, 10*PX_NUM, g_screenSizeX-10*PX_NUM);
		break;
		
		case 'menu':

			imgx = 30;
			imgy = 30;
			// for every charater 
			for (let i = 0; i < g_playerStatus['party'].length; i++) {
				const charater = g_playerStatus[g_playerStatus['party'][i]];
				imgx += 220 * i;
				//profile pic. can't afford to draw a new one so it's going to be the vitory pose.
				ctx.drawImage(charater['win pose'][0], imgx, imgy, charater['win pose'][1]*PX_NUM,
				 charater['win pose'][2]*PX_NUM);
				
			}
		break;

		case 'surprise':
							
			imgx = playerPosX * PX_NUM;
			imgy = playerPosY * PX_NUM;

			ctx.drawImage(background, imgx, imgy,
				4109 * PX_NUM, 4110 * PX_NUM);

			drawPlayer();
			//drawShield();
			ctx.drawImage(surprise, centerX-15*PX_NUM, centerY-30*PX_NUM, 15*PX_NUM, 15*PX_NUM);

			drawNPCs();
		break;

		case 'fight':
			ctx.save();
			{
				// fills the background black or red when it's cliped, it will only
				// be seen on the outside of the circle.
		
				ctx.fillStyle = '#000'
				ctx.fillRect(0,0,g_screenSizeX,g_screenSizeY);
				
				//screen flicing effect
				ctx.fillStyle = '#f00'
				if (appearFrame%6 < 3) {
					ctx.fillRect(0,0,g_screenSizeX/2,g_screenSizeY);
				} else {
					ctx.fillRect(g_screenSizeX/2 ,0,g_screenSizeX/2,g_screenSizeY);
				}
				
				startBattle();

					imgx = playerPosX * PX_NUM;
					imgy = playerPosY * PX_NUM;

				ctx.drawImage(background, imgx, imgy,
					4109 * PX_NUM, 4110 * PX_NUM);

				drawPlayer();
				drawShield();

			}
			ctx.restore()
		break;

		case 'select target':
			drawCharacterStats(g_playerStatus['party'])
			drawCharacters(g_playerStatus['party']);
			drawEnemies(enemy);
			drawCursor();
			
		break;

		case 'win':
			drawCharacterStats(g_playerStatus['party'])
			writeWord('yeeeeeetus', 200 ,200);
			drawCharacters(g_playerStatus['party']);

		break;
		
		case 'end': 
			ctx.save();
			{
				endBattle();

				ctx.fillStyle = '#7c7c7c'
				ctx.fillRect(0,0, g_screenSizeX, g_screenSizeY)

				drawCharacterStats(g_playerStatus['party']);
				drawCharacters(g_playerStatus['party']);
			}
			ctx.restore()
		break;
		
		default:
			const attacker = g_BGstats.split(" ")[0];
			const action = g_BGstats.split(" ")[1];

				//if it's enemy attack
			if (is_in(attacker, g_playerStatus['party']) === false && action === 'attack') {
				writeWord('hyaaaaaaa', 300, 300);

				drawCharacterStats(g_playerStatus['party'])
				drawCursor();
				drawCharacters(g_playerStatus['party']);
				drawEnemies(enemy);

				//damage delt
				if (g_DMG !== undefined && g_DMG !== null) {
					writeWord(`${g_DMG}`, 200 ,200);
				}
				//player action
			} else if (is_in(attacker, g_playerStatus['party']) && action === 'action') {

				drawButtons(g_playerStatus[g_turnList[0]['NAME']]['abilities']);
				drawCharacterStats(g_playerStatus['party']);
				drawCursor();
				drawCharacters(g_playerStatus['party']);
				drawEnemies(enemy);

				//player attack
			} else if (is_in(attacker, g_playerStatus['party']) && action === 'attack') {

				drawCharacterStats(g_playerStatus['party']);
				drawCursor();
				drawCharacters(g_playerStatus['party']);
				drawEnemies(enemy)

				if (g_DMG !== undefined && g_DMG !== null) {
					writeWord(`${g_DMG}`, 200 ,200);
				}
			} else {
				// if something goes wrong
				console.log('!!! SOMETHING WRONG !!!');
				console.log(g_BGstats)
			}
		break;
	}

}

//calls every 33 milliseconds 
//reacts to the buttons you are pressing.
const mainLoop = () => {
	if (enemy === undefined) {

		let lastPlayerX = playerPosX;
		let lastPlayerY = playerPosY;

        if (g_BGstats === 'game') {
			// left
			if (currentKey[76] === 1) {
				playerPosX += speed;
				direct = 3;
				g_frameNum += 1;
				if (g_frameNum > 9 - 1) { g_frameNum = 0 }
			}
			// right
			if (currentKey[222] === 1) {
				playerPosX -= speed;
				direct = 4;
				g_frameNum += 1;
				if (g_frameNum > 9 - 1) { g_frameNum = 0 }
			}
			// up
			if (currentKey[80] === 1) {
				playerPosY += speed;
				direct = 1;
				g_frameNum += 1;
				if (g_frameNum > 9 - 1) { g_frameNum = 0 }
			}
			// down
			if (currentKey[186] === 1) {
				playerPosY -= speed;
				direct = 2;
				g_frameNum += 1;
				if (g_frameNum > 9 - 1) { g_frameNum = 0 }
			}
		}

		drawBG();

		// if you are in bounds
		if (playerPosX != lastPlayerX ||
			playerPosY != lastPlayerY) {
	  		if (!boundCheck()) {
				playerPosX = lastPlayerX;
				playerPosY = lastPlayerY;
				drawBG();
			}
		}  
		if (g_BGstats === 'talk') {
			if (g_currentDialogue === undefined) {
				g_BGstats = 'game';
			}
		}
	} else {
		//if you win, there is no point of fighting
		if (g_BGstats === 'win') {        
			drawBG();
			swordSpinFrame += 1;
			if (swordSpinFrame > 8) {
				swordSpinFrame = 0;
				setTimeout(()=> {
					g_BGstats = 'end';
				}, 1000)
			}
			return;
		}
		// if the turn has ended and needs to genrate a new order
		if (g_turnList.length === 0) {
			//for now it will be a player 60 and enemy 40 chance.
			// this is the percentage
			let Num = Math.floor(Math.random()*100);
			// change the 60 into the formula 
			if (Num <= 50) {
				g_turnList.push(g_playerStatus['jonny']);
				for (let i = 0; i < enemy.length; i++) {
					g_turnList.push(enemy[i]);
				}
				g_turnList.push(g_playerStatus['shine']);
			} else {
				g_turnList.push(g_playerStatus['shine']);
				for (let i = 0; i < enemy.length; i++) {
					g_turnList.push(enemy[i]);
				}			
				g_turnList.push(g_playerStatus['jonny']);
			}
		}
		// if it is time to do the next turn and you didn't win
		if (g_doAction === true) {
			turnManagement();
		}

		if (swordFrame >= 7) {
			swordFrame = -1;
		}

		drawBG();
	}
};

const writeWord = (string, posx, posy, wrapPosx, wrapStyle) => {

	if (wrapPosx === undefined) wrapPosx = 1200;
	if (wrapStyle === undefined) wrapStyle = 'standard';

	let line = 1;
	let whenSwicthed = 0;
    let wrapPos = Math.floor((wrapPosx-posx)/8);

	for (i = 0; i < string.length; i++) {
		var letter = string.charAt(i);

		if (letter !== ' ') {
            if (wrapStyle === 'standard') {

				imgx = (posx + (8 * i) * PX_NUM) - ((8*whenSwicthed)*(line-1)*PX_NUM);
				imgy = posy+(12*(line-1))*PX_NUM;

			} else if (wrapStyle === 'centered') {

				const textWidth = string.length * 8 * PX_NUM;

				imgx = g_screenSizeX / 2 - textWidth / 2;
				imgy = g_screenSizeY / 2 - textHeight / 2;	
			}
			ctx.drawImage(letterList[letter], imgx, imgy, 8 * PX_NUM, 8 * PX_NUM);
		} else {
			var splitedString = (' ' + string).slice(1);

			splitedString = splitedString.slice(i);

			splitedString = splitedString.split(' ');
			if (i+splitedString[0] > wrapPos*line && line === 1) {
				line += 1;
				whenSwicthed = i;
			}
		}
	}
}
//loading time
setTimeout(()=>{
	g_BGstats = 'start?';
},10000)

// key down and keyup listeners
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("keyup", handleKeyUp);

//you know what this is
setInterval(mainLoop, 66);

// enemy detection
setInterval(() => {
	if (g_BGstats === 'game') {
		const random = Math.floor(Math.random()*100);
		if (random < enemyAppearencePerSecond) {
			g_BGstats = 'surprise';
			setTimeout(()=> {
				g_BGstats = 'fight';
			}, 2000)
		}
	}
}, 1000);

