
// window.addEventListener('DOMContentLoaded', (event) => {

let count = 0

let randpoint = 0

let start = 0
let stepover = 0
let m = -1000000
let started = 0
let globalx = 0
let out = 0
let filein = 39
const squaretable = {} // this section of code is an optimization for use of the hypotenuse function on Line and LineOP objects
for (let t = 0; t < 10000000; t++) {
    squaretable[`${t}`] = Math.sqrt(t)
    if (t > 999) {
        t += 9
    }
}
let video_recorder
let recording = 0
function CanvasCaptureToWEBM(canvas, bitrate) {
    // the video_recorder is set to  '= new CanvasCaptureToWEBM(canvas, 4500000);' in the setup, 
    // it uses the same canvas as the rest of the file.
    // to start a recording call .record() on video_recorder
    /*
    for example, 
    if(keysPressed['-'] && recording == 0){
        recording = 1
        video_recorder.record()
    }
    if(keysPressed['='] && recording == 1){
        recording = 0
        video_recorder.stop()
        video_recorder.download('File Name As A String.webm')
    }
    */
    this.record = Record
    this.stop = Stop
    this.download = saveToDownloads
    let blobCaptures = []
    let outputFormat = {}
    let recorder = {}
    let canvasInput = canvas.captureStream()
    if (typeof canvasInput == undefined || !canvasInput) {
        return
    }
    const video = document.createElement('video')
    video.style.display = 'none'

    function Record() {
        let formats = [
            'video/vp8',
            "video/webm",
            'video/webm,codecs=vp9',
            "video/webm\;codecs=vp8",
            "video/webm\;codecs=daala",
            "video/mpeg"
        ];

        for (let t = 0; t < formats.length; t++) {
            if (MediaRecorder.isTypeSupported(formats[t])) {
                outputFormat = formats[t]
                break
            }
        }
        if (typeof outputFormat != "string") {
            return
        } else {
            let videoSettings = {
                mimeType: outputFormat,
                videoBitsPerSecond: bitrate || 2000000 // 2Mbps
            };
            blobCaptures = []
            try {
                recorder = new MediaRecorder(canvasInput, videoSettings)
            } catch (error) {
                return;
            }
            recorder.onstop = handleStop
            recorder.ondataavailable = handleAvailableData
            recorder.start(100)
        }
    }
    function handleAvailableData(event) {
        if (event.data && event.data.size > 0) {
            blobCaptures.push(event.data)
        }
    }
    function handleStop() {
        const superBuffer = new Blob(blobCaptures, { type: outputFormat })
        video.src = window.URL.createObjectURL(superBuffer)
    }
    function Stop() {
        recorder.stop()
        video.controls = true
    }
    function saveToDownloads(input) { // specifying a file name for the output
        const name = input || 'video_out.webm'
        const blob = new Blob(blobCaptures, { type: outputFormat })
        const url = window.URL.createObjectURL(blob)
        const storageElement = document.createElement('a')
        storageElement.style.display = 'none'
        storageElement.href = url
        storageElement.download = name
        document.body.appendChild(storageElement)
        storageElement.click()
        setTimeout(() => {
            document.body.removeChild(storageElement)
            window.URL.revokeObjectURL(url)
        }, 100)
    }
}
const gamepadAPI = {
    controller: {},
    turbo: true,
    connect: function (evt) {
        if (navigator.getGamepads()[0] != null) {
            gamepadAPI.controller = navigator.getGamepads()[0]
            gamepadAPI.turbo = true;
        } else if (navigator.getGamepads()[1] != null) {
            gamepadAPI.controller = navigator.getGamepads()[0]
            gamepadAPI.turbo = true;
        } else if (navigator.getGamepads()[2] != null) {
            gamepadAPI.controller = navigator.getGamepads()[0]
            gamepadAPI.turbo = true;
        } else if (navigator.getGamepads()[3] != null) {
            gamepadAPI.controller = navigator.getGamepads()[0]
            gamepadAPI.turbo = true;
        }
        for (let i = 0; i < gamepads.length; i++) {
            if (gamepads[i] === null) {
                continue;
            }
            if (!gamepads[i].connected) {
                continue;
            }
        }
    },
    disconnect: function (evt) {
        gamepadAPI.turbo = false;
        delete gamepadAPI.controller;
    },
    update: function () {
        gamepadAPI.controller = navigator.getGamepads()[0]
        gamepadAPI.buttonsCache = [];// clear the buttons cache
        for (var k = 0; k < gamepadAPI.buttonsStatus.length; k++) {// move the buttons status from the previous frame to the cache
            gamepadAPI.buttonsCache[k] = gamepadAPI.buttonsStatus[k];
        }
        gamepadAPI.buttonsStatus = [];// clear the buttons status
        var c = gamepadAPI.controller || {}; // get the gamepad object
        var pressed = [];
        if (c.buttons) {
            for (var b = 0, t = c.buttons.length; b < t; b++) {// loop through buttons and push the pressed ones to the array
                if (c.buttons[b].pressed) {
                    pressed.push(gamepadAPI.buttons[b]);
                }
            }
        }
        var axes = [];
        if (c.axes) {
            for (var a = 0, x = c.axes.length; a < x; a++) {// loop through axes and push their values to the array
                axes.push(c.axes[a].toFixed(2));
            }
        }
        gamepadAPI.axesStatus = axes;// assign received values
        gamepadAPI.buttonsStatus = pressed;
        // console.log(pressed); // return buttons for debugging purposes
        return pressed;
    },
    buttonPressed: function (button, hold) {
        var newPress = false;
        for (var i = 0, s = gamepadAPI.buttonsStatus.length; i < s; i++) {// loop through pressed buttons
            if (gamepadAPI.buttonsStatus[i] == button) {// if we found the button we're looking for...
                newPress = true;// set the boolean variable to true
                if (!hold) {// if we want to check the single press
                    for (var j = 0, p = gamepadAPI.buttonsCache.length; j < p; j++) {// loop through the cached states from the previous frame
                        if (gamepadAPI.buttonsCache[j] == button) { // if the button was already pressed, ignore new press
                            newPress = false;
                        }
                    }
                }
            }
        }
        return newPress;
    },
    buttons: [
        'A', 'B', 'X', 'Y', 'LB', 'RB', 'Left-Trigger', 'Right-Trigger', 'Back', 'Start', 'Axis-Left', 'Axis-Right', 'DPad-Up', 'DPad-Down', 'DPad-Left', 'DPad-Right', "Power"
    ],
    buttonsCache: [],
    buttonsStatus: [],
    axesStatus: []
};
let canvas
let canvas_context
let keysPressed = {}
let FLEX_engine
let TIP_engine = {}
let XS_engine
let YS_engine
class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
        this.radius = 0
    }
    pointDistance(point) {
        return (new LineOP(this, point, "transparent", 0)).hypotenuse()
    }
}

