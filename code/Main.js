// tells you if an element is in an array
const is_in = (a, vector) => {
	for (let i=0;i < vector.length; i++) {
		if (vector[i] === a) {
			return true;
		}
	}
	return false;
}

// randomizer, give in start range, and end range.
const randomizer = (start, end) => {
	return Math.floor((Math.random() * (end - start)) + start);
}

// checks if g_mouspos is in bounderies for different types of BGstatstt
const mousePosCheck = () => {
	console.log(g_mousePos);
	let x = g_mousePos[0];
	let y = g_mousePos[1];

	if (doubleConfirm) {
		if (y !== 0) g_mousePos[1] = 0;
		if (x > 1) {
			g_mousePos[0] -= 1;
		}
		return;
	}
	switch (g_BGstats) {
		case 'select file':
			if (y > 3) g_mousePos[1] -= 1;
			if (x !== 0) g_mousePos[0] = 0;
			console.log("aksdfa;sdfkldsflkajldka;lkfja;skdjf");

		break;
	}
}
// when button uo it resets the unicode number to Null.
const handleKeyUp = (e) => {

	lastPos = [g_mousePos[0], g_mousePos[1]];

	//changing the position of the cursor 
	if (enemy !== undefined || g_BGstats.split(' ')[0] === 'menu' || g_BGstats === 'select file' || doubleConfirm == true  ) { 
		if (currentKey['186']) g_mousePos[1] += 1;
		if (currentKey['76']) g_mousePos[0] -= 1;
		if (currentKey['80']) g_mousePos[1] -= 1;
		if (currentKey['222']) g_mousePos[0] += 1;
	}

	//if the player presses B, return to move selection.
	// or if you press "b" when you are on menu.
  if (currentKey['65']) {
		if (g_BGstats === 'select target') {
			g_BGstats = 'jonny action';	
		} else if (g_BGstats === 'menu') {
			g_BGstats = 'game';
		} else if (g_BGstats.split(' ').length > 1 && g_BGstats.split(' ')[0]) {
			g_BGstats = 'menu';
		}
	}

	//if u press "s"
	if (currentKey['83']) {
		// if player's turn
		if (g_BGstats.split(" ")[1] === 'action') {

			g_BGstats = 'select target';
			g_selectedAction = g_turnList[0]['abilities'][g_mousePos[1]];
			//if u do magic
			if (g_selectedAction === 'b magic' || g_selectedAction === 'w magic') {
				g_BGstats = `${g_turnList[0]['NAME']} select spell`;
			}

		//if you use a spell
		} else if (`${g_BGstats.split(" ")[1]} ${g_BGstats.split(" ")[2]}` === 'select spell') {

			g_BGstats = 'select target';
			if (g_selectedAction === 'b magic') {
				g_selectedAction = g_turnList[0]['b spells'][g_mousePos[1]];
			}

    	} else if (g_BGstats === 'select target'){
			actionManagement(g_selectedAction, g_turnList[0], enemy[g_mousePos[1]]);

		// end battle results
		}	else if (g_BGstats === 'report card') {
			g_BGstats = 'game';
			for (let i = 0; i < g_playerStatus['party'].length;i++) {
				const character = g_playerStatus[g_playerStatus['party'][i]]; 
				character['exp'] += character['exp earned'];
				character['exp earned'] = 0;
			}

		} else if (g_BGstats === 'menu') {
			g_BGstats = `menu ${g_menuFunctions[g_mousePos[1]]}`;

		} else if (g_BGstats === 'select file')  {
			if (doubleConfirm === true ) {
				if (g_mousePos[0] === 0) {
					// what ever is needed to get the save file code:
					g_BGstats = 'tutorial';
				}
				doubleConfirm = false;
				
				return;
			}
			doubleConfirm = true;
		}
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
	if (currentKey['87'] && g_BGstats === 'game') {
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

	//action buttons
	currentKey['83'] = 0;
	currentKey['65'] = 0;
  currentKey['68'] = 0;
	currentKey['13'] = 0;
	currentKey['87'] = 0;
	g_frameNum = 0;
}

// when button down sets the unicode to the button pressed.
const handleKeyDown = e => {
	currentKey[e.keyCode] = 1;
	// up = p left = l right = ' down = ;'
	if (e.keyCode === 83)
		actionFrame = 0;

	if (currentKey[13] === 1) {
		if (g_BGstats === 'start?') {
			g_BGstats = 'select file';
			g_currentDialogue = tutorial;
		} else if (g_BGstats === 'tutorial') {
			g_BGstats = 'game';
		}	
	}
	
};

//calls every 33 milliseconds 
//reacts to the buttons you are pressing.
const mainLoop = () => {
	mousePosCheck();
	if (enemy === undefined) {


		let lastPlayerX = playerPosX;
		let lastPlayerY = playerPosY;

    if (g_BGstats === 'game') {
			appearFrame = 0;
			disapearFrame = 0;
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
		if (g_BGstats === 'report card') {
			console.log("I'm Ok, I think.");
			for (let i = 0; i < g_playerStatus["party"].length; i++) {
				const character = g_playerStatus[g_playerStatus["party"][i]];
				if (character["exp"] >= character['lv']) {
					character["Lv"] += 1;
					character['next lv'] = character["Lv"] * 1000; 
				}
			}
		}
		if (g_BGstats.split(' ')[0] === 'menu') {
			if (g_mousePos[0] !== 0) g_mousePos[0] = 0;
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

		//reset magic frame
		if (is_in(g_BGstats.split(' ')[1],g_turnList[0]['b spells']) === false && magicFrame > 0) {
			magicFrame = 0
		}

		drawBG();
	}
	//reset swordframe
	if (g_BGstats.split(' ')[1] === 'attack' && actionFrame >= 7) {
		actionFrame = -1;
	}
};

const writeWord = (string, posx, posy, wrapPosx, wrapStyle) => {

	if (wrapPosx === undefined) wrapPosx = 1200;
	if (wrapStyle === undefined) wrapStyle = 'standard';

	let line = 1;
	let whenSwicthed = 0;
  let wrapPos = Math.floor((wrapPosx-posx)/8);
	//prevent overlap with the caller's function's imgx and y
	let imgx;
	let imgy;

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

