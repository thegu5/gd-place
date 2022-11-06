import { clamp } from "../utils/math"

export const COLOR_CHANGES = [
    { bg: [0.0, 0.0, 0.0], ground: [0.1, 0.1, 0.1], time: 0, fade: 0.0 },
    { bg: hexToRgb("291663"), ground: hexToRgb("1B0E41"), time: 0, fade: 0.5 },
]

export function getColors(time: number) {
    let bg = [0, 0, 0]
    let ground = [0, 0, 0]
    for (let i = 0; i <= COLOR_CHANGES.length; i++) {
        const colorChange = COLOR_CHANGES[i]
        const nextTime = COLOR_CHANGES[i + 1]?.time ?? Infinity

        let current_time = Math.min(time, nextTime)

        let blend
        if (colorChange.fade === 0) blend = 1
        else blend = (current_time - colorChange.time) / colorChange.fade
        blend = clamp(blend, 0, 1)

        bg = [
            bg[0] * (1 - blend) + colorChange.bg[0] * blend,
            bg[1] * (1 - blend) + colorChange.bg[1] * blend,
            bg[2] * (1 - blend) + colorChange.bg[2] * blend,
        ]

        ground = [
            ground[0] * (1 - blend) + colorChange.ground[0] * blend,
            ground[1] * (1 - blend) + colorChange.ground[1] * blend,
            ground[2] * (1 - blend) + colorChange.ground[2] * blend,
        ]
        if (time < nextTime) break
    }

    //console.log(index)

    return { bg, ground }
}

function hexToRgb(hex: string) {
    const bigint = parseInt(hex, 16)
    const r = (bigint >> 16) & 255
    const g = (bigint >> 8) & 255
    const b = bigint & 255

    return [r / 255, g / 255, b / 255]
}
