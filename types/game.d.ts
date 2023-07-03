import { GameObj } from 'kaboom'
export type BtnTargetObj = GameObj & {
    btnid: string,
    created?: number
}
export type GameOverData = {
    score?: number,
    ms?: number[]
}