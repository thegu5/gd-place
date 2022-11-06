import { vec } from "../utils/vector"

export class GdColor {
    constructor(
        public hex: string,
        public blending: boolean,
        public opacity: number
    ) {}
    toDatabaseString() {
        return `${this.hex};${this.blending ? 1 : 0};${this.opacity}`
    }
    static fromDatabaseString(str: string) {
        let [hex, blending, opacity] = str.split(";")

        return new GdColor(hex, blending == "1", parseFloat(opacity))
    }
    clone() {
        return new GdColor(this.hex, this.blending, this.opacity)
    }
}

export class GDObject {
    constructor(
        public id: number,
        public x: number,
        public y: number,
        public rotation: number,
        public flip: boolean,
        public scale: number,
        public zOrder: number,
        public mainColor: GdColor,
        public detailColor: GdColor
    ) {}

    toDatabaseString() {
        return `${this.id};${this.x};${this.y};${Math.round(this.rotation)};${
            this.flip ? 1 : 0
        };${this.scale};${
            this.zOrder
        };${this.mainColor.toDatabaseString()};${this.detailColor.toDatabaseString()}`
    }

    clone() {
        return new GDObject(
            this.id,
            this.x,
            this.y,
            this.rotation,
            this.flip,
            this.scale,
            this.zOrder,
            this.mainColor.clone(),
            this.detailColor.clone()
        )
    }

    static fromDatabaseString(s: string) {
        let [
            id,
            x,
            y,
            rotation,
            flip,
            scale,
            zOrder,
            mainColor,
            mainBlending,
            mainOpacity,
            detailColor,
            detailBlending,
            detailOpacity,
        ] = s.split(";")
        //console.log(color)
        return new GDObject(
            // 🤣
            parseInt(id),
            parseFloat(x),
            parseFloat(y),
            parseInt(rotation),
            flip == "1",
            parseFloat(scale),
            parseInt(zOrder),
            new GdColor(
                mainColor,
                mainBlending == "1",
                parseFloat(mainOpacity)
            ),
            new GdColor(
                detailColor,
                detailBlending == "1",
                parseFloat(detailOpacity)
            )
        )
    }

    settings() {
        return getObjSettings(this.id)
    }

    transform(
        angle: number,
        flipHoriz: boolean,
        flipVert: boolean,
        offset: boolean
    ) {
        if (offset) {
            let settings = this.settings()
            let offVec = vec(settings.offset_x, settings.offset_y).rotated(
                -(this.rotation * Math.PI) / 180
            )
            this.x -= offVec.x
            this.y -= offVec.y
            offVec = offVec.rotated(-(angle * Math.PI) / 180)
            offVec.x *= flipHoriz ? -1 : 1
            offVec.y *= flipVert ? -1 : 1
            this.x += offVec.x
            this.y += offVec.y
        }
        this.rotation += angle
        if (flipHoriz) {
            this.flip = !this.flip
            this.rotation *= -1
        }
        if (flipVert) {
            this.flip = !this.flip
            this.rotation = 180 - this.rotation
        }
    }
}