class Vector { // vector math and physics if you prefer this over vector components on circles
    constructor(object = (new Point(0, 0)), xmom = 0, ymom = 0) {
        this.xmom = xmom
        this.ymom = ymom
        this.object = object
    }
    isToward(point) {
        let link = new LineOP(this.object, point)
        let dis1 = link.squareDistance()
        let dummy = new Point(this.object.x + this.xmom, this.object.y + this.ymom)
        let link2 = new LineOP(dummy, point)
        let dis2 = link2.squareDistance()
        if (dis2 < dis1) {
            return true
        } else {
            return false
        }
    }
    rotate(angleGoal) {
        let link = new Line(this.xmom, this.ymom, 0, 0)
        let length = link.hypotenuse()
        let x = (length * Math.cos(angleGoal))
        let y = (length * Math.sin(angleGoal))
        this.xmom = x
        this.ymom = y
    }
    magnitude() {
        return (new Line(this.xmom, this.ymom, 0, 0)).hypotenuse()
    }
    normalize(size = 1) {
        let magnitude = this.magnitude()
        this.xmom /= magnitude
        this.ymom /= magnitude
        this.xmom *= size
        this.ymom *= size
    }
    multiply(vect) {
        let point = new Point(0, 0)
        let end = new Point(this.xmom + vect.xmom, this.ymom + vect.ymom)
        return point.pointDistance(end)
    }
    add(vect) {
        return new Vector(this.object, this.xmom + vect.xmom, this.ymom + vect.ymom)
    }
    subtract(vect) {
        return new Vector(this.object, this.xmom - vect.xmom, this.ymom - vect.ymom)
    }
    divide(vect) {
        return new Vector(this.object, this.xmom / vect.xmom, this.ymom / vect.ymom) //be careful with this, I don't think this is right
    }
    draw() {
        let dummy = new Point(this.object.x + this.xmom, this.object.y + this.ymom)
        let link = new LineOP(this.object, dummy, "#FFFFFF", 1)
        link.draw()
    }
}
class Line {
    constructor(x, y, x2, y2, color, width) {
        this.x1 = x
        this.y1 = y
        this.x2 = x2
        this.y2 = y2
        this.color = color
        this.width = width
    }
    angle() {
        return Math.atan2(this.y1 - this.y2, this.x1 - this.x2)
    }
    squareDistance() {
        let xdif = this.x1 - this.x2
        let ydif = this.y1 - this.y2
        let squareDistance = (xdif * xdif) + (ydif * ydif)
        return squareDistance
    }
    hypotenuse() {
        let xdif = this.x1 - this.x2
        let ydif = this.y1 - this.y2
        let hypotenuse = (xdif * xdif) + (ydif * ydif)
        if (hypotenuse < 10000000 - 1) {
            if (hypotenuse > 1000) {
                return squaretable[`${Math.round(10 * Math.round((hypotenuse * .1)))}`]
            } else {
                return squaretable[`${Math.round(hypotenuse)}`]
            }
        } else {
            return Math.sqrt(hypotenuse)
        }
    }
    draw() {
        let linewidthstorage = canvas_context.lineWidth
        canvas_context.strokeStyle = this.color
        canvas_context.lineWidth = this.width
        canvas_context.beginPath()
        canvas_context.moveTo(this.x1, this.y1)
        canvas_context.lineTo(this.x2, this.y2)
        canvas_context.stroke()
        canvas_context.lineWidth = linewidthstorage
    }
}
class LineOP {
    constructor(object, target, color, width) {
        this.object = object
        this.target = target
        this.color = color
        this.width = width
    }
    intersects(line) {
        // console.log(line)
        var det, gm, lm;
        det = (this.target.x - this.object.x) * (line.target.y - line.object.y) - (line.target.x - line.object.x) * (this.target.y - this.object.y);
        if (det === 0) {
            return false;
        } else {
            lm = ((line.target.y - line.object.y) * (line.target.x - this.object.x) + (line.object.x - line.target.x) * (line.target.y - this.object.y)) / det;
            gm = ((this.object.y - this.target.y) * (line.target.x - this.object.x) + (this.target.x - this.object.x) * (line.target.y - this.object.y)) / det;
            return (0 < lm && lm < 1) && (0 < gm && gm < 1);
        }
    }
    squareDistance() {
        let xdif = this.object.x - this.target.x
        let ydif = this.object.y - this.target.y
        let squareDistance = (xdif * xdif) + (ydif * ydif)
        return squareDistance
    }
    hypotenuse() {
        let xdif = this.object.x - this.target.x
        let ydif = this.object.y - this.target.y
        let hypotenuse = (xdif * xdif) + (ydif * ydif)

        return Math.sqrt(hypotenuse)
        if (hypotenuse < 10000000 - 1) {
            if (hypotenuse > 1000) {
                return squaretable[`${Math.round(10 * Math.round((hypotenuse * .1)))}`]
            } else {
                return squaretable[`${Math.round(hypotenuse)}`]
            }
        } else {
            return Math.sqrt(hypotenuse)
        }
    }
    angle() {
        return Math.atan2(this.object.y - this.target.y, this.object.x - this.target.x)
    }
    draw() {
        let linewidthstorage = canvas_context.lineWidth
        canvas_context.strokeStyle = this.color
        canvas_context.lineWidth = this.width
        canvas_context.beginPath()
        canvas_context.moveTo(this.object.x, this.object.y)
        canvas_context.lineTo(this.target.x, this.target.y)
        canvas_context.stroke()
        canvas_context.lineWidth = linewidthstorage
    }
}
class Rectangle {
    constructor(x, y, width, height, color, fill = 1, stroke = 0, strokeWidth = 1) {
        this.x = x
        this.y = y
        this.height = height
        this.width = width
        this.color = color
        this.xmom = 0
        this.ymom = 0
        this.stroke = stroke
        this.strokeWidth = strokeWidth
        this.fill = fill
    }
    draw() {
        canvas_context.fillStyle = this.color
        canvas_context.fillRect(this.x, this.y, this.width, this.height)
    }
    move() {
        this.x += this.xmom
        this.y += this.ymom
    }
    isPointInside(point) {
        if (point.x >= this.x) {
            if (point.y >= this.y) {
                if (point.x <= this.x + this.width) {
                    if (point.y <= this.y + this.height) {
                        return true
                    }
                }
            }
        }
        return false
    }
    doesPerimeterTouch(point) {
        if (point.x + point.radius >= this.x) {
            if (point.y + point.radius >= this.y) {
                if (point.x - point.radius <= this.x + this.width) {
                    if (point.y - point.radius <= this.y + this.height) {
                        return true
                    }
                }
            }
        }
        return false
    }
}
class Circle {
    constructor(x, y, radius, color, xmom = 0, ymom = 0, friction = 1, reflect = 0, strokeWidth = 0, strokeColor = "transparent") {
        this.x = x
        this.y = y
        this.radius = radius
        this.color = color
        this.xmom = xmom
        this.ymom = ymom
        this.friction = friction
        this.reflect = reflect
        this.strokeWidth = strokeWidth
        this.strokeColor = strokeColor
    }
    draw() {
        canvas_context.lineWidth = this.strokeWidth
        canvas_context.strokeStyle = this.color
        canvas_context.beginPath();
        if (this.radius > 0) {
            canvas_context.arc(this.x, this.y, this.radius, 0, (Math.PI * 2), true)
            canvas_context.fillStyle = this.color
            canvas_context.fill()
            canvas_context.stroke();
        } else {
            // console.log("The circle is below a radius of 0, and has not been drawn. The circle is:", this)
        }
    }
    move() {
        if (this.reflect == 1) {
            if (this.x + this.radius > canvas.width) {
                if (this.xmom > 0) {
                    this.xmom *= -1
                }
            }
            if (this.y + this.radius > canvas.height) {
                if (this.ymom > 0) {
                    this.ymom *= -1
                }
            }
            if (this.x - this.radius < 0) {
                if (this.xmom < 0) {
                    this.xmom *= -1
                }
            }
            if (this.y - this.radius < 0) {
                if (this.ymom < 0) {
                    this.ymom *= -1
                }
            }
        }
        this.x += this.xmom
        this.y += this.ymom
    }
    unmove() {
        if (this.reflect == 1) {
            if (this.x + this.radius > canvas.width) {
                if (this.xmom > 0) {
                    this.xmom *= -1
                }
            }
            if (this.y + this.radius > canvas.height) {
                if (this.ymom > 0) {
                    this.ymom *= -1
                }
            }
            if (this.x - this.radius < 0) {
                if (this.xmom < 0) {
                    this.xmom *= -1
                }
            }
            if (this.y - this.radius < 0) {
                if (this.ymom < 0) {
                    this.ymom *= -1
                }
            }
        }
        this.x -= this.xmom
        this.y -= this.ymom
    }
    frictiveMove() {
        if (this.reflect == 1) {
            if (this.x + this.radius > canvas.width) {
                if (this.xmom > 0) {
                    this.xmom *= -1
                }
            }
            if (this.y + this.radius > canvas.height) {
                if (this.ymom > 0) {
                    this.ymom *= -1
                }
            }
            if (this.x - this.radius < 0) {
                if (this.xmom < 0) {
                    this.xmom *= -1
                }
            }
            if (this.y - this.radius < 0) {
                if (this.ymom < 0) {
                    this.ymom *= -1
                }
            }
        }
        this.x += this.xmom
        this.y += this.ymom
        this.xmom *= this.friction
        this.ymom *= this.friction
    }
    frictiveunMove() {
        if (this.reflect == 1) {
            if (this.x + this.radius > canvas.width) {
                if (this.xmom > 0) {
                    this.xmom *= -1
                }
            }
            if (this.y + this.radius > canvas.height) {
                if (this.ymom > 0) {
                    this.ymom *= -1
                }
            }
            if (this.x - this.radius < 0) {
                if (this.xmom < 0) {
                    this.xmom *= -1
                }
            }
            if (this.y - this.radius < 0) {
                if (this.ymom < 0) {
                    this.ymom *= -1
                }
            }
        }
        this.xmom /= this.friction
        this.ymom /= this.friction
        this.x -= this.xmom
        this.y -= this.ymom
    }
    isPointInside(point) {
        this.areaY = point.y - this.y
        this.areaX = point.x - this.x
        if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= (this.radius * this.radius)) {
            return true
        }
        return false
    }
    doesPerimeterTouch(point) {
        this.areaY = point.y - this.y
        this.areaX = point.x - this.x
        if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= ((this.radius + point.radius) * (this.radius + point.radius))) {
            return true
        }
        return false
    }
}
class Polygon {
    constructor(x, y, size, color, sides = 3, xmom = 0, ymom = 0, angle = 0, reflect = 0) {
        if (sides < 2) {
            sides = 2
        }
        this.reflect = reflect
        this.xmom = xmom
        this.ymom = ymom
        this.body = new Circle(x, y, size - (size * .293), "transparent")
        this.nodes = []
        this.angle = angle
        this.size = size
        this.color = color
        this.angleIncrement = (Math.PI * 2) / sides
        this.sides = sides
        for (let t = 0; t < sides; t++) {
            let node = new Circle(this.body.x + (this.size * (Math.cos(this.angle))), this.body.y + (this.size * (Math.sin(this.angle))), 0, "transparent")
            this.nodes.push(node)
            this.angle += this.angleIncrement
        }
    }
    isPointInside(point) { // rough approximation
        this.body.radius = this.size - (this.size * .293)
        if (this.sides <= 2) {
            return false
        }
        this.areaY = point.y - this.body.y
        this.areaX = point.x - this.body.x
        if (((this.areaX * this.areaX) + (this.areaY * this.areaY)) <= (this.body.radius * this.body.radius)) {
            return true
        }
        return false
    }
    move() {
        if (this.reflect == 1) {
            if (this.body.x > canvas.width) {
                if (this.xmom > 0) {
                    this.xmom *= -1
                }
            }
            if (this.body.y > canvas.height) {
                if (this.ymom > 0) {
                    this.ymom *= -1
                }
            }
            if (this.body.x < 0) {
                if (this.xmom < 0) {
                    this.xmom *= -1
                }
            }
            if (this.body.y < 0) {
                if (this.ymom < 0) {
                    this.ymom *= -1
                }
            }
        }
        this.body.x += this.xmom
        this.body.y += this.ymom
    }
    draw() {
        this.nodes = []
        this.angleIncrement = (Math.PI * 2) / this.sides
        this.body.radius = this.size - (this.size * .293)
        for (let t = 0; t < this.sides; t++) {
            let node = new Circle(this.body.x + (this.size * (Math.cos(this.angle))), this.body.y + (this.size * (Math.sin(this.angle))), 0, "transparent")
            this.nodes.push(node)
            this.angle += this.angleIncrement
        }
        canvas_context.strokeStyle = this.color
        canvas_context.fillStyle = this.color
        canvas_context.lineWidth = 0
        canvas_context.beginPath()
        canvas_context.moveTo(this.nodes[0].x, this.nodes[0].y)
        for (let t = 1; t < this.nodes.length; t++) {
            canvas_context.lineTo(this.nodes[t].x, this.nodes[t].y)
        }
        canvas_context.lineTo(this.nodes[0].x, this.nodes[0].y)
        canvas_context.fill()
        canvas_context.stroke()
        canvas_context.closePath()
    }
}
class Shape {
    constructor(shapes) {
        this.shapes = shapes
    }
    draw() {
        for (let t = 0; t < this.shapes.length; t++) {
            this.shapes[t].draw()
        }
    }
    move() {
        if (typeof this.xmom != "number") {
            this.xmom = 0
        }
        if (typeof this.ymom != "number") {
            this.ymom = 0
        }
        for (let t = 0; t < this.shapes.length; t++) {
            this.shapes[t].x += this.xmom
            this.shapes[t].y += this.ymom
            this.shapes[t].draw()
        }
    }
    isPointInside(point) {
        for (let t = 0; t < this.shapes.length; t++) {
            if (this.shapes[t].isPointInside(point)) {
                return true
            }
        }
        return false
    }
    doesPerimeterTouch(point) {
        for (let t = 0; t < this.shapes.length; t++) {
            if (this.shapes[t].doesPerimeterTouch(point)) {
                return true
            }
        }
        return false
    }
    innerShape(point) {
        for (let t = 0; t < this.shapes.length; t++) {
            if (this.shapes[t].doesPerimeterTouch(point)) {
                return this.shapes[t]
            }
        }
        return false
    }
    isInsideOf(box) {
        for (let t = 0; t < this.shapes.length; t++) {
            if (box.isPointInside(this.shapes[t])) {
                return true
            }
        }
        return false
    }
    adjustByFromDisplacement(x, y) {
        for (let t = 0; t < this.shapes.length; t++) {
            if (typeof this.shapes[t].fromRatio == "number") {
                this.shapes[t].x += x * this.shapes[t].fromRatio
                this.shapes[t].y += y * this.shapes[t].fromRatio
            }
        }
    }
    adjustByToDisplacement(x, y) {
        for (let t = 0; t < this.shapes.length; t++) {
            if (typeof this.shapes[t].toRatio == "number") {
                this.shapes[t].x += x * this.shapes[t].toRatio
                this.shapes[t].y += y * this.shapes[t].toRatio
            }
        }
    }
    mixIn(arr) {
        for (let t = 0; t < arr.length; t++) {
            for (let k = 0; k < arr[t].shapes.length; k++) {
                this.shapes.push(arr[t].shapes[k])
            }
        }
    }
    push(object) {
        this.shapes.push(object)
    }
}

