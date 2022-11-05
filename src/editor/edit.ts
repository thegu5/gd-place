import type { GDObject } from "./object"

export const EDIT_BUTTONS = [
    {
        tabName: "Transform",
        buttons: [
            {
                image: "left",
                scale: 1.0,
                cb: (obj: GDObject) => {
                    obj.x -= 30
                },
                shortcut: {
                    key: "a",
                    shift: false,
                    alt: false,
                },
            },
            {
                image: "up",
                scale: 1.0,
                cb: (obj: GDObject) => {
                    obj.y += 30
                },
                shortcut: {
                    key: "w",
                    shift: false,
                    alt: false,
                },
            },
            {
                image: "right",
                scale: 1.0,
                cb: (obj: GDObject) => {
                    obj.x += 30
                },
                shortcut: {
                    key: "d",
                    shift: false,
                    alt: false,
                },
            },
            {
                image: "down",
                scale: 1.0,
                cb: (obj: GDObject) => {
                    obj.y -= 30
                },
                shortcut: {
                    key: "s",
                    shift: false,
                    alt: false,
                },
            },
            {
                image: "left_small",
                scale: 1.0,
                cb: (obj: GDObject) => {
                    obj.x -= 2
                },
                shortcut: {
                    key: "a",
                    shift: true,
                    alt: false,
                },
            },
            {
                image: "up_small",
                scale: 1.0,
                cb: (obj: GDObject) => {
                    obj.y += 2
                },
                shortcut: {
                    key: "w",
                    shift: true,
                    alt: false,
                },
            },
            {
                image: "right_small",
                scale: 1.0,
                cb: (obj: GDObject) => {
                    obj.x += 2
                },
                shortcut: {
                    key: "d",
                    shift: true,
                    alt: false,
                },
            },
            {
                image: "down_small",
                scale: 1.0,
                cb: (obj: GDObject) => {
                    obj.y -= 2
                },
                shortcut: {
                    key: "s",
                    shift: true,
                    alt: false,
                },
            },
            {
                image: "left_big",
                scale: 1.0,
                cb: (obj: GDObject) => {
                    obj.x -= 30 * 5
                },
                shortcut: {
                    key: "a",
                    shift: false,
                    alt: true,
                },
            },
            {
                image: "up_big",
                scale: 1.0,
                cb: (obj: GDObject) => {
                    obj.y += 30 * 5
                },
                shortcut: {
                    key: "w",
                    shift: false,
                    alt: true,
                },
            },
            {
                image: "right_big",
                scale: 1.0,
                cb: (obj: GDObject) => {
                    obj.x += 30 * 5
                },
                shortcut: {
                    key: "d",
                    shift: false,
                    alt: true,
                },
            },
            {
                image: "down_big",
                scale: 1.0,
                cb: (obj: GDObject) => {
                    obj.y -= 30 * 5
                },
                shortcut: {
                    key: "s",
                    shift: false,
                    alt: true,
                },
            },
            {
                image: "flip_horiz",
                scale: 1.0,
                cb: (obj: GDObject) => {
                    obj.transform(0, true, false, true)
                },
                shortcut: {
                    key: "q",
                    shift: false,
                    alt: true,
                },
            },
            {
                image: "flip_vert",
                scale: 1.0,
                cb: (obj: GDObject) => {
                    obj.transform(0, false, true, true)
                },
                shortcut: {
                    key: "e",
                    shift: false,
                    alt: true,
                },
            },
            {
                image: "ccw",
                scale: 1.0,
                cb: (obj: GDObject) => {
                    obj.transform(-90, false, false, true)
                },
                shortcut: {
                    key: "q",
                    shift: false,
                    alt: false,
                },
            },
            {
                image: "cw",
                scale: 1.0,
                cb: (obj: GDObject) => {
                    obj.transform(90, false, false, true)
                },
                shortcut: {
                    key: "e",
                    shift: false,
                    alt: false,
                },
            },
            {
                image: "ccw_5",
                scale: 1.0,
                cb: (obj: GDObject) => {
                    obj.transform(-5, false, false, false)
                },
                shortcut: {
                    key: "q",
                    shift: true,
                    alt: false,
                },
            },
            {
                image: "cw_5",
                scale: 1.0,
                cb: (obj: GDObject) => {
                    obj.transform(5, false, false, false)
                },
                shortcut: {
                    key: "e",
                    shift: true,
                    alt: false,
                },
            },
            {
                image: "scale_up",
                scale: 1.0,
                cb: (obj: GDObject) => {
                    obj.scale += 0.1
                },
                shortcut: {
                    key: "e",
                    shift: true,
                    alt: true,
                },
            },
            {
                image: "scale_down",
                scale: 1.0,
                cb: (obj: GDObject) => {
                    obj.scale -= 0.1
                },
                shortcut: {
                    key: "q",
                    shift: true,
                    alt: true,
                },
            },
            {
                image: "left_small",
                scale: 0.5,
                cb: (obj: GDObject) => {
                    obj.x -= 0.5
                },
                shortcut: {
                    key: "a",
                    shift: true,
                    alt: true,
                },
            },
            {
                image: "up_small",
                scale: 0.5,
                cb: (obj: GDObject) => {
                    obj.y += 0.5
                },
                shortcut: {
                    key: "w",
                    shift: true,
                    alt: true,
                },
            },
            {
                image: "right_small",
                scale: 0.5,
                cb: (obj: GDObject) => {
                    obj.x += 0.5
                },
                shortcut: {
                    key: "d",
                    shift: true,
                    alt: true,
                },
            },
            {
                image: "down_small",
                scale: 0.5,
                cb: (obj: GDObject) => {
                    obj.y -= 0.5
                },
                shortcut: {
                    key: "s",
                    shift: true,
                    alt: true,
                },
            },
        ],
    },
    {
        tabName: "Layers",
        buttons: [
            {
                image: "z_plus",
                scale: 1.0,
                cb: (obj: GDObject) => {
                    obj.zOrder += 1
                },
                shortcut: {
                    key: "z",
                    shift: false,
                    alt: false,
                },
            },
            {
                image: "z_minus",
                scale: 1.0,
                cb: (obj: GDObject) => {
                    obj.zOrder -= 1
                },
                shortcut: {
                    key: "z",
                    shift: true,
                    alt: false,
                },
            },
            // {
            //     image: "ccw",
            //     scale: 1.0,
            // },
            // {
            //     image: "cw",
            //     scale: 1.0,
            // },
        ],
    },
    {
        tabName: "Colors",
        buttons: [
            {
                color: "ff0000",
                scale: 1.0,
                shortcut: null,
                cb: null,
            },

            {
                color: "00ff00",
                scale: 1.0,
                shortcut: null,
                cb: null,
            },
            { color: "ff4500", scale: 1.0, shortcut: null, cb: null },
            { color: "ffa800", scale: 1.0, shortcut: null, cb: null },
            { color: "ffd635", scale: 1.0, shortcut: null, cb: null },
            { color: "00a368", scale: 1.0, shortcut: null, cb: null },
            { color: "7eed56", scale: 1.0, shortcut: null, cb: null },
            { color: "2450a4", scale: 1.0, shortcut: null, cb: null },
            { color: "3690ea", scale: 1.0, shortcut: null, cb: null },
            { color: "51e9f4", scale: 1.0, shortcut: null, cb: null },
            { color: "811e9f", scale: 1.0, shortcut: null, cb: null },
            { color: "b44ac0", scale: 1.0, shortcut: null, cb: null },
            { color: "ff99aa", scale: 1.0, shortcut: null, cb: null },
            { color: "9c6926", scale: 1.0, shortcut: null, cb: null },
            { color: "000000", scale: 1.0, shortcut: null, cb: null },
            { color: "898d90", scale: 1.0, shortcut: null, cb: null },
            { color: "d4d7d9", scale: 1.0, shortcut: null, cb: null },
            { color: "ffffff", scale: 1.0, shortcut: null, cb: null },
        ],
    },
]
