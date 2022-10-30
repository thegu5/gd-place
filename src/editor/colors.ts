import { clamp } from "../utils/math";

export const COLOR_CHANGES = [
    { bg: [0.3, 0, 0], ground: [0.7, 0, 0], time: 0, fade: 0.5 },
    { bg: [0, 0, 0.3], ground: [0.7, 0, 0.7], time: 0.3, fade: 0.5 },
];

export function getColors(time: number) {
    let bg = [0, 0, 0];
    let ground = [0, 0, 0];

    for (let i = 0; i < COLOR_CHANGES.length; i++) {
        const colorChange = COLOR_CHANGES[i];
        let blend;
        if (time > colorChange.time) {
            blend = clamp((time - colorChange.time) / colorChange.fade, 0, 1);
        } else {
            blend = clamp(
                (COLOR_CHANGES[i - 1]?.time ?? 0 - colorChange.time) /
                    colorChange.fade,
                0,
                1
            );
        }

        bg = [
            bg[0] + (colorChange.bg[0] - bg[0]) * blend,
            bg[1] + (colorChange.bg[1] - bg[1]) * blend,
            bg[2] + (colorChange.bg[2] - bg[2]) * blend,
        ];

        ground = [
            ground[0] + (colorChange.ground[0] - ground[0]) * blend,
            ground[1] + (colorChange.ground[1] - ground[1]) * blend,
            ground[2] + (colorChange.ground[2] - ground[2]) * blend,
        ];

        if (time > colorChange.time) {
            break;
        }
    }

    //console.log(bg, ground);

    return { bg, ground };
}
