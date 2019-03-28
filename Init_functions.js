function is_in(a, vector) {
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
    if (currentKey['65'] && g_BGstats === 'select target') g_BGstats = 'jonny action';	
	

	//if they select a move to use
	if (currentKey['83'] && g_BGstats === 'jonny action') {
		g_BGstats = 'select target';
		g_selectedAction = g_buttonPos[g_mousePos[1]]
	} else if (currentKey['83'] && g_BGstats === 'select target'){
		actionManagement(g_selectedAction, playerStatus['jonny'], enemy[g_mousePos[1]]);
	}

	//if the mouse is outside the button selection list
	if (g_mousePos[0] < 0 || g_mousePos[1] < 0) {
		g_mousePos = lastPos;
	}

	//resetting keys
	currentKey['37'] = 0;
	currentKey['38'] = 0;
	currentKey['39'] = 0;
	currentKey['40'] = 0;
	currentKey['83'] = 0;
	currentKey['65'] = 0;
	// walking system needs this because of the diagnal walks.
	if (currentKey['222'] == 1) { currentKey['222'] = 2 };
	if (currentKey['76'] == 1) { currentKey['76'] = 2 };
	if (currentKey['80'] == 1) { currentKey['80'] = 2 };
	if (currentKey['186'] == 1) { currentKey['186'] = 2 };

	if (currentKey['222'] == 2) { currentKey['222'] = 0 };
	if (currentKey['76'] == 2) { currentKey['76'] = 0 };
	if (currentKey['80'] == 2) { currentKey['80'] = 0 };
	if (currentKey['186'] == 2) { currentKey['186'] = 0 };
    //swordswing button (overworld)
	currentKey['13'] = 0;
	g_frameNum = 0;
}

