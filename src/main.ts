import kaboom from "kaboom"
import ms from 'ms'
import { BtnTargetObj, GameOverData } from '@/types/game'
import { formatTime, isMobileDevice } from '@/src/lib/utils'
const isMobile = isMobileDevice()
const kbgame = kaboom({
	global: false,
	canvas: document.querySelector("#game"),
	backgroundAudio: true,
	background: [0, 0, 0],
})
const colors = [
	kbgame.color(255, 1, 152),
	kbgame.color(2, 155, 222)
]
const screenWidth = kbgame.width()
const screenHeight = kbgame.height()
const buttonHeight = screenHeight * 0.1
const centerX = screenWidth / 2
const centerY = screenHeight / 2
//images
kbgame.loadSprite("game-bg", "sprites/m-dew.jpg")
kbgame.loadSprite("bean", "sprites/bean.png")
kbgame.loadSprite("crosshair", "sprites/crosshair.png")
//sound 
kbgame.loadSound("gun", "sprites/sounds/shot.mp3")
kbgame.loadSound("shutgun", "sprites/sounds/shutgun.mp3")
//fonts 
kbgame.loadFont("f1", "sprites/fonts/f1.ttf")

//game screen
kbgame.scene("game", () => {
	let score = 0,
		timer = 5,
		lastClick = Date.now()
	kbgame.add([
		kbgame.sprite("game-bg", { width: kbgame.width(), height: kbgame.height() }),
		kbgame.opacity(0.5)
	])
	//score text
	const scoreText = kbgame.add([
		kbgame.pos(10, 10),
		kbgame.color(2, 155, 222),
		kbgame.pos(10, 10),
		kbgame.text(`Score: ${score}`, { font: "f1", size: Math.min(screenWidth, screenHeight) * 0.05 }),
	])
	const timeText = kbgame.add([
		kbgame.color(255, 1, 152),
		kbgame.pos(kbgame.width() - 10, isMobile ? 35 : 20),
		kbgame.anchor("right"),
		kbgame.text("00:00", { font: "f1", size: Math.min(screenWidth, screenHeight) * 0.05 }),
	])
	const makeBtnTarget = () => {
		const x = Math.floor((Math.random() * (kbgame.width() - 100))) + 100
		const y = Math.floor((Math.random() * (kbgame.height() - 100))) + 100
		const btn = kbgame.add([
			"btntarget",
			{
				btnid: "test",
				created: new Date()
			},
			kbgame.pos(x, y),
			kbgame.area({ cursor: "pointer" }),
			kbgame.circle(screenHeight * 0.05),
			kbgame.fadeIn(0.5),
			kbgame.opacity(1),
			colors[Math.floor((Math.random() * 2))]
		])
		kbgame.wait(2, () => btn.destroy())
	}
	//make btn every 10 sec
	const btnMaker = kbgame.loop(10, () => timer > 0 && makeBtnTarget())
	//timer 
	const timeData = kbgame.loop(1, () => {
		console.log(timer)
		if (timer > 0) {
			timer--
			timeText.text = formatTime(timer)
		} else {
			timeData.cancel()
			btnMaker.cancel()
			kbgame.wait(3, () => kbgame.go("game-over"))
		}
	})
	makeBtnTarget()
	kbgame.onClick("btntarget", (btn: BtnTargetObj) => {
		lastClick = Date.now()
		const createdTime = new Date(btn.created).getTime();
		const currentTime = Date.now();
		const elapsedTimeInSeconds = Math.floor((currentTime - createdTime) / 1000)
		console.log(`Time elapsed since button creation: ${ms(elapsedTimeInSeconds)}`)
		kbgame.play("shutgun", { volume: 0.5 })
		btn.destroy()
		score += 1
		scoreText.text = `Score: ${score}`
		if (timer > 0) {
			makeBtnTarget()
		}
	})
})


//main screen 
kbgame.scene("main", () => {
	const fontSizePercentage = 0.07
	const fontSize = Math.min(screenWidth, screenHeight) * fontSizePercentage
	kbgame.add([
		kbgame.sprite("game-bg", { width: kbgame.width(), height: kbgame.height() }),
		kbgame.opacity(0.5)
	])
	const startGameBtn = kbgame.add([
		kbgame.rect(kbgame.width() / 2, buttonHeight, { radius: 18 }),
		kbgame.anchor("center"),
		kbgame.pos(centerX, centerY),
		kbgame.color(255, 1, 152),
		kbgame.area({ cursor: "pointer" })
	])
	kbgame.add([
		kbgame.pos(startGameBtn.pos),
		kbgame.text("Start", { font: "f1", size: fontSize }),
		kbgame.color(255, 255, 255),
		kbgame.anchor("center"),
	])
	startGameBtn.onClick(() => kbgame.go("game"))
})

//game over screen 
kbgame.scene("game-over", (data: GameOverData) => {
	kbgame.add([
		kbgame.sprite("game-bg", { width: kbgame.width(), height: kbgame.height() }),
		kbgame.opacity(0.5)
	])
	console.log(data)
})
kbgame.go("main", { fasf: 1 })