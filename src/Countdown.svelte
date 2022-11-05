<script lang="ts">
    import * as PIXI from "pixi.js"
    import { onMount } from "svelte"
    let canvas: HTMLCanvasElement

    export const OBJECTS = [1, 2, 3, 4, 5, 6, 7]

    function random(min, max) {
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min) + min) // The maximum is exclusive and the minimum is inclusive
    }

    onMount(() => {
        let app = new PIXI.Application({
            width: canvas.offsetWidth,
            height: canvas.offsetHeight,
            resizeTo: canvas,
            backgroundColor: 0x060606,
            view: canvas,
            resolution: 1,
        })

        // for (let o of OBJECTS) {
        //     app.loader.add(`gd/objects/main/${o}.png`)
        // }

        let container = new PIXI.Container()
        container.interactive = true

        let sprite = new PIXI.Sprite()
        container.addChild(sprite)

        sprite.visible = true

        // app.loader.onComplete.add(() => {
        //     container.on("mousemove", (e) => {
        //         let grid_x = Math.floor(e.data.global.x / 30)
        //         let grid_y = Math.floor(e.data.global.y / 30)

        //         // sprite.texture =
        //         //     app.loader.resources[
        //         //         `gd/objects/main/${random(1, 8)}.png`
        //         //     ].texture

        //         sprite.x = grid_x * 30
        //         sprite.y = grid_y * 30
        //     })
        // })

        const circleDiameter = 7
        // https://math.stackexchange.com/questions/3007527/how-many-squares-fit-in-a-circle
        const squaresPerCircle = Math.round(
            Math.PI * (circleDiameter / 2) ** 2 -
                (Math.PI * circleDiameter) / Math.sqrt(2)
        )

        let sprites = []
        for (let i = 0; i < squaresPerCircle; i++) {
            sprites[i] = new PIXI.Sprite()

            sprites[i].scale.set(0.25, 0.25)

            container.addChild(sprites[i])
        }

        let prev_x, prev_y

        container.on("mousemove", (e) => {
            let grid_x = Math.floor(e.data.global.x / 30)
            let grid_y = Math.floor(e.data.global.y / 30)

            if (prev_x != grid_x || prev_y != grid_y) {
                console.log("here")
                // let sprite = sprites[i]
                // sprite.texture = PIXI.Texture.from(
                //     `gd/objects/main/${random(1, 8)}.png`
                // )
                // sprite.x = i * grid_x * 30
                // sprite.y = i * grid_y * 30
                // for (let x = 0; 0 <= circleDiameter; x++) {
                //     for (let y = 0; 0 <= circleDiameter; y++) {
                //         console.log(x, y)
                //         // x += 0.5
                //         // y += 0.5
                //         // if (x ** 2 + y ** 2 <= (circleDiameter / 2) ** 2) {
                //         //     console.log("fits")
                //         //     // let sprite = sprites[index]
                //         //     // sprite.texture = PIXI.Texture.from(
                //         //     //     `gd/objects/main/${random(1, 8)}.png`
                //         //     // )
                //         //     // sprite.x = i * grid_x * 30
                //         //     // sprite.y = i * grid_y * 30
                //         //     // index += 1;
                //         // }
                //     }
                // }

                console.log("here")
            }

            prev_x = grid_x
            prev_y = grid_y
        })

        let gridGraph = new PIXI.Graphics()
        container.addChild(gridGraph)

        app.stage.addChild(container)

        const drawGrid = () => {
            for (let x = 0; x <= canvas.width; x += 30) {
                gridGraph
                    .lineStyle(1, 0xffffff, 0.03)
                    .moveTo(x, 0)
                    .lineTo(x, canvas.height)
            }
            for (let y = 0; y <= canvas.height; y += 30) {
                gridGraph
                    .lineStyle(1, 0xffffff, 0.03)
                    .moveTo(0, y)
                    .lineTo(canvas.width, y)
            }
        }

        drawGrid()

        window.addEventListener("resize", () => {
            gridGraph.clear()
            drawGrid()
        })
    })
</script>

<div class="background">
    <canvas class="pixi_canvas" bind:this={canvas} />
</div>

<style>
    .background {
        background-color: #060606;
        width: 100vw;
        height: 100vh;
    }
    .pixi_canvas {
        position: absolute;
        width: 100%;
        height: 100%;
    }
</style>