class Spring {
    constructor(x, y, radius, color, body = 0, length = 1, gravity = 0, width = 1) {
        if (body == 0) {
            this.body = new Circle(x, y, radius, color)
            this.anchor = new Circle(x, y, radius, color)
            this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", width)
            this.length = length
        } else {
            this.body = body
            this.anchor = new Circle(x, y, radius, color)
            this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", width)
            this.length = length
        }
        this.gravity = gravity
        this.width = width
    }
    balance() {
        this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", this.width)
        if (this.beam.hypotenuse() < this.length) {
            this.body.xmom += (this.body.x - this.anchor.x) / this.length
            this.body.ymom += (this.body.y - this.anchor.y) / this.length
            this.anchor.xmom -= (this.body.x - this.anchor.x) / this.length
            this.anchor.ymom -= (this.body.y - this.anchor.y) / this.length
        } else {
            this.body.xmom -= (this.body.x - this.anchor.x) / this.length
            this.body.ymom -= (this.body.y - this.anchor.y) / this.length
            this.anchor.xmom += (this.body.x - this.anchor.x) / this.length
            this.anchor.ymom += (this.body.y - this.anchor.y) / this.length
        }
        let xmomentumaverage = (this.body.xmom + this.anchor.xmom) / 2
        let ymomentumaverage = (this.body.ymom + this.anchor.ymom) / 2
        this.body.xmom = (this.body.xmom + xmomentumaverage) / 2
        this.body.ymom = (this.body.ymom + ymomentumaverage) / 2
        this.anchor.xmom = (this.anchor.xmom + xmomentumaverage) / 2
        this.anchor.ymom = (this.anchor.ymom + ymomentumaverage) / 2
    }
    draw() {
        this.beam = new Line(this.body.x, this.body.y, this.anchor.x, this.anchor.y, "yellow", this.width)
        this.beam.draw()
        this.body.draw()
        this.anchor.draw()
    }
    move() {
        this.anchor.ymom += this.gravity
        this.anchor.move()
    }

}
class SpringOP {
    constructor(body, anchor, length, width = 3, color = body.color) {
        this.body = body
        this.anchor = anchor
        this.beam = new LineOP(body, anchor, color, width)
        this.length = length
    }
    balance() {
        if (this.beam.hypotenuse() < this.length) {
            this.body.xmom += ((this.body.x - this.anchor.x) / this.length)
            this.body.ymom += ((this.body.y - this.anchor.y) / this.length)
            this.anchor.xmom -= ((this.body.x - this.anchor.x) / this.length)
            this.anchor.ymom -= ((this.body.y - this.anchor.y) / this.length)
        } else if (this.beam.hypotenuse() > this.length) {
            this.body.xmom -= (this.body.x - this.anchor.x) / (this.length)
            this.body.ymom -= (this.body.y - this.anchor.y) / (this.length)
            this.anchor.xmom += (this.body.x - this.anchor.x) / (this.length)
            this.anchor.ymom += (this.body.y - this.anchor.y) / (this.length)
        }

        let xmomentumaverage = (this.body.xmom + this.anchor.xmom) / 2
        let ymomentumaverage = (this.body.ymom + this.anchor.ymom) / 2
        this.body.xmom = (this.body.xmom + xmomentumaverage) / 2
        this.body.ymom = (this.body.ymom + ymomentumaverage) / 2
        this.anchor.xmom = (this.anchor.xmom + xmomentumaverage) / 2
        this.anchor.ymom = (this.anchor.ymom + ymomentumaverage) / 2
    }
    draw() {
        this.beam.draw()
    }
    move() {
        //movement of SpringOP objects should be handled separate from their linkage, to allow for many connections, balance here with this object, move nodes independently
    }
}

class Color {
    constructor(baseColor, red = -1, green = -1, blue = -1, alpha = 1) {
        this.hue = baseColor
        if (red != -1 && green != -1 && blue != -1) {
            this.r = red
            this.g = green
            this.b = blue
            if (alpha != 1) {
                if (alpha < 1) {
                    this.alpha = alpha
                } else {
                    this.alpha = alpha / 255
                    if (this.alpha > 1) {
                        this.alpha = 1
                    }
                }
            }
            if (this.r > 255) {
                this.r = 255
            }
            if (this.g > 255) {
                this.g = 255
            }
            if (this.b > 255) {
                this.b = 255
            }
            if (this.r < 0) {
                this.r = 0
            }
            if (this.g < 0) {
                this.g = 0
            }
            if (this.b < 0) {
                this.b = 0
            }
        } else {
            this.r = 0
            this.g = 0
            this.b = 0
        }
    }
    normalize() {
        if (this.r > 255) {
            this.r = 255
        }
        if (this.g > 255) {
            this.g = 255
        }
        if (this.b > 255) {
            this.b = 255
        }
        if (this.r < 0) {
            this.r = 0
        }
        if (this.g < 0) {
            this.g = 0
        }
        if (this.b < 0) {
            this.b = 0
        }
    }
    randomLight() {
        var letters = '0123456789ABCDEF';
        var hash = '#';
        for (var i = 0; i < 6; i++) {
            hash += letters[(Math.floor(Math.random() * 12) + 4)];
        }
        var color = new Color(hash, 55 + Math.random() * 200, 55 + Math.random() * 200, 55 + Math.random() * 200)
        return color;
    }
    randomDark() {
        var letters = '0123456789ABCDEF';
        var hash = '#';
        for (var i = 0; i < 6; i++) {
            hash += letters[(Math.floor(Math.random() * 12))];
        }
        var color = new Color(hash, Math.random() * 200, Math.random() * 200, Math.random() * 200)
        return color;
    }
    random() {
        var letters = '0123456789ABCDEF';
        var hash = '#';
        for (var i = 0; i < 6; i++) {
            hash += letters[(Math.floor(Math.random() * 16))];
        }
        var color = new Color(hash, Math.random() * 255, Math.random() * 255, Math.random() * 255)
        return color;
    }
}
class Softbody { //buggy, spins in place
    constructor(x, y, radius, color, members = 10, memberLength = 5, force = 10, gravity = 0) {
        this.springs = []
        this.pin = new Circle(x, y, radius, color)
        this.spring = new Spring(x, y, radius, color, this.pin, memberLength, gravity)
        this.springs.push(this.spring)
        for (let k = 0; k < members; k++) {
            this.spring = new Spring(x, y, radius, color, this.spring.anchor, memberLength, gravity)
            if (k < members - 1) {
                this.springs.push(this.spring)
            } else {
                this.spring.anchor = this.pin
                this.springs.push(this.spring)
            }
        }
        this.forceConstant = force
        this.centroid = new Point(0, 0)
    }
    circularize() {
        this.xpoint = 0
        this.ypoint = 0
        for (let s = 0; s < this.springs.length; s++) {
            this.xpoint += (this.springs[s].anchor.x / this.springs.length)
            this.ypoint += (this.springs[s].anchor.y / this.springs.length)
        }
        this.centroid.x = this.xpoint
        this.centroid.y = this.ypoint
        this.angle = 0
        this.angleIncrement = (Math.PI * 2) / this.springs.length
        for (let t = 0; t < this.springs.length; t++) {
            this.springs[t].body.x = this.centroid.x + (Math.cos(this.angle) * this.forceConstant)
            this.springs[t].body.y = this.centroid.y + (Math.sin(this.angle) * this.forceConstant)
            this.angle += this.angleIncrement
        }
    }
    balance() {
        for (let s = this.springs.length - 1; s >= 0; s--) {
            this.springs[s].balance()
        }
        this.xpoint = 0
        this.ypoint = 0
        for (let s = 0; s < this.springs.length; s++) {
            this.xpoint += (this.springs[s].anchor.x / this.springs.length)
            this.ypoint += (this.springs[s].anchor.y / this.springs.length)
        }
        this.centroid.x = this.xpoint
        this.centroid.y = this.ypoint
        for (let s = 0; s < this.springs.length; s++) {
            this.link = new Line(this.centroid.x, this.centroid.y, this.springs[s].anchor.x, this.springs[s].anchor.y, 0, "transparent")
            if (this.link.hypotenuse() != 0) {
                this.springs[s].anchor.xmom += (((this.springs[s].anchor.x - this.centroid.x) / (this.link.hypotenuse()))) * this.forceConstant
                this.springs[s].anchor.ymom += (((this.springs[s].anchor.y - this.centroid.y) / (this.link.hypotenuse()))) * this.forceConstant
            }
        }
        for (let s = 0; s < this.springs.length; s++) {
            this.springs[s].move()
        }
        for (let s = 0; s < this.springs.length; s++) {
            this.springs[s].draw()
        }
    }
}
class Observer {
    constructor(x, y, radius, color, range = 100, rays = 10, angle = (Math.PI * .125)) {
        this.body = new Circle(x, y, radius, color)
        this.color = color
        this.ray = []
        this.rayrange = range
        this.globalangle = Math.PI
        this.gapangle = angle
        this.currentangle = 0
        this.obstacles = []
        this.raymake = rays
    }
    beam() {
        this.currentangle = this.gapangle / 2
        for (let k = 0; k < this.raymake; k++) {
            this.currentangle += (this.gapangle / Math.ceil(this.raymake / 2))
            let ray = new Circle(this.body.x, this.body.y, 1, "white", (((Math.cos(this.globalangle + this.currentangle)))), (((Math.sin(this.globalangle + this.currentangle)))))
            ray.collided = 0
            ray.lifespan = this.rayrange - 1
            this.ray.push(ray)
        }
        for (let f = 0; f < this.rayrange; f++) {
            for (let t = 0; t < this.ray.length; t++) {
                if (this.ray[t].collided < 1) {
                    this.ray[t].move()
                    for (let q = 0; q < this.obstacles.length; q++) {
                        if (this.obstacles[q].isPointInside(this.ray[t])) {
                            this.ray[t].collided = 1
                        }
                    }
                }
            }
        }
    }
    draw() {
        this.beam()
        this.body.draw()
        canvas_context.lineWidth = 1
        canvas_context.fillStyle = this.color
        canvas_context.strokeStyle = this.color
        canvas_context.beginPath()
        canvas_context.moveTo(this.body.x, this.body.y)
        for (let y = 0; y < this.ray.length; y++) {
            canvas_context.lineTo(this.ray[y].x, this.ray[y].y)
            canvas_context.lineTo(this.body.x, this.body.y)
        }
        canvas_context.stroke()
        this.ray = []
    }
}
function setUp(canvas_pass, style = "#000000") {
    canvas = canvas_pass
    video_recorder = new CanvasCaptureToWEBM(canvas, 4500000);
    canvas_context = canvas.getContext('2d');
    canvas.style.background = style
    window.setInterval(function () {

        // canvas_context.clearRect(0, 0, canvas.width, canvas.height)
        if(keysPressed['r']){

            for(let t = 0;t<100;t++){

                main()
                
            }
        }else{
            main()

        }
    }, 0)
    document.addEventListener('keydown', (event) => {
        event.preventDefault()
        keysPressed[event.key] = true;
    });
    document.addEventListener('keyup', (event) => {
        event.preventDefault()
        delete keysPressed[event.key];
    });
    window.addEventListener('pointerdown', e => {
        FLEX_engine = canvas.getBoundingClientRect();
        XS_engine = e.clientX - FLEX_engine.left;
        YS_engine = e.clientY - FLEX_engine.top;
        TIP_engine.x = XS_engine
        TIP_engine.y = YS_engine
        TIP_engine.body = TIP_engine

        let circ = new PointCircle(TIP_engine.x, TIP_engine.y, 30)
        for (let t = 0; t < circs.length; t++) {
            circs[t].shiftBy(circ)
        }
        circs.push(circ)
        // example usage: if(object.isPointInside(TIP_engine)){ take action }
        window.addEventListener('pointermove', continued_stimuli);
    });
    window.addEventListener('pointerup', e => {
        window.removeEventListener("pointermove", continued_stimuli);
    })
    function continued_stimuli(e) {
        FLEX_engine = canvas.getBoundingClientRect();
        XS_engine = e.clientX - FLEX_engine.left;
        YS_engine = e.clientY - FLEX_engine.top;
        TIP_engine.x = XS_engine
        TIP_engine.y = YS_engine
        TIP_engine.body = TIP_engine
    }
}
function gamepad_control(object, speed = 1) { // basic control for objects using the controler
    //         console.log(gamepadAPI.axesStatus[1]*gamepadAPI.axesStatus[0]) //debugging
    if (typeof object.body != 'undefined') {
        if (typeof (gamepadAPI.axesStatus[1]) != 'undefined') {
            if (typeof (gamepadAPI.axesStatus[0]) != 'undefined') {
                object.body.x += (gamepadAPI.axesStatus[0] * speed)
                object.body.y += (gamepadAPI.axesStatus[1] * speed)
            }
        }
    } else if (typeof object != 'undefined') {
        if (typeof (gamepadAPI.axesStatus[1]) != 'undefined') {
            if (typeof (gamepadAPI.axesStatus[0]) != 'undefined') {
                object.x += (gamepadAPI.axesStatus[0] * speed)
                object.y += (gamepadAPI.axesStatus[1] * speed)
            }
        }
    }
}
function control(object, speed = 1) { // basic control for objects
    if (typeof object.body != 'undefined') {
        if (keysPressed['w']) {
            object.body.y -= speed
        }
        if (keysPressed['d']) {
            object.body.x += speed
        }
        if (keysPressed['s']) {
            object.body.y += speed
        }
        if (keysPressed['a']) {
            object.body.x -= speed
        }
    } else if (typeof object != 'undefined') {
        if (keysPressed['w']) {
            object.y -= speed
        }
        if (keysPressed['d']) {
            object.x += speed
        }
        if (keysPressed['s']) {
            object.y += speed
        }
        if (keysPressed['a']) {
            object.x -= speed
        }
    }
}
function getRandomLightColor() { // random color that will be visible on  black background
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[(Math.floor(Math.random() * 12) + 4)];
    }
    return color;
}
function getRandomColor() { // random color
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[(Math.floor(Math.random() * 16) + 0)];
    }
    return color;
}
function getRandomDarkColor() {// color that will be visible on a black background
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[(Math.floor(Math.random() * 12))];
    }
    return color;
}
function castBetween(from, to, granularity = 10, radius = 1) { //creates a sort of beam hitbox between two points, with a granularity (number of members over distance), with a radius defined as well
    let limit = granularity
    let shape_array = []
    for (let t = 0; t < limit; t++) {
        let circ = new Circle((from.x * (t / limit)) + (to.x * ((limit - t) / limit)), (from.y * (t / limit)) + (to.y * ((limit - t) / limit)), radius, "red")
        circ.toRatio = t / limit
        circ.fromRatio = (limit - t) / limit
        shape_array.push(circ)
    }
    return (new Shape(shape_array))
}

