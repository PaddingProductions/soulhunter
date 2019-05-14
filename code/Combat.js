const endBattle = () => {
	if ((1200-disapearFrame*30)/2 < 0) {
		g_BGstats = 'report card';
		//reseting the enemy.
		for (let i in g_bestiary) {
			g_bestiary[i]['HP'] = enemy[i]['FULL HP'];
			g_bestiary[i]['deathFrame'] = 0;
		}

		enemy = undefined;
		g_turnList = [];
		g_doAction = true;
		//calculating the amount of gil earned
		g_playerStatus['items']['gil'] += gilEarned;
		return;
	}
	ctx.beginPath();
	ctx.arc(600,375,(1200-disapearFrame*30)/2,0, Math.PI*2, true);
	ctx.clip();
	disapearFrame += 1;
};

const drawCharacters = (characters) => {


	for (let i = 0; i < characters.length; i++) {
		let imgx = 800;
		let imgy = 300+100*i;
	
		const character = g_playerStatus[g_playerStatus['party'][i]];

	    //if you won the battle.
		if (g_BGstats === 'win') {
			img = character['win pose'];

			ctx.drawImage(img[0], imgx, imgy, img[1] * PX_NUM, img[2] * PX_NUM);

			const degree = swordSpinFrame / 8 * 360;

			// moving the imge to the center of the hand
			ctx.save();
		    {
				img = character['sword spin'];

				ctx.translate(imgx+45, imgy-PX_NUM);
				ctx.rotate(degree / 180 * Math.PI);
				ctx.drawImage(img[0], -9*PX_NUM, -18*PX_NUM, img[1]*PX_NUM, img[2]*PX_NUM);
			}
			ctx.restore();
			// if the player is attacking	

		
		} else {
			switch (character['status']) {
				case 'hit':
					img = character['stance'];

					const random_num = Math.floor(Math.random()*10);
					if (Math.random() > 0.5) {
						imgx += random_num;
					} else {
						imgx -= random_num;
					}
					ctx.drawImage(img[0], imgx, imgy, img[1] * PX_NUM, img[2] * PX_NUM);
					ctx.drawImage(shield, 0, 0, 6, 18, imgx - (10 * PX_NUM), imgy + (5 * PX_NUM)
						, 8 * PX_NUM, 16 * PX_NUM);	
					// other situations
				break;

				case 'attack':
					imgx = 600;
					img = character['sword swing'];
					//if you didn't already swung the sword
					if (actionFrame !== -1) {
						//making the player looks like he is swinging his sword
						if (actionFrame < 5) {
							ctx.drawImage(img[0], img[1] - (23 + 1) * (actionFrame + 1),
								1, 23, 23, imgx, imgy, 23 * PX_NUM, 23 * PX_NUM);
						} else {
							ctx.drawImage(img[0] , 1, 1, 23, 23, imgx, imgy, 23 * PX_NUM, 23 * PX_NUM);
						}
						// drawing the sword
						
						img = character['sword'];
						imgx -= 16 * PX_NUM;
						imgy += 10 * PX_NUM;
					
						ctx.drawImage(img[0], 1, ((16 * actionFrame) + (1 * (actionFrame + 1))),
							16, 16, imgx, imgy, 16 * PX_NUM, 16 * PX_NUM);
						actionFrame += 1;
					} else {
						//drawing the character on the base line
						img = character['stance'];

						ctx.drawImage(img[0], imgx, imgy, img[1] * PX_NUM, img[2] * PX_NUM);
					}
				break;

				default:
					//if u use b magic
					if (is_in(character['status'], character['b spells'])) {
						let imgx = 600;
						let img = character['black magic'];
						let cutx = 0;
						//figuing out the picture based on the framenum
						if (magicFrame < 10) {
							cutx = 1;
						} else if (magicFrame >= 11 && magicFrame <= 15) {
							cutx = 1+img[1];
						} else { 
							cutx = 1+(img[1]*2);
						}

						ctx.drawImage(img[0], cutx, 1, img[1], img[2], imgx, imgy, img[1]*PX_NUM, img[2]*PX_NUM);
	
						img = blackMagicGlow;
	
						ctx.drawImage(img[0], imgx, imgy, img[1]*PX_NUM, img[2]*PX_NUM);
						

						img = fireball;
						//figuing out the picture based on the framenum
						if (magicFrame < 10) {
							imgy -= img[2] * PX_NUM;
						} else if (magicFrame >= 11 && magicFrame <= 15) {
							imgx -= img[1] * PX_NUM;
						} else { 
							imgx -= img[1] * (magicFrame - 15)
						}
						ctx.drawImage(img[0], imgx, imgy, img[1]*PX_NUM, img[2]*PX_NUM);

						magicFrame += 1;

						//other
					} else {
						img = character['stance'];

						//when it's waiting for his or her turn
						ctx.drawImage(img[0], imgx, imgy, img[1] * PX_NUM, img[2] * PX_NUM);
						ctx.drawImage(shield, 0, 0, 6, 18, imgx - (10 * PX_NUM), imgy + (5 * PX_NUM)
							, 8 * PX_NUM, 16 * PX_NUM);
					}
				break
			}

		}
		
	}
}

