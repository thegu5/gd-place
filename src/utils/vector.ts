import { clamp, snap } from "./math"

export function vec(x: number, y: number): Vector {
    return new Vector(x, y)
}

export class Vector {
    constructor(public x: number, public y: number) {}

    clone() {
        return vec(this.x, this.y)
    }

    plus(other: Vector): Vector {
        return vec(this.x + other.x, this.y + other.y)
    }
    minus(other: Vector): Vector {
        return vec(this.x - other.x, this.y - other.y)
    }
    mult(n: number): Vector {
        return vec(this.x * n, this.y * n)
    }
    div(n: number): Vector {
        return vec(this.x / n, this.y / n)
    }

    eq(other: Vector): boolean {
        return this.x == other.x && this.y == other.y
    }

    dot(other: Vector): number {
        return this.x * other.x + this.y * other.y
    }
    cross(other: Vector): number {
        return this.x * other.y - other.x * this.y
    }

    angle() {
        return Math.atan2(this.x, this.y)
    }

    mag(): number {
        return Math.sqrt(this.magSq())
    }
    magSq(): number {
        return this.x ** 2 + this.y ** 2
    }

    normalized(): Vector {
        return this.div(this.mag())
    }

    between(other: Vector): Vector {
        return other.minus(this)
    }
    distTo(other: Vector): number {
        return this.between(other).mag()
    }
    dirTo(other: Vector): Vector {
        return other.minus(this).normalized()
    }
    angleTo(other: Vector): number {
        return this.between(other).angle()
    }

    rotated(angle: number): Vector {
        return vec(
            this.x * Math.cos(angle) - this.y * Math.sin(angle),
            this.x * Math.sin(angle) + this.y * Math.cos(angle)
        )
    }
    flipped(x: boolean, y: boolean): Vector {
        return vec(this.x * (x ? -1 : 1), this.y * (y ? -1 : 1))
    }

    snapped(grid: number): Vector {
        return vec(snap(this.x, grid), snap(this.y, grid))
    }

    clamped(min: Vector, max: Vector): Vector {
        return vec(clamp(this.x, min.x, max.x), clamp(this.y, min.y, max.y))
    }
}
