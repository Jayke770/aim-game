import kaboom from "kaboom"
const kbgame = kaboom({
	global: false,
	backgroundAudio: true,
	background: [0, 0, 0],
})
const colors = [
	kbgame.color(255, 1, 152),
	kbgame.color(2, 155, 222),
]
//images
kbgame.loadSprite("game-bg", "/sprites/m-dew.jpg")
kbgame.loadSprite("bean", "/sprites/bean.png")
kbgame.loadSprite("crosshair", "/sprites/crosshair.png")
//sound 
kbgame.loadSound("gun", "/sprites/sounds/shot.mp3")
kbgame.loadSound("shutgun", "/sprites/sounds/shutgun.mp3")
kbgame.scene("game", () => {
	kbgame.add([
		kbgame.sprite("game-bg", { width: kbgame.width(), height: kbgame.height() }),
		kbgame.opacity(0.5)
	])
	const makeBtnTarget = () => {
		kbgame.add([
			"bean",
			{
				btnid: "test"
			},
			kbgame.pos(
				Math.floor((Math.random() * kbgame.width()) + 1) - 10,
				Math.floor((Math.random() * kbgame.height()) + 1) - 10,
			),
			kbgame.area({ cursor: "pointer" }),
			kbgame.circle(30),
			colors[Math.floor((Math.random() * 2))]
		])
	}
	makeBtnTarget()
	kbgame.onClick("bean", g => {
		kbgame.play("shutgun", { volume: 0.5 })
		g.destroy()
		makeBtnTarget()
	})
})
kbgame.go("game")