function castBetweenPoints(from, to, granularity = 10, radius = 1) { //creates a sort of beam hitbox between two points, with a granularity (number of members over distance), with a radius defined as well
    let limit = granularity
    let shape_array = []
    for (let t = 0; t < limit; t++) {
        let circ = new Circle((from.x * (t / limit)) + (to.x * ((limit - t) / limit)), (from.y * (t / limit)) + (to.y * ((limit - t) / limit)), radius, "red")
        circ.toRatio = t / limit
        circ.fromRatio = (limit - t) / limit
        shape_array.push(circ)
    }
    return shape_array
}

class Disang {
    constructor(dis, ang) {
        this.dis = dis
        this.angle = ang
    }
}

class BezierHitbox {
    constructor(x, y, cx, cy, ex, ey, color = "red") { // this function takes a starting x,y, a control point x,y, and a end point x,y
        this.color = color
        this.x = x
        this.y = y
        this.cx = cx
        this.cy = cy
        this.ex = ex
        this.ey = ey
        this.metapoint = new Circle((x + cx + ex) / 3, (y + cy + ey) / 3, 3, "#FFFFFF")
        this.granularity = 100
        this.body = [...castBetweenPoints((new Point(this.x, this.y)), (new Point(this.ex, this.ey)), this.granularity, 0)]

        let angle = (new Line(this.x, this.y, this.ex, this.ey)).angle()

        this.angles = []
        for (let t = 0; t < this.granularity; t++) {
            this.angles.push(angle)
        }
        for (let t = 0; t <= 1; t += 1 / this.granularity) {
            this.body.push(this.getQuadraticXY(t))
            this.angles.push(this.getQuadraticAngle(t))
        }
        this.hitbox = []
        for (let t = 0; t < this.body.length; t++) {
            let link = new LineOP(this.body[t], this.metapoint)
            let disang = new Disang(link.hypotenuse(), link.angle() + (Math.PI * 2))
            this.hitbox.push(disang)
        }
        this.constructed = 1
    }
    isPointInside(point) {
        let link = new LineOP(point, this.metapoint)
        let angle = (link.angle() + (Math.PI * 2))
        let dis = link.hypotenuse()
        for (let t = 1; t < this.hitbox.length; t++) {
            if (Math.abs(this.hitbox[t].angle - this.hitbox[t - 1].angle) > 1) {
                continue
            }
            if (angle.between(this.hitbox[t].angle, this.hitbox[t - 1].angle)) {
                if (dis < (this.hitbox[t].dis + this.hitbox[t - 1].dis) * .5) {
                    return true
                }
            }
        }
        return false
    }
    doesPerimeterTouch(point) {
        let link = new LineOP(point, this.metapoint)
        let angle = (link.angle() + (Math.PI * 2))
        let dis = link.hypotenuse()
        for (let t = 1; t < this.hitbox.length; t++) {
            if (Math.abs(this.hitbox[t].angle - this.hitbox[t - 1].angle) > 1) {
                continue
            }
            if (angle.between(this.hitbox[t].angle, this.hitbox[t - 1].angle)) {
                if (dis < ((this.hitbox[t].dis + this.hitbox[t - 1].dis) * .5) + point.radius) {
                    return this.angles[t]
                }
            }
        }
        return false
    }
    draw() {
        this.metapoint.draw()
        let tline = new Line(this.x, this.y, this.ex, this.ey, this.color, 3)
        tline.draw()
        canvas_context.beginPath()
        this.median = new Point((this.x + this.ex) * .5, (this.y + this.ey) * .5)
        let angle = (new LineOP(this.median, this.metapoint)).angle()
        let dis = (new LineOP(this.median, this.metapoint)).hypotenuse()
        canvas_context.bezierCurveTo(this.x, this.y, this.cx - (Math.cos(angle) * dis * .38), this.cy - (Math.sin(angle) * dis * .38), this.ex, this.ey)

        canvas_context.fillStyle = this.color
        canvas_context.strokeStyle = this.color
        canvas_context.lineWidth = 3
        canvas_context.stroke()
    }
    getQuadraticXY(t) {
        return new Point((((1 - t) * (1 - t)) * this.x) + (2 * (1 - t) * t * this.cx) + (t * t * this.ex), (((1 - t) * (1 - t)) * this.y) + (2 * (1 - t) * t * this.cy) + (t * t * this.ey))
    }
    getQuadraticAngle(t) {
        var dx = 2 * (1 - t) * (this.cx - this.x) + 2 * t * (this.ex - this.cx);
        var dy = 2 * (1 - t) * (this.cy - this.y) + 2 * t * (this.ey - this.cy);
        return -Math.atan2(dx, dy) + 0.5 * Math.PI;
    }
}
Number.prototype.between = function (a, b, inclusive) {
    var min = Math.min(a, b),
        max = Math.max(a, b);
    return inclusive ? this >= min && this <= max : this > min && this < max;
}


