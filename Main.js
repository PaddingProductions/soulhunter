// called when battle starts
// makes the area allowed to draw smaller and smaller untill it is completely gone
const startBattle = () => {
	//if animation isn't done
	if ((1200 - appearFrame*30)/2 > 0) {
		ctx.beginPath();
		ctx.arc(600,375,(1200 - appearFrame*30)/2,0, Math.PI*2, true);
		ctx.clip();
		appearFrame += 1;
		//if enemy is not defined 
	} else if (enemy === undefined) {
		///setting up enemy when the animation is over.
		enemy = [];
		enemy.push(bestiary['swordsmen']);
		enemy.push(bestiary['spearsmen']);
	}	
}

//what do you think this does?
const drawPlayer = () => {
	//left
	if (direct === 3) {
		// the - 17*pxNum/2 part is because the image
		// is being drawn on the top left coner
		imgx = centerX - 17 * PX_NUM / 2;
		imgy = centerY - 25 * PX_NUM / 2;
		// total - (size of each frame)*framenum
		if (g_swordFrame === -1) {
			ctx.drawImage(linkLeft, 163 - (17 + 1) * (g_frameNum + 1),
				1, 17, 23, imgx, imgy, 17 * PX_NUM, 23 * PX_NUM);
			return;
		}
		imgx = centerX - 23 * PX_NUM / 2;
		imgy = centerY - 23 * PX_NUM / 2;
		if (g_swordFrame < 5) {
			ctx.drawImage(swordswingLeft, 121 - (23 + 1) * (g_swordFrame + 1),
				1, 23, 23, imgx, imgy, 23 * PX_NUM, 23 * PX_NUM);
		} else {
			ctx.drawImage(swordswingLeft, 1, 1, 23, 23, imgx, imgy, 23 * PX_NUM, 23 * PX_NUM);
		}
	}
	// right
	if (direct === 4) {
		imgx = centerX - 17 * PX_NUM / 2;
		imgy = centerY - 25 * PX_NUM / 2;

		if (g_swordFrame === -1) {
			ctx.drawImage(linkRight, (17 + 1) * (g_frameNum + 1),
			1, 17, 23, imgx, imgy, 17 * PX_NUM, 23 * PX_NUM);
			return;
		} else if (g_swordFrame) {
			ctx.drawImage(swordswingRight, (23 * g_frameNum) + (1 * g_frameNum) + 1,
				1, 23, 23, imgx, imgy, 23 * PX_NUM, 23 * PX_NUM);
		} else {
			ctx.drawImage(swordswingRight, 97, 1, 23, 23, imgx, imgy,
				23 * PX_NUM, 23 * PX_NUM);
		}
	}
	//up
	if (direct === 1) {
		imgx = centerX - 16 * PX_NUM / 2;
		imgy = centerY - 26 * PX_NUM / 2;

		if (g_swordFrame === -1) {
			ctx.drawImage(linkUp, (16 * g_frameNum) + (1 * g_frameNum) + 1,
				1, 16, 26,
				imgx, imgy, 16 * PX_NUM, 26 * PX_NUM);
			return;
		} else if (g_swordFrame < 5) {
			ctx.drawImage(swordswingUp, (16 * g_swordFrame) + (1 * g_swordFrame) + 1,
				1, 16, 29, imgx, imgy, 16 * PX_NUM, 29 * PX_NUM);
		} else {
			ctx.drawImage(swordswingUp, 69, 1, 16, 29, imgx, imgy,
				16 * PX_NUM, 29 * PX_NUM);
		}
	}
	// down
	if (direct === 2) {
		imgx = centerX - 19 * PX_NUM / 2;
		imgy = centerY - 30 * PX_NUM / 2;
		//width * frame num + 1(gap between the frames) * 
		// frame num + 1 (becuase if the frame num = 0 it's
		// not going to add the 1
		if (g_swordFrame === -1) {
			ctx.drawImage(linkDown, (16 * g_frameNum) + (1 * g_frameNum) + 1,
				1, 16, 23, imgx, imgy, 16 * PX_NUM, 23 * PX_NUM);
		} else if (g_swordFrame > 5) {
			imgx = centerX - 16 * PX_NUM / 2;
			imgy = centerY - 24 * PX_NUM / 2;
			ctx.drawImage(swordswingDown, (16 * g_frameNum) + (1 * g_frameNum) + 1,
				1, 16, 24, imgx, imgy, 16 * PX_NUM, 24 * PX_NUM);
		} else {
			ctx.drawImage(swordswingDown, 69, 1, 16, 24,
				imgx, imgy, 16 * PX_NUM, 24 * PX_NUM);
		}

	}
};

