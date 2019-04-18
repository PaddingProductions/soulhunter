const endBattle = () => {
	if ((1200-disapearFrame*30)/2 < 0) {
		g_BGstats = 'game';
		return;
	}
	ctx.beginPath();
	ctx.arc(600,375,(1200-disapearFrame*30)/2,0, Math.PI*2, true);
	ctx.clip();
	disapearFrame += 1;
};

const drawCharacters = (characters) => {
	let imgx = 800;
	let imgy = 300;

	for (let i = 0; i < characters.length; i++) {

		imgy += i*100;
		const character = g_playerStatus[g_playerStatus['party'][i]];

	    //if you won the battle.
		if (g_BGstats === 'win') {
			img = character['win pose'];

			ctx.drawImage(img, imgx, imgy, 16 * PX_NUM, 24 * PX_NUM);

			const degree = swordSpinFrame / 8 * 360;

			// moving the imge to the center of the hand
			ctx.save();
		    {
				img = character['sword spin'];

				ctx.translate(imgx+45, imgy-PX_NUM);
				ctx.rotate(degree / 180 * Math.PI);
				ctx.drawImage(swordSpin, -9*PX_NUM, -18*PX_NUM, 16*PX_NUM, 16*PX_NUM);
			}
			ctx.restore();
			// if the player is attacking	

		} else if (character['status'] === 'attack' && swordFrame !== -1) {
			imgx = 600;
			img = character['sword swing'];
			console.log(character)

			//making the player looks like he is swinging his sword
			if (swordFrame < 5) {
				ctx.drawImage(img, 121 - (23 + 1) * (swordFrame + 1),
					1, 23, 23, imgx, imgy, 23 * PX_NUM, 23 * PX_NUM);
			} else {
				ctx.drawImage(img , 1, 1, 23, 23, imgx, imgy, 23 * PX_NUM, 23 * PX_NUM);
			}
			// drawing the sword

			img = character['sword'];
			imgx -= 16 * PX_NUM;
			imgy += 10 * PX_NUM;
			
			ctx.drawImage(sword, 1, ((16 * swordFrame) + (1 * (swordFrame + 1))),
				16, 16, imgx, imgy, 16 * PX_NUM, 16 * PX_NUM);
			swordFrame += 1;
			// if he is being hit by the enemy


		} else if (character['status'] === 'hit') {
			img = character['stance'][0];

			const random_num = Math.floor(Math.random()*10);
			if (Math.random() > 0.5) {
				imgx += random_num;
			} else {
				imgx -= random_num;
			}
			ctx.drawImage(img, imgx, imgy, 16 * PX_NUM, 23 * PX_NUM);
			ctx.drawImage(shield, 0, 0, 6, 18, imgx - (10 * PX_NUM), imgy + (5 * PX_NUM)
				, 8 * PX_NUM, 16 * PX_NUM);	
			// other situations


		} else {
			const sizex = character['stance'][1];
			const sizey = character['stance'][2];
			img = character['stance'][0];

			//when it's waiting for his or her turn
			ctx.drawImage(img, imgx, imgy, sizex * PX_NUM, sizey * PX_NUM);
			ctx.drawImage(shield, 0, 0, 6, 18, imgx - (10 * PX_NUM), imgy + (5 * PX_NUM)
				, 8 * PX_NUM, 16 * PX_NUM);
		}
		
	}
}

const drawEnemies = (enemies) => {
	//conditions is are status like blind, slilent, or death.


	for (let i = 0; i < enemies.length; i++) {
		// if it has any positive or negative status.
		const status = enemies[i]['status'];
		const name = enemies[i]['NAME'];
		imgx = 100;
		imgy = 300+(100*i);

		switch(status) {
			case 'death':

				//if the animation is done
				if (DeathFrame >= 7) {
					return;
				}
				ctx.drawImage(enemyDeath,(DeathFrame*26),0,26,27, imgx, imgy, 26 * PX_NUM, 27 * PX_NUM);

				DeathFrame += 1;

			break;
			case 'attack': 

			    //if you already swung the sword
			    if (swordFrame !== -1) {
					imgx = 100 + (10*swordFrame);
					//making the enemy is stabing the player
					ctx.drawImage(enemyImages[name], imgx, imgy, 32 * PX_NUM, 30 * PX_NUM);
					swordFrame += 1;
				} else {
					//getting the image of the enemy
					img = enemyImages[enemies[i]['NAME']];
					ctx.drawImage(img, imgx, imgy, 32 * PX_NUM, 30 * PX_NUM);
				}
			break;
			case 'hit':
			    const random_num = Math.floor(Math.random()*10);
			    if (Math.random() > 0.5) {
                    imgx += random_num;
				} else {
					imgx -= random_num;
				}
				ctx.drawImage(enemyImages[name], imgx, imgy, 32 * PX_NUM, 30 * PX_NUM);

			break;
			default:

				//getting the image of the enemy
				img = enemyImages[enemies[i]['NAME']];
				ctx.drawImage(img, imgx, imgy, 32 * PX_NUM, 30 * PX_NUM);
			break;
		}
	}
}