const drawEnemies = (enemies) => {
	//conditions is are status like blind, slilent, or death.


	for (let i = 0; i < enemies.length; i++) {
		// if it has any positive or negative status.
		const enemy = enemies[i]
		const status = enemies[i]['status'];
		const name = enemies[i]['NAME'];
		imgx = 100;
		imgy = 300+(100*i);

		switch (status) {
			case 'death': {
				//if the animation is done
				if (enemy['deathFrame'] >= 7) {
					break;
				}
				let img = enemyImages[name]
				if (enemy['deathFrame'] <= 3) {
					ctx.drawImage(img[0], imgx, imgy, img[1] * PX_NUM, img[2] * PX_NUM);
				}
				img = enemyDeathEffect;

				ctx.drawImage(img[0], 1+(enemy['deathFrame'] * (img[1] + 1)), 1, img[1], img[2], 
				  imgx, imgy, img[1] * PX_NUM, img[2] * PX_NUM);

				enemy['deathFrame'] += 1;
			}
			break;
			case 'attack': {
			    //if you already swung the sword
			    if (actionFrame !== -1) {
					imgx = 100 + (10*actionFrame);
					//making the enemy is stabing the player
					img = enemyImages[name];
					ctx.drawImage(img[0], imgx, imgy, img[1] * PX_NUM, img[2] * PX_NUM);
					actionFrame += 1;
				} else {
					//getting the image of the enemy
					const img = enemyImages[enemies[i]['NAME']];
					ctx.drawImage(img[0], imgx, imgy, img[1] * PX_NUM, img[2] * PX_NUM);
				}
			}
			break;
			case 'hit': {
			    const random_num = Math.floor(Math.random()*10);
			    if (Math.random() > 0.5) {
                    imgx += random_num;
				} else {
					imgx -= random_num;
				}
				img = enemyImages[name];
				ctx.drawImage(img[0], imgx, imgy, img[1] * PX_NUM, imf[2] * PX_NUM);
			}
			break;
			default: {
				//getting the image of the enemy
				const img = enemyImages[enemies[i]['NAME']];
				ctx.drawImage(img[0], imgx, imgy, img[1] * PX_NUM, img[2] * PX_NUM);
			}
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

const drawCharacterStats = (words) => {
	for (let i = 0; i < words.length; i++) {
		//drawing the blue bar
		let imgx = 220;
		let imgy = 525 + (60 * i);
		ctx.fillStyle = '#5c81bc';
		ctx.fillRect(imgx, imgy, 960, 50);
		ctx.fillStyle = '#bcbcbc';
		ctx.rect(imgx, imgy, 960, 50);
		ctx.stroke();
		//writing the name of the fighter
		//making the margin
		imgx += 10;
		imgy += 10;
		writeWord(words[i], imgx, imgy);


		//writing the HP of the character and the full hp
		imgx = imgx + 150;
		imgy = imgy;
		HPString = `hp ${g_playerStatus[words[i]]['HP']}/${g_playerStatus[words[i]]['FULL HP']}`;

		writeWord(HPString, imgx, imgy);

		//drawing mana/ full mana
		imgx = imgx + 400;
		imgy = imgy;
		HPString = `stm ${g_playerStatus[words[i]]['STM']}/${g_playerStatus[words[i]]['FULL STM']}`;

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
			const victimIndex = Math.floor(Math.random() * g_playerStatus['party'].length);
			const victimName = g_playerStatus['party'][victimIndex];

			if (g_turnList[0] === enemy[i]) {
				actionManagement(enemy[i]['AI'](), enemy[i], g_playerStatus[victimName]);
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

			if (is_in(attacker['NAME'],g_playerStatus['party'])) g_BGstats = `${attacker['NAME']} ${action}`;
			//if you defeated the enemy

			if (victim['HP'] <= 0 && is_in(attacker['NAME'],g_playerStatus['party'])) {
				// if you win you gotta let it looks like you killed it not instantly kaboom!
				victim['status'] = 'death';  
				gilEarned += randomizer(victim['gil'][0], victim['gil'][1]);
				//adding the amount of exp earned.
				if (is_in(attacker, enemy) === false) attacker['exp earned'] += randomizer(victim['exp'][0], victim['exp'][1]);
				setTimeout(()=> {
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
			actionFrame = 0;
			//victim['status'] = 'hit';
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

		case 'defend':
			setTimeout(()=>{
				//lets next person attack
				g_turnList.shift();
				// allows the player to move on to the next player/
				g_doAction = true;
			}, 1000);
		break;

		default:
			//if you did black magic.
			// black magic's animation is longer, so it is
			if (is_in(action, g_turnList[0]['b spells'])) {
				attacker['status'] = action;
				const M_ATK = attacker['MAGIC ATK'];
				g_DMG = Math.floor((Math.random() *(M_ATK + 0.99)) + (M_ATK*5));
				victim['HP'] -= g_DMG;

				//if the attacker is 
				if (is_in(attacker['NAME'],g_playerStatus['party'])) {
					g_BGstats = `${attacker['NAME']} ${action}`;
					attacker['STM'] -= 20;
				}

				//if you defeated the enemy
				if (victim['HP'] <= 0 && is_in(attacker['NAME'],g_playerStatus['party'])) {
					setTimeout(() => {
						victim['status'] = 'death';
						gilEarned += randomizer(victim['gil'][0], victim['gil'][1]);
						//adding the amount of exp earned.
						if (is_in(attacker, enemy) === false)attacker['exp earned'] += randomizer(victim['exp'][0], victim['exp'][1]);
					}, 2000)

					setTimeout(() => {
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
					}, 3000);
				}		

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
				}, 3000);
			}
		break;
	}

} 