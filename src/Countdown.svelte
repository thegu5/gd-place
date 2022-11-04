<script lang="ts">
    import * as PIXI from "pixi.js"
    import { onMount } from "svelte"
    import { LEVEL_BOUNDS } from "./editor/nodes"
    let canvas: HTMLCanvasElement

    onMount(() => {
        let app = new PIXI.Application({
            width: canvas.offsetWidth,
            height: canvas.offsetHeight,
            resizeTo: canvas,
            backgroundColor: 0x060606,
            view: canvas,
            resolution: 1,
        })

        let container = new PIXI.Container()

        let gridGraph = new PIXI.Graphics()
        container.addChild(gridGraph)

        app.stage.addChild(container)

        const drawGrid = () => {
            for (let x = 0; x <= canvas.width; x += 30) {
                gridGraph
                    .lineStyle(1, 0xffffff, 0.03)
                    .moveTo(x, LEVEL_BOUNDS.start.y)
                    .lineTo(x, LEVEL_BOUNDS.end.y)
            }
            for (let y = 0; y <= canvas.height; y += 30) {
                gridGraph
                    .lineStyle(1, 0xffffff, 0.03)
                    .moveTo(LEVEL_BOUNDS.start.x, y)
                    .lineTo(LEVEL_BOUNDS.end.x, y)
            }
        }

        drawGrid()

        window.addEventListener("resize", () => {
            gridGraph.clear()
            drawGrid()
        })

        window.addEventListener("", () => {
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
        width: 100%;
        height: 100%;
    }
</style>