//draws the sheild, called every time main loop is called
const drawShield = () => {
	switch (direct) {
		// 1 = up 2 = down 3 = left 4 = right
		case 1:
			if (g_swordFrame > -1) {
				imgx += 9 * PX_NUM;
				imgy += 5 * PX_NUM;
				ctx.drawImage(shield, 35, 1, 16, 16, imgx, imgy,
					16 * PX_NUM, 16 * PX_NUM);
			}
			break;
		case 2:
			if (g_swordFrame === -1) {
				imgx += -4 * PX_NUM;
				imgy += 10 * PX_NUM;
				ctx.drawImage(shield, 18, 1, 16, 16, imgx, imgy,
					16 * PX_NUM, 16 * PX_NUM);
			} else {
				imgx -= 10 * PX_NUM;
				imgy += 5 * PX_NUM;
				ctx.drawImage(shield, 1, 1, 16, 16, imgx, imgy,
					16 * PX_NUM, 16 * PX_NUM);
			}
			break;
		case 3:
			if (g_swordFrame === -1) {
				imgx -= 5 * PX_NUM;
				imgy += 5 * PX_NUM;
				ctx.drawImage(shield, 1, 1, 16, 16, imgx, imgy,
					16 * PX_NUM, 16 * PX_NUM);
			}
			break;

		case 4:
			if (g_swordFrame === -1) {
				imgx += 9 * PX_NUM;
				imgy += 5 * PX_NUM;
				ctx.drawImage(shield, 35, 1, 16, 16, imgx, imgy,
					16 * PX_NUM, 16 * PX_NUM);
			}
			break;
	}
};

//draws the sword when the "s" button is pressed
const drawSword = () => {

	if (g_swordFrame === -1)
		return;
	handleKeyUp();
	currentKey[83] = 1;
	switch (direct) {
		// 1 = up 2 = down 3 = left 4 = right
		case 1:
			imgx = centerX - 100;
			imgy = centerY - 60;
			ctx.drawImage(swordUp, 120 - (16 + 1) * (g_swordFrame + 1), 1, 16, 16, imgx, imgy,
				16 * PX_NUM, 16 * PX_NUM);
			g_swordFrame += 1;
			if (g_swordFrame > 7)
				g_swordFrame = -1;
			drawPlayer();
			break;
		case 2:
			//down
			imgx = centerX + 20;
			imgy = centerY + 10;
			ctx.drawImage(swordDown, (16 + 1) * (g_swordFrame + 1), 1, 16, 16, imgx, imgy,
				16 * PX_NUM, 16 * PX_NUM);
			g_swordFrame += 1;
			if (g_swordFrame > 7)
				g_swordFrame = -1;
			break;
		case 3:
			//left
			imgx = centerX - 100;
			imgy = centerY - 20;
			ctx.drawImage(swordLeft, 1, ((16 * g_swordFrame) + (1 * (g_swordFrame + 1))),
				16, 16, imgx, imgy, 16 * PX_NUM, 16 * PX_NUM);
			g_swordFrame += 1;
			if (g_swordFrame > 7)
				g_swordFrame = -1;
			break;
		case 4:
			//right
			imgx = centerX + 20;
			imgy = centerY + 20;
			ctx.drawImage(swordRight, 1, ((16 * g_swordFrame) + (1 * (g_swordFrame + 1))),
				16, 16, imgx, imgy, 16 * PX_NUM, 16 * PX_NUM);
			g_swordFrame += 1;
			if (g_swordFrame > 7)
				g_swordFrame = -1;
			break;
			drawBG();
	}
};

const drawNPCs = () => {
    for (let i = 0; i<g_NPC.length; i++) {
		npc = g_NPC[i];

		imgx = (npc.init_x - (0-playerPosX))*PX_NUM;
		imgy = (npc.init_y - (0-playerPosY))*PX_NUM;

		ctx.drawImage(npc.stanceImage, imgx-(14/2*PX_NUM), imgy-(21/2*PX_NUM), 14 * PX_NUM, 21*PX_NUM);
	}
}
// called every time after main loop is called
// it will check the position of the player and if the position
// color is red, then it means that you can't cross that part
const boundCheck = () => {
	var imgData = Bctx.getImageData(centerX, centerY, 1, 1);

	if (imgData.data[0] == 255) {

		return false;
	}
	return true;
}