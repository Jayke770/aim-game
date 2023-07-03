export const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${padZero(minutes)}:${padZero(remainingSeconds)}`
}
export const padZero = (number: number): string => number.toString().padStart(2, "0")