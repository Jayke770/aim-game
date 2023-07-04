import { GameObj } from 'kaboom'
export type BtnTargetObj = GameObj & {
    btnid: string,
    buttonColor: 0 | 1,
    created?: number
}
export type GameOverData = {
    score?: number,
    pink?: number,
    blue?: number,
    ms?: number[]
}