export const OBJECT_SETTINGS = [
    { id: 1, offset_x: 0, offset_y: 0, solid: true },
    { id: 83, offset_x: 0, offset_y: 0, solid: true },
    { id: 2, offset_x: 0, offset_y: 0, solid: true },
    { id: 3, offset_x: 0, offset_y: 0, solid: true },
    { id: 4, offset_x: 0, offset_y: 0, solid: false },
    { id: 5, offset_x: 0, offset_y: 0, solid: false },
    { id: 6, offset_x: 0, offset_y: 0, solid: true },
    { id: 7, offset_x: 0, offset_y: 0, solid: true },
    { id: 467, offset_x: 0, offset_y: 0, solid: true },
    { id: 468, offset_x: 0, offset_y: 14.25, solid: true },
    { id: 469, offset_x: 0, offset_y: 0, solid: true },
    { id: 470, offset_x: 0, offset_y: 0, solid: true },
    { id: 471, offset_x: 0, offset_y: 0, solid: true },
    { id: 472, offset_x: 0, offset_y: 0, solid: false },
    { id: 1338, offset_x: 0, offset_y: 0, solid: true },
    { id: 1339, offset_x: 15, offset_y: 0, solid: true },
    { id: 1210, offset_x: 0, offset_y: 0, solid: true },
    { id: 1202, offset_x: 0, offset_y: 13.5, solid: true },
    { id: 1203, offset_x: 0, offset_y: 0, solid: true },
    { id: 1204, offset_x: 0, offset_y: 0, solid: true },
    { id: 1209, offset_x: 0, offset_y: 0, solid: true },
    { id: 1205, offset_x: 0, offset_y: 0, solid: false },
    { id: 216, offset_x: 0, offset_y: 0, solid: false },
    { id: 217, offset_x: 0, offset_y: -9, solid: false },
    { id: 218, offset_x: 0, offset_y: -6, solid: false },
    { id: 458, offset_x: -7.5, offset_y: -9.75, solid: false },
    { id: 1889, offset_x: 0, offset_y: 0, solid: false },
    { id: 1890, offset_x: 0, offset_y: -9, solid: false },
    { id: 1891, offset_x: 0, offset_y: -6, solid: false },
    { id: 1892, offset_x: -7.5, offset_y: -9.75, solid: false },
    { id: 177, offset_x: 0, offset_y: 0, solid: false },
    { id: 178, offset_x: 0, offset_y: -8, solid: false },
    { id: 179, offset_x: 0, offset_y: -6, solid: false },
    { id: 1715, offset_x: 0, offset_y: -12.5, solid: false },
    { id: 1722, offset_x: 0, offset_y: -11, solid: false },
    { id: 1720, offset_x: 0, offset_y: -11, solid: false },
    { id: 1721, offset_x: 0, offset_y: -11, solid: false },
    { id: 135, offset_x: 0, offset_y: -11, solid: false },
    { id: 1717, offset_x: 0, offset_y: 0, solid: false },
    { id: 1718, offset_x: 15, offset_y: 0, solid: false },
    { id: 1723, offset_x: 0, offset_y: 0, solid: false },
    { id: 1724, offset_x: 15, offset_y: 0, solid: false },
    { id: 1725, offset_x: 0, offset_y: -9, solid: false },
    { id: 1728, offset_x: 0, offset_y: -7.5, solid: false },
    { id: 1729, offset_x: 0, offset_y: -7.5, solid: false },
    { id: 1730, offset_x: 0, offset_y: -7.5, solid: false },
    { id: 1731, offset_x: -11.5, offset_y: -11.5, solid: false },
    { id: 211, offset_x: 0, offset_y: 0, solid: false },
    { id: 1825, offset_x: 0, offset_y: 0, solid: false },
    { id: 259, offset_x: 0, offset_y: 0, solid: false },
    { id: 266, offset_x: 0, offset_y: 0, solid: false },
    { id: 273, offset_x: 0, offset_y: 0, solid: false },
    { id: 658, offset_x: 0, offset_y: 0, solid: false },
    { id: 722, offset_x: 0, offset_y: 0, solid: false },
    { id: 659, offset_x: 0, offset_y: 0, solid: false },
    { id: 734, offset_x: 0, offset_y: 0, solid: false },
    { id: 869, offset_x: 0, offset_y: 0, solid: false },
    { id: 870, offset_x: 0, offset_y: 0, solid: false },
    { id: 871, offset_x: 0, offset_y: 0, solid: false },
    { id: 1266, offset_x: 0, offset_y: 0, solid: false },
    { id: 1267, offset_x: 0, offset_y: 0, solid: false },
    { id: 873, offset_x: 0, offset_y: 7.5, solid: false },
    { id: 874, offset_x: -7.5, offset_y: -7.5, solid: false },
    { id: 880, offset_x: 0, offset_y: 0, solid: false },
    { id: 881, offset_x: 0, offset_y: 0, solid: false },
    { id: 882, offset_x: 0, offset_y: 0, solid: false },
    { id: 883, offset_x: 0, offset_y: 0, solid: false },
    { id: 890, offset_x: 0, offset_y: 0, solid: false },
    { id: 1247, offset_x: 0, offset_y: 0, solid: false },
    { id: 1279, offset_x: 0, offset_y: 0, solid: false },
    { id: 1280, offset_x: 0, offset_y: 0, solid: false },
    { id: 1281, offset_x: 0, offset_y: 0, solid: false },
    { id: 1277, offset_x: 0, offset_y: 0, solid: false },
    { id: 1278, offset_x: 0, offset_y: 0, solid: false },
    { id: 693, offset_x: 0, offset_y: 0, solid: false },
    { id: 694, offset_x: 15, offset_y: 0, solid: false },
    { id: 695, offset_x: 0, offset_y: 0, solid: false },
    { id: 696, offset_x: 15, offset_y: 0, solid: false },
    { id: 697, offset_x: 0, offset_y: 0, solid: false },
    { id: 698, offset_x: 15, offset_y: 0, solid: false },
    { id: 699, offset_x: 0, offset_y: 0, solid: false },
    { id: 700, offset_x: 15, offset_y: 0, solid: false },
    { id: 701, offset_x: 0, offset_y: 0, solid: false },
    { id: 702, offset_x: 15, offset_y: 0, solid: false },
    { id: 877, offset_x: 0, offset_y: 0, solid: false },
    { id: 878, offset_x: 15, offset_y: 0, solid: false },
    { id: 888, offset_x: 0, offset_y: 0, solid: false },
    { id: 889, offset_x: 15, offset_y: 0, solid: false },
    { id: 895, offset_x: 0, offset_y: 0, solid: false },
    { id: 896, offset_x: 15, offset_y: 0, solid: false },
    { id: 35, offset_x: 0, offset_y: -13, solid: false },
    { id: 140, offset_x: 0, offset_y: -13, solid: false },
    { id: 1332, offset_x: 0, offset_y: -12.5, solid: false },
    { id: 67, offset_x: 0, offset_y: -12, solid: false },
    { id: 36, offset_x: 0, offset_y: 0, solid: false },
    { id: 141, offset_x: 0, offset_y: 0, solid: false },
    { id: 1333, offset_x: 0, offset_y: 0, solid: false },
    { id: 84, offset_x: 0, offset_y: 0, solid: false },
    { id: 1022, offset_x: 0, offset_y: 0, solid: false },
    { id: 1330, offset_x: 0, offset_y: 0, solid: false },
    { id: 1704, offset_x: 0, offset_y: 0, solid: false },
    { id: 1751, offset_x: 0, offset_y: 0, solid: false },
    { id: 10, offset_x: 0, offset_y: 0, solid: false },
    { id: 11, offset_x: 0, offset_y: 0, solid: false },
    { id: 12, offset_x: 0, offset_y: 0, solid: false },
    { id: 13, offset_x: 0, offset_y: 0, solid: false },
    { id: 47, offset_x: 0, offset_y: 0, solid: false },
    { id: 111, offset_x: 0, offset_y: 0, solid: false },
    { id: 660, offset_x: 0, offset_y: 0, solid: false },
    { id: 745, offset_x: 0, offset_y: 0, solid: false },
    { id: 1331, offset_x: 0, offset_y: 0, solid: false },
    { id: 45, offset_x: 0, offset_y: 0, solid: false },
    { id: 46, offset_x: 0, offset_y: 0, solid: false },
    { id: 99, offset_x: 0, offset_y: 0, solid: false },
    { id: 101, offset_x: 0, offset_y: 0, solid: false },
    { id: 1755, offset_x: 0, offset_y: 0, solid: false },
    { id: 1813, offset_x: 0, offset_y: 0, solid: false },
    { id: 1829, offset_x: 0, offset_y: 0, solid: false },
    { id: 1859, offset_x: 0, offset_y: 0, solid: false },
    { id: 1586, offset_x: 0, offset_y: 0, solid: false },
    { id: 1700, offset_x: 0, offset_y: 0, solid: false },
    { id: 503, offset_x: 0, offset_y: -5, solid: false },
    { id: 505, offset_x: 0, offset_y: 0, solid: false },
    { id: 504, offset_x: 5, offset_y: -5, solid: false },
    { id: 1273, offset_x: 5, offset_y: -5, solid: false },
    { id: 1274, offset_x: 5, offset_y: -5, solid: false },
    { id: 1758, offset_x: -7.25, offset_y: 7, solid: false },
    { id: 1759, offset_x: 10.5, offset_y: 9, solid: false },
    { id: 1888, offset_x: 0, offset_y: 0, solid: false },
    { id: 1734, offset_x: 0, offset_y: 0, solid: false },
    { id: 1735, offset_x: 0, offset_y: 0, solid: false },
    { id: 1736, offset_x: 0, offset_y: 0, solid: false },
    { id: 186, offset_x: 0, offset_y: 0, solid: false },
    { id: 187, offset_x: 0, offset_y: 0, solid: false },
    { id: 188, offset_x: 0, offset_y: 0, solid: false },
    { id: 1705, offset_x: 0, offset_y: 0, solid: false },
    { id: 1706, offset_x: 0, offset_y: 0, solid: false },
    { id: 1707, offset_x: 0, offset_y: 0, solid: false },
    { id: 1708, offset_x: 0, offset_y: 0, solid: false },
    { id: 1709, offset_x: 0, offset_y: 0, solid: false },
    { id: 1710, offset_x: 0, offset_y: 0, solid: false },
    { id: 678, offset_x: 0, offset_y: 0, solid: false },
    { id: 679, offset_x: 0, offset_y: 0, solid: false },
    { id: 680, offset_x: 0, offset_y: 0, solid: false },
    { id: 1619, offset_x: 0, offset_y: 0, solid: false },
    { id: 1620, offset_x: 0, offset_y: 0, solid: false },
    { id: 183, offset_x: 0, offset_y: 0, solid: false },
    { id: 184, offset_x: 0, offset_y: 0, solid: false },
    { id: 185, offset_x: 0, offset_y: 0, solid: false },
    { id: 85, offset_x: 0, offset_y: 0, solid: false },
    { id: 86, offset_x: 0, offset_y: 0, solid: false },
    { id: 87, offset_x: 0, offset_y: 0, solid: false },
    { id: 97, offset_x: 0, offset_y: 0, solid: false },
    { id: 137, offset_x: 0, offset_y: 0, solid: false },
    { id: 138, offset_x: 0, offset_y: 0, solid: false },
    { id: 139, offset_x: 0, offset_y: 0, solid: false },
    { id: 1019, offset_x: 0, offset_y: 0, solid: false },
    { id: 1020, offset_x: 0, offset_y: 0, solid: false },
    { id: 1021, offset_x: 0, offset_y: 0, solid: false },
    { id: 394, offset_x: 0, offset_y: 0, solid: false },
    { id: 395, offset_x: 0, offset_y: 0, solid: false },
    { id: 396, offset_x: 0, offset_y: 0, solid: false },
    { id: 154, offset_x: 0, offset_y: 0, solid: false },
    { id: 155, offset_x: 0, offset_y: 0, solid: false },
    { id: 156, offset_x: 0, offset_y: 0, solid: false },
    { id: 222, offset_x: 0, offset_y: 0, solid: false },
    { id: 223, offset_x: 0, offset_y: 0, solid: false },
    { id: 224, offset_x: 0, offset_y: 0, solid: false },
    { id: 1831, offset_x: 0, offset_y: 0, solid: false },
    { id: 1832, offset_x: 0, offset_y: 0, solid: false },
    { id: 1833, offset_x: 0, offset_y: 0, solid: false },
    { id: 1834, offset_x: 0, offset_y: 0, solid: false },
    { id: 48, offset_x: 0, offset_y: 2, solid: false },
    { id: 49, offset_x: 0, offset_y: -2, solid: false },
    { id: 113, offset_x: 0, offset_y: 1, solid: false },
    { id: 114, offset_x: 0, offset_y: -2, solid: false },
    { id: 115, offset_x: 0, offset_y: -5, solid: false },
    { id: 18, offset_x: 0, offset_y: 4, solid: false },
    { id: 19, offset_x: 0, offset_y: 4, solid: false },
    { id: 20, offset_x: 0, offset_y: -2, solid: false },
    { id: 21, offset_x: 0, offset_y: -8, solid: false },
    { id: 157, offset_x: 0, offset_y: -1.5, solid: false },
    { id: 158, offset_x: 0, offset_y: -1.5, solid: false },
    { id: 159, offset_x: 0, offset_y: -1.5, solid: false },
    { id: 227, offset_x: 0, offset_y: -4, solid: false },
    { id: 228, offset_x: -7.5, offset_y: -7.5, solid: false },
    { id: 242, offset_x: 0, offset_y: 0, solid: false },
    { id: 419, offset_x: 0, offset_y: -2.5, solid: false },
    { id: 420, offset_x: 0, offset_y: -2.5, solid: false },
    { id: 719, offset_x: 0, offset_y: -7.5, solid: false },
    { id: 721, offset_x: -11.5, offset_y: -11.5, solid: false },
    { id: 918, offset_x: 0, offset_y: 0, solid: false },
    { id: 1584, offset_x: 0, offset_y: 0, solid: false },
    { id: 919, offset_x: 0, offset_y: -10, solid: false },
    { id: 409, offset_x: 0, offset_y: 0, solid: false },
    { id: 410, offset_x: 0, offset_y: 0, solid: false },
    { id: 411, offset_x: 0, offset_y: 0, solid: false },
    { id: 412, offset_x: 0, offset_y: 0, solid: false },
    { id: 413, offset_x: 0, offset_y: 0, solid: false },
    { id: 1756, offset_x: 0, offset_y: 0, solid: false },
    { id: 1001, offset_x: 0, offset_y: 0, solid: false },
    { id: 1002, offset_x: 0, offset_y: 0, solid: false },
    { id: 1003, offset_x: 0, offset_y: 0, solid: false },
    { id: 1004, offset_x: 0, offset_y: 0, solid: false },
    { id: 1005, offset_x: 0, offset_y: 0, solid: false },
    { id: 916, offset_x: -7.5, offset_y: -7.5, solid: false },
    { id: 917, offset_x: -11.25, offset_y: -11.25, solid: false },
    { id: 1740, offset_x: 0, offset_y: 0, solid: false },
    { id: 1741, offset_x: 0, offset_y: 0, solid: false },
    { id: 1697, offset_x: 0, offset_y: 0, solid: false },
    { id: 1698, offset_x: 0, offset_y: 0, solid: false },
    { id: 1699, offset_x: 0, offset_y: 0, solid: false },
    { id: 1053, offset_x: -7.5, offset_y: -7.5, solid: false },
    { id: 1054, offset_x: 0, offset_y: -7.5, solid: false },
    { id: 1583, offset_x: 0, offset_y: 0, solid: false },
    { id: 1582, offset_x: 0, offset_y: 0, solid: false },
    { id: 937, offset_x: 0, offset_y: 0, solid: false },
    { id: 938, offset_x: 0, offset_y: 0, solid: false },
    { id: 414, offset_x: 0, offset_y: -9, solid: false },
    { id: 406, offset_x: 0, offset_y: -8, solid: false },
    { id: 408, offset_x: 0, offset_y: -12.5, solid: false },
    { id: 907, offset_x: 0, offset_y: -4.5, solid: false },
    { id: 908, offset_x: 0, offset_y: -7.5, solid: false },
    { id: 909, offset_x: 0, offset_y: -7.5, solid: false },
    { id: 939, offset_x: 0, offset_y: -6, solid: false },
    { id: 1597, offset_x: 0, offset_y: 0, solid: false },
    { id: 1596, offset_x: 0, offset_y: 0, solid: false },
    { id: 1135, offset_x: 0, offset_y: 0, solid: false },
    { id: 1136, offset_x: 0, offset_y: 0, solid: false },
    { id: 1137, offset_x: 0, offset_y: 0, solid: false },
    { id: 1134, offset_x: 0, offset_y: 0, solid: false },
    { id: 1133, offset_x: 0, offset_y: 0, solid: false },
    { id: 1844, offset_x: 0, offset_y: 0, solid: false },
    { id: 1846, offset_x: 0, offset_y: 0, solid: false },
    { id: 1602, offset_x: 0, offset_y: 0, solid: false },
    { id: 1603, offset_x: 0, offset_y: 0, solid: false },
    { id: 1604, offset_x: 0, offset_y: 0, solid: false },
    { id: 1605, offset_x: 0, offset_y: 0, solid: false },
    { id: 1606, offset_x: 0, offset_y: 0, solid: false },
    { id: 1607, offset_x: 0, offset_y: 0, solid: false },
    { id: 1601, offset_x: 0, offset_y: 0, solid: false },
    { id: 1600, offset_x: 0, offset_y: 0, solid: false },
    { id: 1843, offset_x: 0, offset_y: 0, solid: false },
    { id: 1519, offset_x: 0, offset_y: 0, solid: false },
    { id: 1618, offset_x: 0, offset_y: 0, solid: false },
    { id: 1837, offset_x: 0, offset_y: 0, solid: false },
    { id: 1835, offset_x: 0, offset_y: 0, solid: false },
    { id: 1753, offset_x: 0, offset_y: 0, solid: false },
    { id: 1754, offset_x: 0, offset_y: 0, solid: false },
    { id: 1757, offset_x: -7.5, offset_y: 0, solid: false },
    { id: 1830, offset_x: 0, offset_y: 0, solid: false },
    { id: 1764, offset_x: 0, offset_y: 0, solid: false },
    { id: 1765, offset_x: 0, offset_y: 0, solid: false },
    { id: 1766, offset_x: 0, offset_y: 0, solid: false },
    { id: 1767, offset_x: 0, offset_y: 0, solid: false },
    { id: 1768, offset_x: 0, offset_y: 0, solid: false },
    { id: 15, offset_x: 0, offset_y: 6, solid: false },
    { id: 16, offset_x: 0, offset_y: -1, solid: false },
    { id: 17, offset_x: 0, offset_y: -8, solid: false },
    { id: 132, offset_x: 0, offset_y: 0, solid: false },
    { id: 460, offset_x: 0, offset_y: 0, solid: false },
    { id: 494, offset_x: 0, offset_y: 0, solid: false },
    { id: 50, offset_x: 0, offset_y: 0, solid: false },
    { id: 51, offset_x: 0, offset_y: 0, solid: false },
    { id: 52, offset_x: 0, offset_y: 0, solid: false },
    { id: 53, offset_x: 0, offset_y: 0, solid: false },
    { id: 54, offset_x: 0, offset_y: 0, solid: false },
    { id: 60, offset_x: 0, offset_y: 0, solid: false },
]

let idMapping = {}
for (let i in OBJECT_SETTINGS) {
    idMapping[OBJECT_SETTINGS[i].id] = i
}

export const getObjSettings = (id: number) => OBJECT_SETTINGS[idMapping[id]]