class Weight {
    constructor(from, to) {
        this.value = this.weight()
        this.from = from
        this.to = to
        this.change = 0
        this.delta = 1
    }
    valueOf() {
        return this.value
    }
    weight() {
        return ((Math.random() - .5) * 2) * .01 //.1
    }
    setChange(num) {
        this.change = num
    }
    setWeight(num) {
        this.value = num
    }
}
let relu = 0
class Perceptron {
    constructor(inputs) {
        this.bias = ((Math.random() - .5) * 2) * .01//.1
        this.value = this.bias
        this.weights = []
        this.outputConnections = []
        this.inputs = inputs
        this.error = 0
        this.delta = 1
        for (let t = 0; t < this.inputs.length; t++) {
            this.weights.push(this.weight(this.inputs[t]))
        }
        this.z = -1
        this.change = 0
    }
    setError(error) {
        this.error = error
    }
    setDelta(delta) {
        this.delta = delta
        for (let t = 0; t < this.outputConnections.length; t++) {
            this.outputConnections[t].delta = this.delta
        }
    }
    setBias(bias) {
        this.bias = bias
    }
    setChange(num) {
        this.change = num
    }
    weight(link) {
        let weight = new Weight(link, this)
        if (typeof link != "number") {
            link.outputConnections.push(weight) 
        }
        return weight
    }
    valueOf() {
        return this.value
    }
    compute(inputs = this.inputs) {
        this.inputs = inputs
        this.value = this.bias
        for (let t = 0; t < inputs.length; t++) {
            if (t > this.weights.length - 1) {
                this.weights.push(this.weight())
                this.value += (inputs[t].valueOf() * this.weights[t].valueOf())
            } else {
                this.value += (inputs[t].valueOf() * this.weights[t].valueOf())
            }
        }
        if(relu == 1){


            this.relu()
        }else{

            this.sig()
        }
        // this.gauss()
        return this.value
    }
    relu() {
        this.value = Math.min(Math.max(this.value, net.reluslime), 1)
    }
    // relu() {
    //     this.value = Math.max(0, this.value);
    // }
    sig() {
        this.value = 1 / (1 + (Math.pow(Math.E, -this.value)))
    }
    gauss() {
        this.value = Math.min(Math.max(Math.abs(this.value), 0.00000001), 1)

    }
}
class Network {   
    constructor(inputs, layerSetupArray) {
        this.reluslime = .00001
        this.momentum = .0005//.0025 worked for 21
        this.learningRate = .0005  //.0025 worked for 21
        this.setup = layerSetupArray
        this.inputs = inputs
        this.structure = []
        this.outputs = []
        for (let t = 0; t < layerSetupArray.length; t++) {
            let scaffold = []
            for (let k = 0; k < layerSetupArray[t]; k++) {
                let cept
                if (t == 0) {
                    cept = new Perceptron(this.inputs)
                } else {
                    cept = new Perceptron(this.structure[t - 1])
                }
                scaffold.push(cept)
            }
            this.structure.push(scaffold)
        }
        this.lastinputs = [...this.inputs]
        this.lastgoals = [...this.lastinputs]
        this.swap = []
    }

    becomeNetworkFrom(network) { //using a js file with one variable can be good for this
        // console.log(this.structure[0][0].bias)
        for (let t = 0; t < this.structure.length; t++) {
            // console.log("h1")
            for (let k = 0; k < this.structure[t].length; k++) {
                // console.log("h2")
                this.structure[t][k].bias = network.structure[t][k].bias //+((Math.random()-.5)/4)
                for (let w = 0; w < this.structure[t][k].weights.length; w++) {
                    // console.log("h3")
                    this.structure[t][k].weights[w].setWeight(network.structure[t][k][w].valueOf())// +((Math.random()-.5)/4))
                }
            }
        }
        // console.log(this.structure[0][0].bias)
    }
    log() {
        let json = {}
        json.structure = []
        json.setup = [...this.setup]
        for (let t = 0; t < this.structure.length; t++) {
            json.structure.push({})
            for (let k = 0; k < this.structure[t].length; k++) {
                json.structure[t][k] = {}
                json.structure[t][k].bias = this.structure[t][k].bias.valueOf()
                for (let w = 0; w < this.structure[t][k].weights.length; w++) {
                    json.structure[t][k][w] = (this.structure[t][k].weights[w].valueOf())
                }
            }
        }
        console.log(json)
        return json
    }
    calculateDeltasSigmoid(goals) {
        for (let t = this.structure.length - 1; t >= 0; t--) {
            const layer = this.structure[t]
            for (let k = 0; k < layer.length; k++) {
                const perceptron = layer[k]
                let output = perceptron.valueOf()
                let error = 0
                if (t === this.structure.length - 1) {
                    error = goals[k] - output;
                } else {
                    for (let r = 0; r < perceptron.outputConnections.length; r++) {
                        const currentConnection = perceptron.outputConnections[r]
                        //console.log(currentConnection)
                        error += currentConnection.to.delta * currentConnection.valueOf()
                    }
                }
                perceptron.setError(error)
                perceptron.setDelta(error * output * (1 - output))
            }
        }
    }
    calculateDeltasReLU(goals) {
        for (let t = this.structure.length - 1; t >= 0; t--) {
            const layer = this.structure[t];
            for (let k = 0; k < layer.length; k++) {
                const perceptron = layer[k];
                let output = perceptron.valueOf();
                let error = 0;
    
                if (t === this.structure.length - 1) {
                    // Output layer: Calculate the error as the difference from the goal
                    error = goals[k] - output;
                } else {
                    // Hidden layers: Propagate the error back
                    for (let j = 0; j < perceptron.outputConnections.length; j++) {
                        const currentConnection = perceptron.outputConnections[j];
                        error += currentConnection.to.delta * currentConnection.valueOf();
                    }
                }
                
                perceptron.setError(error);
    
                // ReLU derivative: 1 if output > 0, 0 if output <= 0
                const reluDerivative = output > 0 ? 1 : 0;
    
                // Calculate delta: error * derivative of ReLU
                perceptron.setDelta(error * reluDerivative);
            }
        }
    }
    
    
    adjustWeightsReLU() {
        for (let t = 0; t < this.structure.length; t++) {
            const layer = this.structure[t];
            for (let k = 0; k < layer.length; k++) {
                const perceptron = layer[k];
                let delta = perceptron.delta;

                for (let i = 0; i < perceptron.weights.length; i++) {
                    const connection = perceptron.weights[i];
                    let change = connection.change;

                    // Adjust the weight change based on learning rate, delta, and momentum
                    change = (this.learningRate * delta * perceptron.inputs[i].valueOf()) + (this.momentum * change);

                    connection.setChange(change);
                    connection.setWeight(connection.valueOf() + change);
                }

                // Adjust bias based on learning rate and delta
                perceptron.setBias(perceptron.bias + (this.learningRate * delta));
            }
        }
    }
    
    adjustWeights() {
        for (let t = 0; t < this.structure.length; t++) {
            const layer = this.structure[t]
            for (let k = 0; k < layer.length; k++) {
                const perceptron = layer[k]
                let delta = perceptron.delta
                for (let i = 0; i < perceptron.weights.length; i++) {
                    const connection = perceptron.weights[i]
                    let change = connection.change
                    change = (this.learningRate * delta * perceptron.inputs[i].valueOf()) + (this.momentum * change);
                    connection.setChange(change)
                    connection.setWeight(connection.valueOf() + change)
                }
                perceptron.setBias(perceptron.bias + (this.learningRate * delta))
            }
        }
    }
    clone(nw) {
        let input = nw.inputs
        let perc = new Network(input, nw.setup)
        for (let t = 0; t < nw.structure.length; t++) {
            for (let k = 0; k < nw.structure[t].length; k++) {
                perc.structure[t][k] = new Perceptron([0, 0, 0, 0, 0, 0, 0])
                for (let f = 0; f < nw.structure[t][k].weights.length; f++) {
                    perc.structure[t][k].weights[f] = nw.structure[t][k].weights[f]
                    perc.structure[t][k].bias = nw.structure[t][k].bias
                }
            }
        }
        return perc
    }
    compute(inputs = this.inputs) {
        this.inputs = [...inputs]
        for (let t = 0; t < this.structure.length; t++) {
            for (let k = 0; k < this.structure[t].length; k++) {
                if (t == 0) {
                    this.structure[t][k].compute(this.inputs)
                } else {
                    this.structure[t][k].compute(this.structure[t - 1])
                }
            }
        }
        this.outputs = []
        this.dataoutputs = []
        for (let t = 0; t < this.structure[this.structure.length - 1].length; t++) {
            this.outputs.push(this.structure[this.structure.length - 1][t].valueOf())
            this.dataoutputs.push(new Data(this.structure[this.structure.length - 1][t].valueOf()))
        }
    }
}
class Data {
    constructor(input = -100) {
        this.delta = 0
        this.outputConnections = []
        if (input == -100) {
            this.value = this.weight()
        } else {
            this.value = input
        }
    }
    valueOf() {
        return this.value
    }
    weight() {
        return Math.random() - .5
    }
}

class ReinforcementAgent {
    constructor(network, numActions) {
        this.network = network; 
        this.numActions = numActions;
        this.gamma = 0.01; 
        this.epsilon = 0.999; 
    }
    getStateFromDots(edot, pdot, canvas) {
        let inputs = [];
        let ex = edot.x / canvas.width;
        let ey = edot.y / canvas.height;
        let px = pdot.x / canvas.width;
        let py = pdot.y / canvas.height;
    
        inputs.push(new Data(ex));
        inputs.push(new Data(ey));
        inputs.push(new Data(px));
        inputs.push(new Data(py));
    
        let frequencies = [1, 2, 4];
        for (let f of frequencies) {
            inputs.push(new Data(Math.sin(f * Math.PI * ex)));
            inputs.push(new Data(Math.cos(f * Math.PI * ex)));
            inputs.push(new Data(Math.sin(f * Math.PI * ey)));
            inputs.push(new Data(Math.cos(f * Math.PI * ey)));
            inputs.push(new Data(Math.sin(f * Math.PI * px)));
            inputs.push(new Data(Math.cos(f * Math.PI * px)));
            inputs.push(new Data(Math.sin(f * Math.PI * py)));
            inputs.push(new Data(Math.cos(f * Math.PI * py)));
        }
    
        return inputs;
    }
    
    getStateFromCanvas(canvas) {
        let ctx = canvas.getContext("2d");
        let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        let pixels = imageData.data;
        let inputs = [];
        for (let i = 0; i < pixels.length; i += 4) { 
            inputs.push(new Data(pixels[i] / 255)); 
            inputs.push(new Data(pixels[i+1] / 255)); 
            // inputs.push(pixels[i+2] / 255); 
            // if(inputs[(i/4)].valueOf()> 0){
            //     console.log(inputs[(i/4)])
            // }
        }
        return inputs;
    }

    selectAction(state) {
        if (Math.random() < this.epsilon && !keysPressed['t']) {
            return Math.floor(Math.random() * this.numActions); 
        } else {
            this.network.compute(state);
            let outputs = this.network.outputs;
            return outputs.indexOf(Math.max(...outputs)); 
        }
    }

