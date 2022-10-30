export const map_range = (
    x: number,
    a: number,
    b: number,
    c: number,
    d: number
) => {
    let t = (x - a) / (b - a);
    return c + (d - c) * t;
};

export const snap = (x: number, grid: number) => Math.floor(x / grid) * grid;

export const clamp = (x: number, min: number, max: number) =>
    Math.min(max, Math.max(min, x));
export const clampAbs = (x: number, min: number, max: number) => {
    return clamp(Math.abs(x), min, max) * Math.sign(x);
};

export const wrap = (x: number, min: number, max: number) => {
    return x - Math.floor((x - min) / (max - min)) * (max - min);
};
