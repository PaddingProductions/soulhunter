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

		case 'select file': 
			// for every save slot
			for (let i = 0; i < 3; i++) {
				//boarder of each slot.
				ctx.fillStyle = '#000';
				ctx.rect(5,5+(250*i),1190,240);
				ctx.stroke();

				writeWord('no saved data', 200, 110+(250*i));
			}
			// other functions in the menu
			drawCursor('save');
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
			// other functions in the menu
			for (let i = 0; i < g_menuFunctions.length; i++) {
				writeWord(g_menuFunctions[i], 100, 100+(100*i));
			}
			drawCursor('menu');
		break;
		
		case 'menu status':
			// for every charater 
			for (let i = 0; i < g_playerStatus['party'].length; i++) {

				const charater = g_playerStatus[g_playerStatus['party'][i]];
				
				imgx = 50;
				imgy = 50 + 200 * i;

				//profile pic. can't afford to draw a new one so it's going to be the vitory pose.
				ctx.drawImage(charater['win pose'][0], imgx, imgy, charater['win pose'][1]*PX_NUM,
				  charater['win pose'][2]*PX_NUM);

				//writing stats
				writeWord(charater['NAME'], imgx + 60, imgy);
				writeWord(`hp ${charater['HP']} / ${charater['FULL HP']}`, imgx + 200, imgy);
				writeWord(`stm ${charater['STM']} / ${charater['FULL STM']}`, imgx + 200, imgy + 70);
				//writing exp
				writeWord(`${charater['exp']} exp / ${charater['next lv']} to next lv`, imgx+200, imgy+170);
			}
			writeWord(`${g_playerStatus.items.gil} gil`, 800, 700);

		break;

		case 'menu save':
			// for every save slot
			for (let i = 0; i < 3; i++) {
				//boarder of each slot.
				ctx.fillStyle = '#000';
				ctx.rect(5,5+(250*i),1190,240);
				ctx.stroke();

				writeWord('no saved data', 200, 110+(250*i));
			}
			// other functions in the menu
			drawCursor('save');
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

		case 'report card':
			// for every charater 
			for (let i = 0; i < g_playerStatus['party'].length; i++) {

				const charater = g_playerStatus[g_playerStatus['party'][i]];
				
				imgx = 50;
				imgy = 50 + 200 * i;

				//profile pic. can't afford to draw a new one so it's going to be the vitory pose.
				ctx.drawImage(charater['win pose'][0], imgx, imgy, charater['win pose'][1]*PX_NUM,
				  charater['win pose'][2]*PX_NUM);

				//writing stats
				writeWord(charater['NAME'], imgx + 60, imgy);
				writeWord(`hp ${charater['HP']} / ${charater['FULL HP']}`, imgx + 60, imgy + 78);
				writeWord(`stm ${charater['STM']} / ${charater['FULL STM']}`, imgx + 200, imgy);
				//writing exp
				imgx += 200;
				imgy += 30;
				writeWord(`${charater['exp']}  ${charater['exp earned']} / ${charater['next lv']} to next lv`, imgx, imgy);
			}
			writeWord(`${gilEarned} gil earned`, 800, 700);
			
		break;

		default:
			const attacker = g_BGstats.split(" ")[0];
			let action = g_BGstats.split(" ");

			action.shift();
			if (action.length === 2) {
				action = `${action[0]} ${action[1]}`;
			} else {
				action = `${action[0]}`;
			}
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
				//if you use a spell
			} else if (is_in(attacker, g_playerStatus['party']) && is_in(action,g_turnList[0]['b spells'])) {

				drawCharacterStats(g_playerStatus['party']);
				drawCursor();
				drawCharacters(g_playerStatus['party']);
				drawEnemies(enemy)

				if (g_DMG !== undefined && g_DMG !== null) {
					writeWord(`${g_DMG}`, 200 ,200);
				}

				// if you are choseing a spell to use
			} else if (is_in(attacker, g_playerStatus['party']) && action === 'select spell') {

				if (g_selectedAction === 'b magic') {
					drawButtons(g_playerStatus[g_turnList[0]['NAME']]['b spells']);
				} else {
					drawButtons(g_playerStatus[g_turnList[0]['NAME']]['w spells']);
				}
				drawCharacterStats(g_playerStatus['party']);
				drawCursor();
				drawCharacters(g_playerStatus['party']);
				drawEnemies(enemy)

			} else {
				// if something goes wrong
				console.log('!!! SOMETHING WRONG !!!');
				console.log(g_BGstats);
			}
		break;
	}
	if (doubleConfirm) {
		ctx.fillStyle = '#00f';
		ctx.fillRect(495, 325, 100, 100);
		ctx.fillStyle = '#000';
		ctx.rect(495, 325, 100, 100);
		writeWord('yes', 500, 335);

		ctx.fillStyle = '#00f';
		ctx.fillRect(605, 325, 100, 100);
		ctx.fillStyle = '#000';
		ctx.rect(605, 325, 100, 100);
		writeWord('no', 615, 335);
		ctx.stroke();
		
		drawCursor('confirm');
	}
}