    train(state, action, reward, nextState) {
        this.network.compute(state);
        let targetOutputs = [...this.network.outputs];
        
        this.network.compute(nextState);

        let normalizedReward = (reward + 1) / 2; 

        let maxFutureReward = Math.max(...this.network.outputs);

        targetOutputs[action] = normalizedReward + this.gamma * maxFutureReward;

        if(keysPressed[' ']){
            console.log(targetOutputs, this.network.outputs)
        }else{
        if(relu == 1){
            this.network.calculateDeltasReLU(targetOutputs);
            this.network.adjustWeightsReLU();
        }else{
            this.network.calculateDeltasSigmoid(targetOutputs);
            this.network.adjustWeights();
        }
        }
    }
}


    
let setup_canvas = document.getElementById('canvas') //getting canvas from document

setUp(setup_canvas) // setting up canvas refrences, starting timer. 

// object instantiation and creation happens here 



let pointCircleMax = 120
class PointCircle {
    constructor(x, y, r) {
        this.x = x
        this.y = y
        this.radius = r
        this.nodes = []
        this.a = 0
        for (let t = 0; t < pointCircleMax; t++) {
            let circ = new Circle(this.x + (Math.cos(this.a) * this.radius), this.y + (Math.sin(this.a) * this.radius), 1, this.color)
            this.nodes.push(circ)
            this.a += (Math.PI * 2) / pointCircleMax
        }
        this.color = getRandomColor()
    }
    draw() {
        canvas_context.strokeStyle = this.color
        canvas_context.fillStyle = this.color
        canvas_context.lineWidth = 1
        canvas_context.beginPath()
        canvas_context.moveTo(this.nodes[0].x, this.nodes[0].y)
        for (let t = 1; t < this.nodes.length; t++) {
            canvas_context.lineTo(this.nodes[t].x, this.nodes[t].y)
        }
        canvas_context.lineTo(this.nodes[0].x, this.nodes[0].y)
        canvas_context.fill()
        canvas_context.stroke()
        canvas_context.closePath()
    }
    shiftBy(pointCircle) {
        for (let t = 0; t < this.nodes.length; t++) {
            let l = new LineOP(this.nodes[t], pointCircle)
            let pcx = (this.nodes[t].x - pointCircle.x)
            let pcy = (this.nodes[t].y - pointCircle.y)
            let length = l.hypotenuse()
            let root = length - Math.sqrt(1 + ((pointCircle.radius * pointCircle.radius) / (length * length)))
            this.nodes[t].x = pcx * root
            this.nodes[t].y = pcy * root
        }
    }
}


let dots = []
let circs = []


const guys = []
let flip = 1
let sizePix = 16
let pixboxes = []
let statpixboxes = []
let statpixboxes2 = []
// for (let t = 1; t < 100; t++) {
//     const ing = new Image()
//     // ing.src = `r${t}.png`
//     guys.push(ing)
//     let pix1 = canvas_context.getImageData(0, 0, sizePix, sizePix)
//     let pix1z = canvas_context.getImageData(0, 0, sizePix, sizePix)
//     let pix1z2 = canvas_context.getImageData(0, 0, sizePix, sizePix)
//     pixboxes.push(pix1)
//     statpixboxes.push(pix1z)
//     statpixboxes2.push(pix1z2)
// }
for (let t = 0; t < 9100; t++) {
    const ing = new Image()
    // ing.src = `c${t}.png`
    guys.push(ing)
    let pix1 = canvas_context.getImageData(0, 0, sizePix, sizePix)
    let pix1z = canvas_context.getImageData(0, 0, sizePix, sizePix)
    let pix1z2 = canvas_context.getImageData(0, 0, sizePix, sizePix)
    pixboxes.push(pix1)
    statpixboxes.push(pix1z)
    statpixboxes2.push(pix1z2)
}

// let bw = new Image()
let b = new Rectangle(0, 0, 100, sizePix, "black")
let w = new Rectangle(0, sizePix, 100, sizePix, "black")
let c = new Rectangle(25, 25, sizePix, sizePix, "white")
// b.draw()
// w.draw()
// c.draw()
let pix2 = canvas_context.getImageData(100, 100, sizePix, sizePix)
let pix3 = canvas_context.getImageData(100, 100, sizePix, sizePix)

// b.draw()
// w.draw()
// c.draw()
pix1 = canvas_context.getImageData(0, 0, sizePix, sizePix)

let inputs = []
for (let t = 0; t < 27; t++) {
    // if (t % 4 != 3) {
        inputs.push(new Data(pix1.data[t] / 255))
    // } else {
    // }
}


let net = new Network(inputs, [16,16, 3])
// net.becomeNetworkFrom(tvnet) 
// net.becomeNetworkFrom(subble) 
// net.becomeNetworkFrom(nightfruit) 
// net.becomeNetworkFrom(network)

let pixfruits = new Image()
pixfruits.src = "frui48.png"
let frui = new Image()
frui.src = "frui48.png"

let fruiw = new Image()
fruiw.src = "fruiw.png"

function exportJSON(originalData) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["network = " + JSON.stringify((originalData), null, 2)], {
        type: "js"
    }));
    a.setAttribute("download", `fifnet.js`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
let epochs = 0
canvas_context.imageSmoothingEnabled = true
let orders = []
function fmain(){

    if(keysPressed['l']){
        flip = -1
    }

    if(keysPressed['k']){
        flip = 1
    }

    if (keysPressed[' '] ) {
        keysPressed[' '] = false
        out = 0
        started = 1
        if (m < 0) {
            m = 0
        }
        randpoint = 0
        stepover = 0
        count = 0
        for (let t = 0; t < 91; t++) {
            orders.push(t)
            // console.log(t)
            canvas_context.fillStyle = "#404040"
            canvas_context.fillRect(0, 0, canvas.width, canvas.height)  // refreshes the image\
            let x = 0//(Math.floor(t/91)%2)-1
            let y = 0//(Math.floor(t/91)%2)-1
            canvas_context.drawImage(frui, (t) * sizePix, 0, sizePix, sizePix, x, y, sizePix, sizePix)
            pixboxes[t] = canvas_context.getImageData(0, 0, sizePix, sizePix)
            canvas_context.clearRect(0, 0, canvas.width, canvas.height)
            for (let k = 0; k < pixboxes[count].data.length; k += 4) {
                let r1 = rands[randpoint]
                randpoint++
                randpoint %= rands.length
                let r2 = rands[randpoint]
                randpoint++
                randpoint %= rands.length
                let r3 = rands[randpoint]
                randpoint++
                randpoint %= rands.length
                pix3.data[k] = r1 * 255
                pix3.data[k + 1] = r1 * 255
                pix3.data[k + 2] = r1 * 255
                pix3.data[k + 3] = 255
            }
            canvas_context.putImageData(pix3, 0, 0)
            statpixboxes[t] = canvas_context.getImageData(0, 0, sizePix, sizePix)
            canvas_context.fillStyle = "#404040"
            canvas_context.fillRect(0, 0, canvas.width, canvas.height) 
            canvas_context.drawImage(frui, (t) * sizePix, 0, sizePix, sizePix, x,y, sizePix, sizePix)
            pixboxes[t] = canvas_context.getImageData(0, 0, sizePix, sizePix)
            statpixboxes2[t] = canvas_context.getImageData(0, 0, sizePix, sizePix)
        }
        start = 1
    }
    // console.log(statpixboxes2)
    if(start != 1){
        return
    }
    console.log('s')

    inputs = []
    for (let t = 0; t < statpixboxes[0].data.length; t += 1) {
        if (t % 4 == 0) {
            inputs.push(new Data(statpixboxes[orders[count%pixboxes.length]].data[t] / (255)))
        } else {
        }
        // pixboxes[count].data[t] = pix3.data[t]
    }
    net.compute(inputs) 

    if (start == 1) {
        let exputs = []
        for (let t = 0; t < 40; t++) {
            if (t % 4 == 3) {
            } else {
                exputs.push(new Data(pixboxes[orders[count%pixboxes.length]].data[t] / 255))
            }
        }
    net.calculateDeltasReLU(exputs)
    net.adjustWeightsReLU()
    }
    
    
    if (!keysPressed['s'] ) {

        for (let t = 0; t < statpixboxes2[count].data.length; t += 3) {
            let k = Math.floor(t * (4 / 3))
            statpixboxes2[orders[count%pixboxes.length]].data[k] = net.outputs[t%3] * 255
            statpixboxes2[orders[count%pixboxes.length]].data[k + 1] = net.outputs[(t + 1)%3] * 255
            statpixboxes2[orders[count%pixboxes.length]].data[k + 2] = net.outputs[(t + 2)%3] * 255
            statpixboxes2[orders[count%pixboxes.length]].data[k + 3] = 255
        }
    
            // canvas_context.putImageData(pix3,sizePix+( (count % 13) * sizePix),sizePix+( Math.floor(count / 13) * sizePix))
            // statpixboxes[count] = canvas_context.getImageData(0, 0, sizePix, sizePix)
    
            // canvas_context.fillStyle = "#888888"
            // canvas_context.fillRect(sizePix*(count%13), 0, sizePix, sizePix)
            canvas_context.putImageData(statpixboxes2[orders[count%pixboxes.length]], sizePix*(orders[count%pixboxes.length]%128), 1440+(sizePix*(Math.floor(orders[count%pixboxes.length]/128))))
            canvas_context.putImageData(statpixboxes[orders[count%pixboxes.length]], sizePix*(orders[count%pixboxes.length]%128), 720+(sizePix*(Math.floor(orders[count%pixboxes.length]/128))))
            canvas_context.putImageData(pixboxes[orders[count%pixboxes.length]], sizePix*(orders[count%pixboxes.length]%128), 0+(sizePix*(Math.floor(orders[count%pixboxes.length]/128))))
            // canvas_context.drawImage(guys[count], 0, 0, sizePix, sizePix, sizePix, 0, sizePix, sizePix)
    
            // canvas_context.drawImage(fruiw, (count%(91))*sizePix, 0, sizePix,sizePix, sizePix*(count%91), sizePix+(96*(Math.floor(count/91))), sizePix, sizePix) 
            // canvas_context.drawImage(frui, (count%(91))*sizePix, 0, sizePix,sizePix, sizePix*(count%91), sizePix+(96*(Math.floor(count/91))), sizePix, sizePix) 
            // canvas_context.putImageData(statpixboxes2[count], sizePix, sizePix)
    
            // statpixboxes[count] = canvas_context.getImageData(0, 0, sizePix, sizePix)
            // canvas_context.putImageData(statpixboxes[count], sizePix*(count%13), 96+(96*(Math.floor(count/13))))
    
    
            // canvas_context.drawImage(frui, (count%(91))*sizePix, 0, sizePix,sizePix, 128+(sizePix*(count%91)), 0+(96*(Math.floor(count/91))), sizePix, sizePix) 
            
            // canvas_context.putImageData(statpixboxes[count], 128+(sizePix*(count%91)), sizePix+(96*(Math.floor(count/91))))
    // 
            // canvas_context.putImageData(pix3, sizePix*(count%13), 128+(96*(Math.floor(count/13))))
    
    
            
            // canvas_context.putImageData(statpixboxes[count], 5sizePix+((count%13)*sizePix), 0+(96*(Math.floor(count/13))))
    
            // canvas_context.putImageData(statpixboxes2[count], 5sizePix+((count%13)*sizePix), sizePix+(96*(Math.floor(count/13))))
    
            // canvas_context.putImageData(pixboxes[count], 5sizePix+((count%13)*sizePix), sizePix+(96*(Math.floor(count/13))))
    
    }
    count++
    count%=91
    if(count == 0){

        epochs++
        // console.log(epochs)
        // gloe = 0
        orders.sort((a,b) => Math.random() > .5 ? 1:-1)
    }

}


let pigs = canvas_context.getImageData(0,0,3,3)
let cats = canvas_context.getImageData(0,0,3,3)
let sheep = canvas_context.getImageData(0,0,16,16)


function getPixelGridRGB(x, y) {
    let width = canvas_context.canvas.width;
    let height = canvas_context.canvas.height;
    let rgbValues = [];

    for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
            let px = x + dx;
            let py = y + dy;

            // Ensure coordinates are within bounds
            if (px >= 0 && px < width && py >= 0 && py < height) {
                let index = (py * width + px) * 4; // Compute pixel index in the data array
                let imageData = canvas_context.getImageData(px, py, 1, 1).data;
                rgbValues.push(new Data(imageData[0]/255), new Data(imageData[1]/255), new Data(imageData[2]/255)); // Push R, G, B values
            } else {
                rgbValues.push(new Data(0), new Data(0), new Data(0)); // Out-of-bounds pixels default to black
            }
        }
    }

    return rgbValues;
}

