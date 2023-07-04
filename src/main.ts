import kaboom, { AnchorComp, AreaComp, ColorComp, GameObj, PosComp, RectComp } from "kaboom"
import ms from 'ms'
import { BtnTargetObj, GameOverData } from '@/types/game'
import { formatTime } from '@/src/lib/utils'
import WebApp from "@twa-dev/sdk"
const kbgame = kaboom({
	global: false,
	canvas: document.querySelector("#game"),
	background: [0, 0, 0],
})
const isMobile = kbgame.isTouchscreen()
const colors = [
	kbgame.color(255, 1, 152), //pink
	kbgame.color(2, 155, 222) //blue
]
const screenWidth = kbgame.width()
const screenHeight = kbgame.height()
const centerX = screenWidth / 2
const centerY = screenHeight / 2
//images
kbgame.loadSprite("game-bg", "sprites/m-dew.jpg")
kbgame.loadSprite("bean", "sprites/bean.png")
kbgame.loadSprite("crosshair", "sprites/crosshair.png")
//sound 
kbgame.loadSound("gun", "sprites/sounds/shot.mp3")
kbgame.loadSound("shutgun", "sprites/sounds/shutgun.mp3")
kbgame.loadSound("bg-music", "sprites/sounds/bg-music.mp3")
//fonts 
kbgame.loadFont("f1", "sprites/fonts/f1.ttf")
//game screen
kbgame.scene("game", () => {
	let score = 0,
		timer = 30,
		blue = 0,
		pink = 0,
		lastClick = Date.now()
	const gameBg = kbgame.add([
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
	//time is up text 
	const timeIsUp = kbgame.add([
		kbgame.opacity(0),
		kbgame.anchor("center"),
		kbgame.pos(centerX, centerY),
		kbgame.color(255, 1, 152),
		kbgame.text("Time is up!", { size: Math.min(screenWidth, screenHeight) * 0.06 }),
		kbgame.area({ cursor: "pointer" })
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
		const targets = kbgame.get("btntarget").length
		const Btnindex = Math.floor((Math.random() * 2))
		console.log(Btnindex)
		if (targets <= 1) {
			const btn = kbgame.add([
				"btntarget",
				{
					btnid: "test",
					created: new Date(),
					buttonColor: Btnindex
				},
				kbgame.pos(x, y),
				kbgame.area({ cursor: "pointer" }),
				kbgame.circle(screenHeight * 0.05),
				kbgame.fadeIn(0.5),
				kbgame.opacity(1),
				colors[Btnindex]
			])
			kbgame.wait(5, () => btn.destroy())
		}
	}
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
		if (btn.buttonColor === 0) pink += 1
		if (btn.buttonColor === 1) blue += 1
		if (timer > 0) makeBtnTarget()
	})
	//make btn every 10 sec
	const btnMaker = kbgame.loop(5, () => {
		if (timer > 0) makeBtnTarget()
	})
	//timer 
	const timeData = kbgame.loop(1, () => {
		if (timer > 0) {
			timer--
			timeText.text = formatTime(timer)
		} else {
			timeIsUp.opacity = 1
			gameBg.opacity = 0.2
			timeData.cancel()
			btnMaker.cancel()
			kbgame.wait(1, () => kbgame.go("game-over", { score, blue, pink }))
		}
	})
})

//main screen 
kbgame.scene("main", () => {
	const fontSize = Math.min(screenWidth, screenHeight) * 0.05
	kbgame.add([
		kbgame.sprite("game-bg", { width: kbgame.width(), height: kbgame.height() }),
		kbgame.opacity(0.2)
	])
	kbgame.add([
		kbgame.text("BFS Aim Trainer", {
			align: "center",
			font: 'f1',
			size: (Math.min(screenWidth, screenHeight) * 0.05) + (isMobile ? 10 : 5),

		}),
		kbgame.color(2, 155, 222),
		kbgame.pos(centerX, centerY - (screenHeight * 0.08) - (isMobile ? 10 : 1)),
		kbgame.anchor("center")
	])
	const startGameBtn = kbgame.add([
		kbgame.rect(kbgame.width() / 2, (screenHeight * 0.08) - 10, { radius: 18 }),
		kbgame.anchor("center"),
		kbgame.pos(centerX, centerY),
		kbgame.color(255, 1, 152),
		kbgame.area({ cursor: "pointer" })
	])
	kbgame.add([
		kbgame.pos(startGameBtn.pos),
		kbgame.text("Start", { font: "f1", size: fontSize - (isMobile ? 10 : 5) }),
		kbgame.color(255, 255, 255),
		kbgame.anchor("center"),
	])
	startGameBtn.onClick(() => {
		kbgame.play("bg-music", { loop: true, volume: 0.5, seek: 2 })
		kbgame.go("game")
	})
})

//game over screen 
kbgame.scene("game-over", (data: GameOverData) => {
	console.log(data)
	kbgame.add([
		kbgame.sprite("game-bg", { width: kbgame.width(), height: kbgame.height() }),
		kbgame.opacity(0.2)
	])
	const card: GameObj<ColorComp | RectComp | AnchorComp | PosComp | AreaComp> = kbgame.add([
		kbgame.rect(kbgame.width() * 0.9, kbgame.height() * 0.7, { radius: 18 }),
		kbgame.pos(centerX, centerY),
		kbgame.anchor("center"),
		kbgame.color(28, 28, 29),
		kbgame.opacity(1),
		kbgame.fadeIn(0.5),
	]) as any
	//score text title
	kbgame.add([
		kbgame.text("Score Board", { font: 'f1', size: Math.min(screenWidth, screenHeight) * 0.05 }),
		kbgame.pos(card.pos.x, (card.pos.y / 3) + (isMobile ? 50 : 30)),
		kbgame.anchor("center"),
		kbgame.color(2, 155, 222)
	])

	const tryagainbtn = kbgame.add([
		kbgame.rect(kbgame.width() / 2, (screenHeight * 0.08) - (isMobile ? 30 : 10), { radius: 18 }),
		kbgame.anchor("center"),
		kbgame.pos(card.pos.x, card.height + (isMobile ? 5 : 50)),
		kbgame.color(255, 1, 152),
		kbgame.area({ cursor: "pointer" })
	])
	tryagainbtn.onClick(() => kbgame.go("game"))
	kbgame.add([
		kbgame.pos(tryagainbtn.pos),
		kbgame.text("Try Again", { font: "f1", size: Math.min(screenWidth, screenHeight) * (isMobile ? 0.05 : 0.03) }),
		kbgame.color(255, 255, 255),
		kbgame.anchor("center"),
	])
	//score
	kbgame.add([
		kbgame.text("Score", { font: 'f1', size: Math.min(screenWidth, screenHeight) * 0.04 }),
		kbgame.pos((kbgame.width() - kbgame.width() * 0.9), (kbgame.height() - kbgame.height() * 0.7)),
		kbgame.anchor("left"),
		kbgame.color(255, 1, 152),
		kbgame.area()
	])
	kbgame.add([
		kbgame.text(`${data?.score ?? 0}`, { font: 'f1', size: Math.min(screenWidth, screenHeight) * 0.04 }),
		kbgame.pos(kbgame.width() * 0.9 - (10 * 2), (kbgame.height() - kbgame.height() * 0.7)),
		kbgame.anchor("right"),
		kbgame.color(2, 155, 222),
		kbgame.area()
	])
	//end score

	//ms 
	kbgame.add([
		kbgame.text("MS per target", { font: 'f1', size: Math.min(screenWidth, screenHeight) * 0.04 }),
		kbgame.pos((kbgame.width() - kbgame.width() * 0.9), (kbgame.height() - kbgame.height() * 0.7) + (isMobile ? 80 : 40)),
		kbgame.anchor("left"),
		kbgame.color(255, 1, 152),
		kbgame.area()
	])
	kbgame.add([
		kbgame.text(`0ms`, { font: 'f1', size: Math.min(screenWidth, screenHeight) * 0.04 }),
		kbgame.pos(kbgame.width() * 0.9 - (10 * 2), (kbgame.height() - kbgame.height() * 0.7) + (isMobile ? 80 : 40)),
		kbgame.anchor("right"),
		kbgame.color(2, 155, 222),
		kbgame.area()
	])
	//end ms
	kbgame.add([
		kbgame.text("Blue", { font: 'f1', size: Math.min(screenWidth, screenHeight) * 0.04 }),
		kbgame.pos((kbgame.width() - kbgame.width() * 0.9), (kbgame.height() - kbgame.height() * 0.7) + (40 * (isMobile ? 4 : 2))),
		kbgame.anchor("left"),
		kbgame.color(255, 1, 152),
		kbgame.area()
	])
	kbgame.add([
		kbgame.text(`${data?.blue ?? 0}`, { font: 'f1', size: Math.min(screenWidth, screenHeight) * 0.04 }),
		kbgame.pos(kbgame.width() * 0.9 - (10 * 2), (kbgame.height() - kbgame.height() * 0.7) + (40 * (isMobile ? 4 : 2))),
		kbgame.anchor("right"),
		kbgame.color(2, 155, 222),
		kbgame.area()
	])
	kbgame.add([
		kbgame.text("Pink", { font: 'f1', size: Math.min(screenWidth, screenHeight) * 0.04 }),
		kbgame.pos((kbgame.width() - kbgame.width() * 0.9), (kbgame.height() - kbgame.height() * 0.7) + (40 * (isMobile ? 6 : 3))),
		kbgame.anchor("left"),
		kbgame.color(255, 1, 152),
		kbgame.area()
	])
	kbgame.add([
		kbgame.text(`${data?.pink ?? 0}`, { font: 'f1', size: Math.min(screenWidth, screenHeight) * 0.04 }),
		kbgame.pos(kbgame.width() * 0.9 - (10 * 2), (kbgame.height() - kbgame.height() * 0.7) + (40 * (isMobile ? 6 : 3))),
		kbgame.anchor("right"),
		kbgame.color(2, 155, 222),
		kbgame.area()
	])
	kbgame.add([
		kbgame.text("Bonus", { font: 'f1', size: Math.min(screenWidth, screenHeight) * 0.04 }),
		kbgame.pos((kbgame.width() - kbgame.width() * 0.9), (kbgame.height() - kbgame.height() * 0.7) + (40 * (isMobile ? 8 : 4))),
		kbgame.anchor("left"),
		kbgame.color(255, 1, 152),
		kbgame.area()
	])
	kbgame.add([
		kbgame.text("0", { font: 'f1', size: Math.min(screenWidth, screenHeight) * 0.04 }),
		kbgame.pos(kbgame.width() * 0.9 - (10 * 2), (kbgame.height() - kbgame.height() * 0.7) + (40 * (isMobile ? 8 : 4))),
		kbgame.anchor("right"),
		kbgame.color(2, 155, 222),
		kbgame.area()
	])
})
const start = () => kbgame.go("main")
requestAnimationFrame(start)
WebApp.ready()
WebApp.expand()
WebApp.BackButton.show()
WebApp.BackButton.onClick(() => {
	WebApp.BackButton.hide()
	window?.location.assign("https://bfs.teamdao.app")
})