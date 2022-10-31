import { clamp } from "../utils/math";

export const COLOR_CHANGES = [
    { bg: [0.1, 0.1, 0.1], ground: [0, 0, 0], time: 0, fade: 0 },
    { bg: [0.5, 0.0, 0.0], ground: [0.8, 0.1, 0.0], time: 0, fade: 0.5 },
    { bg: [0, 0, 0.3], ground: [0.7, 0, 0.7], time: 10, fade: 0.5 },
];

export function getColors(time: number) {
    let bg = [0, 0, 0];
    let ground = [0, 0, 0];
    for (let i = 0; i <= COLOR_CHANGES.length; i++) {
        const colorChange = COLOR_CHANGES[i];
        const nextTime = COLOR_CHANGES[i + 1]?.time ?? Infinity;

        let current_time = Math.min(time, nextTime);

        let blend;
        if (colorChange.fade === 0) blend = 1;
        else blend = (current_time - colorChange.time) / colorChange.fade;
        blend = clamp(blend, 0, 1);

        bg = [
            bg[0] * (1 - blend) + colorChange.bg[0] * blend,
            bg[1] * (1 - blend) + colorChange.bg[1] * blend,
            bg[2] * (1 - blend) + colorChange.bg[2] * blend,
        ];

        ground = [
            ground[0] * (1 - blend) + colorChange.ground[0] * blend,
            ground[1] * (1 - blend) + colorChange.ground[1] * blend,
            ground[2] * (1 - blend) + colorChange.ground[2] * blend,
        ];
        if (time < nextTime) break;
    }

    //console.log(index)

    return { bg, ground };
}