function setPixelRGB(imageData, x, y, r, g, b) {
    let width = imageData.width;
    let index = (y * width + x) * 4; // Compute pixel index in the data array

    imageData.data[index] = r;     // Red
    imageData.data[index + 1] = g; // Green
    imageData.data[index + 2] = b; // Blue
    imageData.data[index + 3] = 255; // Alpha (fully opaque)
}


let bw = []
for(let t = 0;t<16*16;t+=1){
    bw.push(Math.abs(Math.random()*1))
    bw.push(Math.abs(Math.random()*1))
    bw.push(Math.abs(Math.random()*1))
}


// Main function to start the process
let numActions = 4
let networker = new Network(new Array(16*16*2).fill(0), [256, 128, 64, 32, 16, numActions] );
let agent = new ReinforcementAgent(networker, numActions);

function rewardFunction() {
    let link = new LineOP(edot, pdot);
    let distance = link.hypotenuse();

    // Reward is highest when distance is 0, and decreases as distance grows
    return (1 / (distance + 1)); // Avoids division by zero
}
// function rewardFunction() {
//     let link = new LineOP(edot, pdot);
//     return 128 - link.hypotenuse();
// }


let pdot = new Circle(Math.round(Math.random()*16), Math.round(Math.random()*16), 3, "#00DDaa")
let edot = new Circle(Math.round(Math.random()*16), Math.round(Math.random()*16), 3, "#DD00FF")

let ce = 0
let tim = 0
let avg = 0
let olddata = []

