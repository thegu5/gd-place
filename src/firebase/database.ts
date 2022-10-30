import {
    getDatabase,
    ref,
    onChildAdded,
    onChildChanged,
    onChildRemoved,
    onValue,
    get,
    set,
    push,
    child,
    remove,
} from "firebase/database";
import * as PIXI from "pixi.js";
import type * as PIXI_LAYERS from "@pixi/layers";
import { GDObject } from "../editor/object";
import { EditorNode, LEVEL_BOUNDS, ObjectNode } from "../editor/nodes";
import { database } from "./init";
import { vec } from "../utils/vector";
import { canEdit } from "./auth";

export const CHUNK_SIZE = vec(20 * 30, 20 * 30);

let canEditValue = false;
canEdit.subscribe(value => {
    canEditValue = value;
});

export const initChunkBehavior = (
    editorNode: EditorNode,
    worldNode: PIXI.Container,
    selectableWorldNode: PIXI.Container,
    layerGroup: PIXI_LAYERS.Group,
    selectableLayerGroup: PIXI_LAYERS.Group
) => {
    for (
        let x = LEVEL_BOUNDS.start.x;
        x <= LEVEL_BOUNDS.end.x;
        x += CHUNK_SIZE.x
    ) {
        for (
            let y = LEVEL_BOUNDS.start.y;
            y <= LEVEL_BOUNDS.end.y;
            y += CHUNK_SIZE.y
        ) {
            let i = x / 20 / 30;
            let j = y / 20 / 30;
            let chunkName = `${i},${j}`;

            let chunk = new PIXI.Container();
            chunk.name = chunkName;
            worldNode.addChild(chunk);

            let selectableChunk = new PIXI.Container();
            selectableChunk.name = chunkName;
            selectableWorldNode.addChild(selectableChunk);

            onChildAdded(ref(database, `chunks/${chunkName}`), snapshot => {
                // console.log(snapshot.val());
                let obj = GDObject.fromDatabaseString(snapshot.val());
                let objectNode = new ObjectNode(obj, layerGroup);
                objectNode.name = snapshot.key;
                chunk.addChild(objectNode);

                let selectableSprite = new PIXI.Sprite(PIXI.Texture.EMPTY);
                selectableSprite.name = snapshot.key;
                selectableSprite.anchor.set(0.5);
                selectableSprite.alpha = 0.1;
                selectableSprite.renderable = false;

                selectableSprite.position = objectNode.position;
                selectableSprite.rotation = objectNode.rotation;
                selectableSprite.width = 40 * objectNode.scale.x;
                selectableSprite.height = 40 * objectNode.scale.y;
                selectableSprite.parentGroup = selectableLayerGroup;

                selectableChunk.addChild(selectableSprite);

                selectableSprite.interactive = true;
                selectableSprite.on("pointerup", () => {
                    if (canEditValue) {
                        editorNode.deselectObject();
                        const select_box = new PIXI.Graphics();
                        select_box.name = "select_box";
                        let [width, height] = [
                            objectNode.sprite().width,
                            objectNode.sprite().height,
                        ];
                        select_box.clear();
                        select_box
                            .lineStyle(1, 0xff3075, 1)
                            .drawRect(
                                -width / 2 - 5,
                                -height / 2 - 5,
                                width + 10,
                                height + 10
                            );

                        console.log(select_box, width, height);

                        objectNode.addChild(select_box);

                        editorNode.selectedObjectNode = objectNode;
                        selectableSprite.zOrder = editorNode.nextSelectionZ;
                        editorNode.nextSelectionZ -= 1;
                        editorNode.selectedObjectChunk = chunkName;
                    }
                });
            });

            // onChildChanged(ref(database, `chunks/${chunkName}`), snapshot => {
            //     let objectNode = chunk.getChildByName(
            //         snapshot.key
            //     ) as ObjectNode;
            //     let selectableSprite = selectableChunk.getChildByName(
            //         snapshot.key
            //     ) as ObjectNode;
            //     let obj = GDObject.fromDatabaseString(snapshot.val());
            //     objectNode.update(obj);
            //     objectNode.sprite().texture = PIXI.Texture.from(
            //         `gd/objects/main/${obj.id}.png`
            //     );
            //     selectableSprite.position = objectNode.position;
            //     selectableSprite.rotation = objectNode.rotation;
            //     selectableSprite.width = 50 * objectNode.scale.x;
            //     selectableSprite.height = 50 * objectNode.scale.y;
            // });

            onChildRemoved(ref(database, `chunks/${chunkName}`), snapshot => {
                if (
                    editorNode.selectedObjectChunk == chunkName &&
                    editorNode.selectedObjectNode.name == snapshot.key
                ) {
                    editorNode.deselectObject();
                }
                chunk.getChildByName(snapshot.key).destroy();
                selectableChunk.getChildByName(snapshot.key).destroy();
            });
        }
    }
};

export const addObjectToLevel = (obj: GDObject) => {
    let chunkX = Math.floor(obj.x / CHUNK_SIZE.x);
    let chunkY = Math.floor(obj.y / CHUNK_SIZE.y);
    push(ref(database, `chunks/${chunkX},${chunkY}`), obj.toDatabaseString());
};

export const deleteObjectFromLevel = (objName: string, chunkName: string) => {
    remove(ref(database, `chunks/${chunkName}/${objName}`));
};

// let cocker = {};
// for (let i = 0; i < 100; i += 5) {
//     cocker[i] = `1;${15 + i};15;0;0;1`;
// }

// set(ref(database, "/"), {
//     chunks: {
//         "0,0": {
//             a: "1;15;15;0;0;4",
//         },
//     },
// });
// set(ref(database, "chunks/0,0/fgdgdfg4"), "1;45;15");
// set(ref(database, "chunks/0,0/bv5fgn32"), "1;75;15");
// set(ref(database, "cock"), { a: 5, b: 2 });

// onValue(ref(database, "cock"), snapshot => {
//     console.log(
//         snapshot.forEach(child => {
//             console.log(child);
//         })
//     );
// });