// when button down sets the unicode to the button pressed.
const handleKeyDown = e => {
	currentKey[e.keyCode] = 1;
	// up = p left = l right = ' down = ;'
	if (e.keyCode === 83)
		g_swordFrame = 0;

	if (g_BGstats === 'start?') {
		if (currentKey[13] === 1) {
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
		ctx.fillRect(0, 0, g_BGsizeX, g_BGsizeY);
		ctx.rect(0, 0, g_BGsizeX, g_BGsizeY);
	} else {
		ctx.fillStyle = '#000'
		ctx.fillRect(0,0, g_BGsizeX, g_BGsizeY)
	}
	ctx.stroke();
	
	switch (g_BGstats) {
		
		case 'loading':
			writeWord('loading', 900, 700)
		break;

		case 'start?':
			ctx.drawImage(titleScreen, 0, 0, g_BGsizeX, g_BGsizeY);
		break;

		case 'game':
				
			imgx = playerPosX * PX_NUM;
			imgy = playerPosY * PX_NUM;


			//draw the bounderies skin first.	
			Bctx.drawImage(boundaries, imgx, imgy,
				4109 * PX_NUM, 4110 * PX_NUM);

			ctx.drawImage(background, imgx, imgy,
				4109 * PX_NUM, 4110 * PX_NUM);

			drawPlayer();
			//drawShield();
			drawSword();
		break;
		
		case 'surprise':
							
			imgx = PX_NUM + playerPosX;
			imgy = PX_NUM + playerPosY;

			ctx.drawImage(background, imgx, imgy,
				4109 * PX_NUM, 4110 * PX_NUM);

			drawPlayer();
			drawShield();
			ctx.drawImage(surprise, centerX-15*PX_NUM, centerY-15*PX_NUM, 15*PX_NUM, 15*PX_NUM);
		break;
		case 'fight':
			ctx.save();
			{
				// fills the background black or red when it's cliped, it will only
				// be seen on the outside of the circle.
		
				ctx.fillStyle = '#000'
				ctx.fillRect(0,0,g_BGsizeX,g_BGsizeY);
				
				//screen flicing effect
				ctx.fillStyle = '#f00'
				if (appearFrame%6 < 3) {
					ctx.fillRect(0,0,g_BGsizeX/2,g_BGsizeY);
				} else {
					ctx.fillRect(g_BGsizeX/2 ,0,g_BGsizeX/2,g_BGsizeY);
				}
				
				startBattle();

				imgx = PX_NUM + playerPosX;
				imgy = PX_NUM + playerPosY;

				ctx.drawImage(background, imgx, imgy,
					4109 * PX_NUM, 4110 * PX_NUM);

				drawPlayer();
				drawShield();

			}
			ctx.restore()
		break;
		case 'jonny attack':
			drawCharacterStats(['jonny'])
			drawCursor();
			drawCharacters(['jonny']);
			drawEnemies(enemy)
			// if it's player's trun and is attacking.
			if (g_DMG !== undefined && g_DMG !== null) {
				writeWord(`${g_DMG}`, 200 ,200);
			}

		break;

		case 'jonny action':
			drawButtons(playerStatus['jonny']['abilities']);
			drawCharacterStats(['jonny']);
			drawCursor();
			drawCharacters(['jonny']);
			drawEnemies(enemy);
		break;
		
		case 'enemy attack':
			writeWord('hyaaaaaaa', 300, 300);

			drawCharacterStats(['jonny'])
			drawCursor();
			drawCharacters(['jonny']);
			drawEnemies(enemy);
			if (g_DMG !== undefined && g_DMG !== null) {
				writeWord(`${g_DMG}`, 200 ,200);
			}
		break;

		case 'select target':
			drawCharacterStats(['jonny'])
			drawCharacters(['jonny']);
			drawEnemies(enemy);
			drawCursor();
			
		break;

		case 'win':
			drawCharacterStats(['jonny'])
			writeWord('yeeeeeetus', 200 ,200);
			drawCharacters(['jonny']);

		break;
		
		case 'end': 
			ctx.save();
			{
				endBattle();

				ctx.fillStyle = '#7c7c7c'
				ctx.fillRect(0,0, g_BGsizeX, g_BGsizeY)

				drawCharacterStats(['jonny']);
				drawCharacters(['jonny']);
			}
			ctx.restore()
		break;
		
		default:
			//if it's enemy attack
			const attacker = g_BGstats.split(" ")[0];
			const action = g_BGstats.split(" ")[1];

			if (is_in(attacker, playerStatus['party']) === false && action === 'attack') {
				writeWord('hyaaaaaaa', 300, 300);

				drawCharacterStats(['jonny'])
				drawCursor();
				drawCharacters(['jonny']);
				drawEnemies(enemy);

				//damage delt
				if (g_DMG !== undefined && g_DMG !== null) {
					writeWord(`${g_DMG}`, 200 ,200);
				}
			} else {
				// if something goes wrong
				console.log('!!! SOMETHING WRONG !!!');
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
			//left
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
			//up
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
				g_turnList.push(playerStatus['jonny']);
				for (let i = 0; i < enemy.length; i++) {
					g_turnList.push(enemy[i]);
				}
			} else {
				for (let i = 0; i < enemy.length; i++) {
					g_turnList.push(enemy[i]);
				}			
				g_turnList.push(playerStatus['jonny']);
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

const writeWord = (word, posx, posy) => {
	for (i = 0; i < word.length; i++) {
		var letter = word.charAt(i);
		if (letter != ' ') {
			imgx = posx + (8 * i) * PX_NUM;
			imgy = posy;
			ctx.drawImage(letterList[letter], imgx, imgy, 8 * PX_NUM, 8 * PX_NUM);
		}
	}
}
//loading time
setTimeout(()=>{
	g_BGstats = 'start?'
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
		if (random <= enemyAppearencePerSecond) {
			g_BGstats = 'surprise';
			setTimeout(()=> {
				g_BGstats = 'fight';
			}, 2000)
		}
	}
}, 1000);