function main() {
    ce++
    if(pdot.doesPerimeterTouch(edot)){
        agent.epsilon*=.995
        if(agent.epsilon <.025){
            agent.epsilon = .025
        }
        avg= avg*tim
        tim++
        avg += ce
        avg/=tim
        console.log(ce, tim, avg, agent.epsilon)
ce = 0
 pdot = new Circle(Math.round(Math.random()*16), Math.round(Math.random()*16), 3, "#00DDaa")
 edot = new Circle(Math.round(Math.random()*16), Math.round(Math.random()*16), 3, "#DD00FF")

    }
    let linkz = new LineOP(edot, pdot)

    let zh = linkz.hypotenuse()

    // let state = agent.getStateFromCanvas(canvas);
    let oldstate = agent.getStateFromCanvas(canvas);
    let action = agent.selectAction(oldstate);


    if(action == 0){
        pdot.x+=1
    }else if (action == 1){
        pdot.x-=1
    }else if (action == 2){
        pdot.y+=1
    }else if (action == 3){
        pdot.y-=1
    }


    pdot.x = Math.max(Math.min(15,pdot.x),1)
    pdot.y = Math.max(Math.min(15,pdot.y),1)
    edot.x = Math.max(Math.min(15,edot.x),1)
    edot.y = Math.max(Math.min(15,edot.y),1)
    
    canvas_context.clearRect(0,0,64,64)

    canvas_context.imageSmoothingEnabled = false
    edot.radius = 1
    edot.color = "#DD00ff"
    pdot.radius = 1
    pdot.color = "#00ff00"
    // for(let t = 0;t<15;t++){
    //     edot.radius--
    //     edot.draw()
    //     pdot.radius--
    //     pdot.draw()
    // }
    edot.draw()
    edot.radius = 2
    pdot.draw()
    pdot.radius = 2

    let reward = rewardFunction(); // Placeholder for actual reward logic

    zh = (zh-linkz.hypotenuse())
    
    if(zh > 0){
        reward+=1
    }else{
        reward += -1
    }
    if(pdot.x >= 15 || pdot.x <= 1){
        reward += -1
    }
    if(pdot.y >= 15 || pdot.y <= 1){
        reward  += -1
    }


    reward = Math.tanh(reward); // Keeps values between -1 and 1

    // console.log(reward)

    // let nextState = agent.getStateFromCanvas(canvas);
    let newstate = agent.getStateFromCanvas(canvas);
  
    if(Math.random() < .9 && olddata.length > 0){
        let i = Math.floor(Math.random()*olddata.length)
        if(keysPressed['p']){
        console.log(olddata[i])
        }
        agent.train(olddata[i][0], olddata[i][1], olddata[i][2], olddata[i][3]);
    }else{

        if(Math.random() < .9){
        if(olddata.length < 10000){
            olddata.push([oldstate,action, reward, newstate])
        }else{
            let i = Math.floor(Math.random()*olddata.length)
            olddata.splice(i,1)
            olddata.push([oldstate,action, reward, newstate])
    
    
        }
        }
    }
    
    

    return


    if(keysPressed['j']){
        bw = []
        for(let t = 0;t<16*16;t+=1){
            bw.push(Math.abs(Math.random()*1))
            bw.push(Math.abs(Math.random()*1))
            bw.push(Math.abs(Math.random()*1))
        }

    }
    if(!(keysPressed[' '] || keysPressed['j'])){
        let c = 0
    for(let t = 0;t<16;t+=1){
        for(let k = 0;k<16;k+=1){
            c+=3
        canvas_context.fillStyle = `rgb(${bw[c]*255}, ${bw[c+1]*255}, ${bw[c+2]*255})`
        // canvas_context.fillRect(t+16,k+16,1,1)
        // canvas_context.fillRect(t+0,k+16,1,1)
        // canvas_context.fillRect(t+16,k+0,1,1)
        canvas_context.fillRect(t+0,k+0,1,1)
        }
    }
    }
    let x = 0;
    let y = 0;      
    
    // Iterate through pixel data

    let pairs = []
    for(let t = 0;t<sizePix*2;t++){
        for(let k = 0;k<sizePix*2;k++){  
          pairs.push([t,k])
        }
    }    

    pairs.sort((a,b)=> Math.random() > .5? 1:-1)

    for(let t = 0;t<16;t++){
        for(let k = 0;k<16;k++){
            let m =( t*sizePix + k)
        x = 0+t//pairs[m][0]
        y = 0+k//pairs[m][1]   
        // pigs = canvas_context.getImageData(x,y,3,3)
        pigs = getPixelGridRGB(x+16,y+16)  
        // console.log(pigs)
        net.compute(pigs)

        console.log(pigs)
        let r1 = 0
        let g1 = 0
        let b1 = 0
        for(let t = 0;t<pigs.length;t+=3){
            r1+=pigs[t]/(9)
        }

        for(let t = 1;t<pigs.length;t+=3){
            g1+=pigs[t]/(9)
            
        }

        for(let t = 2;t<pigs.length;t+=3){
            b1+=pigs[t]/(9)
            
        }


        console.log(r1,g1,b1)
        net.calculateDeltasSigmoid([new Data(1-r1), new Data(1-g1), new Data(1-b1)])
        net.adjustWeights()
        setPixelRGB(sheep, x,y,net.outputs[0].valueOf()*255, net.outputs[1].valueOf()*255, net.outputs[2].valueOf()*255)
        }
    }



    
    canvas_context.putImageData(sheep, 0, 0);
    
    // if (count == (9100)) {
    //     if ( filein < 174) { //keysPressed['f'] &&

    //         if (started == 1 && out == 0) {
    //             out = 1
    //             const img2 = new Image();
    //             img2.src = canvas.toDataURL("image/png");
    //             // document.body.appendChild(img2);
    //             const link = document.createElement("a");
    //             link.download = `2wrruit${globalx}.png`
    //             globalx++
    //             canvas.toBlob(function (blob) {
    //                 link.href = URL.createObjectURL(blob);
    //                 link.click();
    //             }, "image/png");
    //         }
    //         // var script = document.createElement("script");
    //         // script.setAttribute("type", "text/javascript");
    //         // if (filein < 10) {
    //         //     script.setAttribute("src", `fnet0000${filein}.js`);
    //         // } else if (filein < 100) { 
    //         //     script.setAttribute("src", `fnet000${filein}.js`);
    //         // } else if (filein < 1000) {
    //         //     script.setAttribute("src", `fnet00${filein}.js`);
    //         // }
    //         // filein++
    //         // console.log(script)  
    //         // document.getElementsByTagName("head")[0].appendChild(script);
    //         // net.becomeNetworkFrom(network)
    //         count = 0
    //         started = 0
    //         // keysPressed[' '] = true
    //     }

    //     return
    // }
    // if (keysPressed['f']) {
    //     return
    // }
    // if (keysPressed['3'] || m > 91000) {
    //     m = 0
    //     // exportJSON(net.log())
    //     keysPressed['3'] = false
    // }
    // m++
    // // canvas_context.clearRect(0, 0, canvas.width, canvas.height)  // refreshes the image
    // // gamepadAPI.update() //checks for button presses/stick movement on the connected controller)
    // // game code goes here
    // // b.draw()
    // // w.draw()
    // if (count == guys.length - 1) {
    //     stepover++
    // }
    // if (keysPressed['t']) {

    //     start = 1
    // }
    // if (keysPressed['e']) {

    //     start = 2
    // }

    // if (keysPressed[' '] || stepover == 5.1) {
    //     keysPressed[' '] = false
    //     out = 0
    //     started = 1
    //     if (m < 0) {
    //         m = 0
    //     }
    //     randpoint = 0
    //     stepover = 0
    //     count = 0
    //     for (let t = 0; t < (9100); t++) {
    //         console.log(t)
    //         canvas_context.fillStyle = "#888888"
    //         canvas_context.fillRect(0, 0, canvas.width, canvas.height)  // refreshes the image
    //         canvas_context.drawImage(frui, (t % (91)) * sizePix, 0, sizePix, sizePix, 0, 0, sizePix, sizePix)
    //         pixboxes[t] = canvas_context.getImageData(0, 0, sizePix, sizePix)
    //         canvas_context.clearRect(0, 0, canvas.width, canvas.height)
    //         for (let k = 0; k < pixboxes[count].data.length; k += 4) {
    //             let r1 = rands[randpoint]
    //             randpoint++
    //             randpoint %= rands.length
    //             let r2 = rands[randpoint]
    //             randpoint++
    //             randpoint %= rands.length
    //             let r3 = rands[randpoint]
    //             randpoint++
    //             randpoint %= rands.length
    //             pix3.data[k] = r1 * 255
    //             pix3.data[k + 1] = r2 * 255
    //             pix3.data[k + 2] = r3 * 255
    //             pix3.data[k + 3] = 255
    //         }
    //         canvas_context.putImageData(pix3, 0, 0)
    //         statpixboxes[t] = canvas_context.getImageData(0, 0, sizePix, sizePix)
    //         statpixboxes2[t] = canvas_context.getImageData(0, 0, sizePix, sizePix)
    //     }
    //     start = 1
    // }

    // if (keysPressed['o'] || stepover == 5.1) {
    //     keysPressed['o'] = false
    //     out = 0
    //     started = 1
    //     if (m < 0) {
    //         m = 0
    //     }
    //     stepover = 0
    //     count = 0



    //     randpoint =  Math.floor(Math.random() * rands.length)
    //     stepover = 0
    //     count = 0
    //     for (let t = 0; t < (9100); t++) {
    //         canvas_context.fillStyle = "#888888"
    //         canvas_context.fillRect(0, 0, canvas.width, canvas.height)  // refreshes the image
    //         canvas_context.drawImage(frui, (t % (91)) * sizePix, 0, sizePix, sizePix, 0, 0, sizePix, sizePix)
    //         pixboxes[t] = canvas_context.getImageData(0, 0, sizePix, sizePix)
    //         canvas_context.clearRect(0, 0, canvas.width, canvas.height)
    //         for (let k = 0; k < pixboxes[count].data.length; k += 4) {
    //             let r1 = rands[randpoint]
    //             randpoint++
    //             randpoint %= rands.length
    //             let r2 = rands[randpoint]
    //             randpoint++
    //             randpoint %= rands.length
    //             let r3 = rands[randpoint]
    //             randpoint++
    //             randpoint %= rands.length
    //             pix3.data[k] = r1 * 255
    //             pix3.data[k + 1] = r2 * 255
    //             pix3.data[k + 2] = r3 * 255
    //             pix3.data[k + 3] = 255
    //         }
    //         canvas_context.putImageData(pix3, 0, 0)
    //         statpixboxes[t] = canvas_context.getImageData(0, 0, sizePix, sizePix)
    //         statpixboxes2[t] = canvas_context.getImageData(0, 0, sizePix, sizePix)
    //     }
    //     start = 2
    // }
    // if (keysPressed['z'] || stepover == 5.1) {
    //     keysPressed['z'] = false
    //     out = 0
    //     started = 1
    //     if (m < 0) {
    //         m = 0
    //     }
    //     stepover = 0
    //     count = 0



    //     randpoint = 1 // Math.floor(Math.random() * rands.length)
    //     stepover = 0
    //     count = 0
    //     for (let t = 0; t < (91); t++) {
    //         canvas_context.fillStyle = "#888888"
    //         canvas_context.fillRect(0, 0, canvas.width, canvas.height)  // refreshes the image
    //         canvas_context.drawImage(frui, (t % (91)) * sizePix, 0, sizePix, sizePix, 0, 0, sizePix, sizePix)
    //         pixboxes[t] = canvas_context.getImageData(0, 0, sizePix, sizePix)
    //         canvas_context.clearRect(0, 0, canvas.width, canvas.height)
    //         for (let k = 0; k < pixboxes[count].data.length; k += 4) {
    //             let r1 = rands[randpoint]
    //             randpoint++
    //             randpoint %= rands.length
    //             let r2 = rands[randpoint]
    //             randpoint++
    //             randpoint %= rands.length
    //             let r3 = rands[randpoint]
    //             randpoint++
    //             randpoint %= rands.length
    //             pix3.data[k] = r1 * 255
    //             pix3.data[k + 1] = r2 * 255
    //             pix3.data[k + 2] = r3 * 255
    //             pix3.data[k + 3] = 255
    //         }
    //         canvas_context.putImageData(pix3, 0, 0)
    //         statpixboxes[t] = canvas_context.getImageData(0, 0, sizePix, sizePix)
    //         statpixboxes2[t] = canvas_context.getImageData(0, 0, sizePix, sizePix)
    //     }
    //     start = 2
    // }

    // // console.log(start)
    // if (start >= 1) {
    //     if (keysPressed['n']) {
    //         for (let k = 0; k < pixboxes[count].data.length; k += 4) {
    //             let r1 = rands[randpoint]
    //             randpoint++
    //             randpoint %= rands.length
    //             let r2 = rands[randpoint]
    //             randpoint++
    //             randpoint %= rands.length
    //             let r3 = rands[randpoint]
    //             randpoint++
    //             randpoint %= rands.length
    //             pix3.data[k] = r1 * 255
    //             pix3.data[k + 1] = r2 * 255
    //             pix3.data[k + 2] = r3 * 255
    //             pix3.data[k + 3] = 255
    //         }
    //         canvas_context.putImageData(pix3, 0, 0)
    //         statpixboxes[count] = canvas_context.getImageData(0, 0, sizePix, sizePix)

    //     } else {
    //         // statpixboxes[count] = canvas_context.getImageData(0, 0, sizePix, sizePix)
    //     }

    //     // canvas_context.putImageData(statpixboxes2[count], 0, 0)

    //     if (keysPressed['m']) {

    //         for (let t = 0; t < statpixboxes[count].data.length; t += 1) {
    //             // statpixboxes[count].data[t] = ((pix3.data[t] * 1) + (statpixboxes2[count].data[t] * 0)) / 1
    //             // statpixboxes[count].data[t] = ((pix3.data[t] * 1))
    //             // pixboxes[count].data[t] = pix3.data[t]
    //         }
    //     } else if (keysPressed['y']) {

    //         for (let t = 0; t < statpixboxes[count].data.length; t += 1) {
    //             // statpixboxes[count].data[t] = ((pix3.data[t] * 1) + statpixboxes2[count].data[t]) / 2
    //             // statpixboxes[count].data[t] = ((pix3.data[t] * 1))
    //             // pixboxes[count].data[t] = pix3.data[t]
    //         }
    //     } else {

    //         for (let t = 0; t < statpixboxes[count].data.length; t += 1) {
    //             // statpixboxes[count].data[t] = ((pix3.data[t] * 0) + statpixboxes2[count].data[t]) / 1
    //             // pixboxes[count].data[t] = pix3.data[t]
    //         }

    //     }

    //     inputs = []
    //     for (let t = 0; t < statpixboxes[8].data.length; t += 1) {
    //         if (t % 4 == 3) {
    //         } else {
    //             if(!keysPressed['r']){
    //                 inputs.push(new Data(statpixboxes[count].data[t] / 255))
    //             }else{
    //                 if((t/statpixboxes[8].data.length)> ((count/91)*1)){

    //                     // inputs.push(new Data(Math.random()))
    //                  inputs.push(new Data(statpixboxes[(filein-39)%(91)].data[t] / 255))

    //                 }else{

    //                     inputs.push(new Data(statpixboxes[(filein-38)%(91)].data[t] / 255))
    //                 }
    //             }
    //         }
    //         // pixboxes[count].data[t] = pix3.data[t]
    //     }
    //     // console.log(inputs)
    //     net.compute(inputs)

    //     // canvas_context.putImageData(statpixboxes[count], sizePix, sizePix)


    //     for (let t = 0; t < pixboxes[count].data.length; t += 3) {
    //         let k = Math.floor(t * (4 / 3))
    //         pix3.data[k] = net.outputs[t] * 255
    //         pix3.data[k + 1] = net.outputs[t + 1] * 255
    //         pix3.data[k + 2] = net.outputs[t + 2] * 255
    //         pix3.data[k + 3] = 255
    //     }
    //     // console.log(pix3)
    //     if (start == 1) {
    //         let exputs = []
    //         for (let t = 0; t < pixboxes[count].data.length; t++) {
    //             if (t % 4 == 3) {
    //             } else {
    //                 exputs.push(new Data(pixboxes[count].data[t] / 255))
    //             }
    //         }
    //     net.calculateDeltasSigmoid(exputs)
    //     net.adjustWeights()
    //     }
    //     // canvas_context.putImageData(pix3,sizePix+( (count % 13) * sizePix),sizePix+( Math.floor(count / 13) * sizePix))
    //     // statpixboxes[count] = canvas_context.getImageData(0, 0, sizePix, sizePix)

    //     canvas_context.fillStyle = "#888888"

    //     canvas_context.putImageData(statpixboxes[count], 0, sizePix)
    //     canvas_context.fillRect(sizePix, 0, sizePix, sizePix)
    //     // canvas_context.drawImage(guys[count], 0, 0, sizePix, sizePix, sizePix, 0, sizePix, sizePix)

    //     canvas_context.drawImage(frui, (count%(91))*sizePix, 0, sizePix,sizePix, sizePix, 0, sizePix, sizePix) 
    //     canvas_context.putImageData(statpixboxes2[count], sizePix, sizePix)

    //     // statpixboxes[count] = canvas_context.getImageData(0, 0, sizePix, sizePix)
    //     canvas_context.putImageData(statpixboxes[count], sizePix, 0)


    //     // canvas_context.drawImage(frui, (count%(91))*sizePix, 0, sizePix,sizePix, 128+(sizePix*(count%91)), 0+(96*(Math.floor(count/91))), sizePix, sizePix) 
        
    //     // canvas_context.putImageData(statpixboxes[count], 128+(sizePix*(count%91)), sizePix+(96*(Math.floor(count/91))))

    //     canvas_context.putImageData(pix3, (sizePix*2)+(sizePix*(count%91)), sizePix+(sizePix*(Math.floor(count/91))))


    //     if (keysPressed['c']) {
    //         count--
    //     }
    //     count+=1
    //     // count %= (91)
    // }
}

// })
