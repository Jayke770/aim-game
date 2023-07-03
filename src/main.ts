import kaboom from "kaboom"
import ms from 'ms'
import { BtnTargetObj } from '@/types/game'
import { formatTime, basePath } from '@/src/lib/utils'
const kbgame = kaboom({
	global: false,
	backgroundAudio: true,
	background: [0, 0, 0],
})
const colors = [
	kbgame.color(255, 1, 152),
	kbgame.color(2, 155, 222)
]
//images
kbgame.loadSprite("game-bg", `${basePath ?? ""}/sprites/m-dew.jpg`)
kbgame.loadSprite("bean", `${basePath ?? ""}/sprites/bean.png`)
kbgame.loadSprite("crosshair", `${basePath ?? ""}/sprites/crosshair.png`)
//sound 
kbgame.loadSound("gun", `${basePath ?? ""}/sprites/sounds/shot.mp3`)
kbgame.loadSound("shutgun", `${basePath ?? ""}/sprites/sounds/shutgun.mp3`)
//fonts 
kbgame.loadFont("f1", `${basePath ?? ""}/sprites/fonts/f1.ttf`)
//game screen
kbgame.scene("game", () => {
	let score = 0, timer = 120
	kbgame.add([
		kbgame.sprite("game-bg", { width: kbgame.width(), height: kbgame.height() }),
		kbgame.opacity(0.5)
	])
	//score text
	const scoreText = kbgame.add([
		kbgame.pos(10, 10),
		kbgame.color(2, 155, 222),
		kbgame.pos(10, 10),
		kbgame.text(`Score: ${score}`, { font: "f1", size: 20 }),
	])
	const timeText = kbgame.add([
		kbgame.color(255, 1, 152),
		kbgame.pos(kbgame.width() - 10, 20),
		kbgame.anchor("right"),
		kbgame.text("2:22", { font: "f1", size: 20 }),
	])
	const makeBtnTarget = () => {
		const x = Math.floor((Math.random() * (kbgame.width() - 100))) + 50
		const y = Math.floor((Math.random() * (kbgame.height() - 100))) + 50
		const btn = kbgame.add([
			"btntarget",
			{
				btnid: "test",
				created: new Date()
			},
			kbgame.pos(x, y),
			kbgame.area({ cursor: "pointer" }),
			kbgame.circle(30),
			kbgame.fadeIn(0.5),
			kbgame.opacity(1),
			colors[Math.floor((Math.random() * 2))]
		])
	}
	//timer 
	kbgame.loop(1, () => {
		if (timer > 0) {
			timer--
			timeText.text = formatTime(timer)
		}
	})
	makeBtnTarget()
	kbgame.onClick("btntarget", (btn: BtnTargetObj) => {
		const createdTime = new Date(btn.created).getTime();
		const currentTime = Date.now();
		const elapsedTimeInSeconds = Math.floor((currentTime - createdTime) / 1000)
		console.log(`Time elapsed since button creation: ${ms(elapsedTimeInSeconds)}`)
		kbgame.play("shutgun", { volume: 0.5 })
		btn.destroy()
		score += 1
		scoreText.text = `Score: ${score}`
		if (timer > 0) makeBtnTarget()
	})
	//make btn target every 5 secs 
	kbgame.loop(3, () => timer > 0 && makeBtnTarget())
})
//main screen 
kbgame.scene("main", () => {
	kbgame.add([
		kbgame.sprite("game-bg", { width: kbgame.width(), height: kbgame.height() }),
		kbgame.opacity(0.5)
	])
	const startGameBtn = kbgame.add([
		kbgame.rect(200, 50, { radius: 10 }),
		kbgame.anchor("center"),
		kbgame.pos(kbgame.width() / 2, kbgame.height() / 2),
		kbgame.color(255, 1, 152),
		kbgame.area({ cursor: "pointer" })
	])
	kbgame.add([
		kbgame.pos(startGameBtn.pos),
		kbgame.text("Start", { font: "f1", size: 20, }),
		kbgame.color(255, 255, 255),
		kbgame.anchor("center"),
	])
	startGameBtn.onClick(() => kbgame.go("game"))
})
kbgame.go("main")