const drawButtons = (words) => {
	imgx = 10;
	imgy = 525;
	ctx.fillStyle = "#cccccc";
	ctx.fillRect(imgx, imgy, 200, 215);
	ctx.fillStyle = "#000000";
	ctx.lineWidth = '3';
	ctx.rect(imgx, imgy, 200, 215);
	ctx.stroke();

	for (let i = 0; i < words.length; i++) {
		imgx = 10;
		imgy = 530;
		writeWord(words[i], imgx + 10, imgy + ((10 + 50) * i) + 10);
	}
}

// draws the finger cursor from final fantasy 
const drawCursor = () => {
	imgx = 170 + (200 * g_mousePos[0])
	imgy = 525 + (80 * g_mousePos[1]);
	if (g_BGstats === 'select target') {
		imgx = 200;
		imgy = 300 + (100 * g_mousePos[1]);
		//because the way enemies are lined out, two in the front three in the back
		// when you want to select the fornt ones, you press down till you select them
		if (g_mousePos[1] > 3) {
			imgx = 200;
			imgy = 250 + (100 * g_mousePos[1]-3);
		}
	}
	ctx.drawImage(cursor, imgx, imgy, 22 * 2, 22 * 2);

}

// draws the character's stats bar
const drawCharacterStats = (words) => {
	for (let i = 0; i < words.length; i++) {
		//drawing the blue bar
		imgx = 220;
		imgy = 525 + ((50 + 10) * i);
		ctx.fillStyle = '#5c81bc';
		ctx.fillRect(imgx, imgy, 960, 50);
		ctx.fillStyle = '#bcbcbc';
		ctx.rect(imgx, imgy, 960, 50);
		ctx.stroke();
		//writing the name of the fighter
		writeWord(words[i], imgx + 10, imgy + 10);


		//writing the HP of the character and the full hp
		imgx = imgx + 150;
		imgy = imgy;
		HPString = `hp ${g_playerStatus[words[i]]['HP']} / ${g_playerStatus[words[i]]['FULL HP']}`;

		writeWord(HPString, imgx, imgy);

		//drawing mana/ full mana
		imgx = imgx + 100;
		imgy = imgy;
		HPString = `stm ${g_playerStatus[words[i]]['STM']} / ${g_playerStatus[words[i]]['FULL STM']}`;

		writeWord(HPString, imgx, imgy);
	}
}

const turnManagement = () =>{
	// if it is the player's turn, then draw the action buttons.
	if (is_in(g_turnList[0]['NAME'], g_playerStatus['party'])) {
  
		g_BGstats = `${g_turnList[0]['NAME']} action`;

	} else {
		// if is enemy's move
		g_BGstats = `${g_turnList[0]['NAME']} attack`;
		for (i = 0; i < enemy.length; i++) {
			if (g_turnList[0] === enemy[i]) {
				actionManagement(enemy[i]['AI'](), enemy[i], g_playerStatus['jonny']);
			}
		}
	}
	g_doAction = false;
}

const actionManagement = (action, attacker, victim) => {
	switch (action) {
		//if they chose to attack
		case 'attack': 

		    attacker['status'] = action;
		    const ATK = attacker['ATK'];
			g_DMG = Math.floor((Math.random() *(ATK + 0.99)) + (ATK*5));
			victim['HP'] -= g_DMG;

			//if you defeated the enemy
			if (attacker === g_playerStatus['jonny']) g_BGstats = 'jonny attack';

			if (victim['HP'] <= 0 && attacker === g_playerStatus['jonny']) {
				// if you win you gotta let it looks like you killed it not instantly kaboom!
				setTimeout(()=> {
					victim['status'] = 'death';
					// taking the enemy out of the enemy list
					for (i = 0; i < enemy.length; i++) {
						if (enemy[i] === victim) enemy.splice(i, 1);
					}
					// taking the enemy out of the turn list
					for (i = 0; i < g_turnList.length; i++) {
						if (g_turnList[i] === victim) g_turnList.splice(i, 1);
					}
					// if there are no enemy left on the battle field
					if (enemy.length === 0) {
        	       		g_BGstats = 'win';
					} 
				}, 2000);
			}		
			swordFrame = 0;
			victim['status'] = 'hit';
			setTimeout(()=>{
				//lets next person attack
				g_turnList.shift();
				//resets the damage,
				// VERY IMPORTANT, DO NOT DELETE
				g_DMG = null;
				// allows the player to move on to the next player/
				g_doAction = true;
				victim['status'] = null;
				attacker['status'] = null;
			}, 2000);
		break;
	}
	setTimeout(() => {

		victim['status'] = null;
	},2000);
} 