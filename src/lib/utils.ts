export const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${padZero(minutes)}:${padZero(remainingSeconds)}`
}
export const padZero = (number: number): string => number.toString().padStart(2, "0")
export const isMobileDevice = () => /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window?.navigator?.userAgent)