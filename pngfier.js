document.addEventListener("DOMContentLoaded", () => {
    /** @type {HTMLCanvasElement} */
    const canvas = document.getElementById("canvas");
    /** @type {CanvasRenderingContext2D} */
    const pen = canvas.getContext("2d")
    function defaultPen() {
        pen.lineWidth = 6
        pen.lineCap = pen.lineJoin = "round"
        pen.strokeStyle = "#000"
    }

    defaultPen()
    pen.fillStyle = "#fff"
    pen.fillRect(0, 0, 480, 360)

    /**
     * Converts text into a doodle
     * @param {string} t How to draw the doodle
     * @returns {bool} If the doodle is actually doodleworthy
     */
    function drawDoodle(t) {
        let valid = false
        let parseable = true
        let doodleworthy = true
        defaultPen()
        pen.fillRect(0, 0, 480, 360)
        t.split("\n").forEach((instruction, line) => {
            if (line != 0 && !valid) {
                console.error("File isn't doodleworthy")
                doodleworthy = parseable = false
            }
            let parsed;
            if (instruction.includes(":")) {
                parsed = instruction.replace("\r", "").split(":")
            } else {
                parsed = [instruction.replace("\r", "")]
            }
            switch (parsed[0]) {
                case "DOODL":
                    valid = true
                    break;
                case "PEN":
                    if (valid || parseable) {
                        switch (parsed[1]) {
                            case "COLOR":
                                pen.strokeStyle = parsed[2] // Should be HEX format or the name of a color in lowercase (EXAMPLE: "#0000ff" or "blue")
                                break;
                            case "WIDTH":
                                pen.lineWidth = parsed[2] // Should be number
                                break;
                            case "RESET":
                                defaultPen()
                                break;
                            default:
                                console.warn(`PEN instruction is invalid ${line + 1} (${instruction})`)
                                break;
                        }
                    }
                    break;
                case "BEGIN":
                    if (valid || parseable) { pen.beginPath(); pen.moveTo(+parsed[1] + 240, +(+parsed[2]) * -1 + 180); pen.lineTo(+parsed[1] + 240, +(+parsed[2]) * -1 + 180); }
                    break;
                case "DRAW":
                    if (valid || parseable) { pen.lineTo(+parsed[1] + 240, +(+parsed[2]) * -1 + 180); }
                    break;
                case "END":
                    if (valid || parseable) {
                        pen.stroke()
                    }
                    break;
                default:
                    console.error(`Unhandled instruction at line ${line + 1} (${parsed[0]})`)
                    doodleworthy = parseable = false
                    break;
            }
            if (parseable || valid) {
                console.log(`Line ${line + 1} parsed successfully (11)`)
            } else {
                console.log(`Couldn't parse line ${line + 1} (${+parseable}${+valid})`)
            }
        })
        return doodleworthy
    }
    document.getElementById("doodle").addEventListener("change", () => {
        document.getElementById("doodle").files[0].text().then(async (doodle) => {
            let doodleworthy = await drawDoodle(doodle)
            if (doodleworthy) {
                document.getElementById("output").setAttribute("href", "")
                document.getElementById("output").setAttribute("look", "disabled")
                document.getElementById("convert").removeAttribute("disabled")
                document.getElementById("convert").innerText = "Convert doodle to PNG"
            } else {
                document.getElementById("output").setAttribute("look", "disabled")
                document.getElementById("doodle").setAttribute("disabled", "true")
                document.getElementById("convert").setAttribute("disabled", "true")
                document.getElementById("output").innerText = "You are not doodleworthy"
                document.getElementById("doodle").innerText = "You are not doodleworthy"
                document.getElementById("convert").innerText = "You are not doodleworthy"
            }
        })
    })

    document.getElementById("convert").addEventListener("click", () => {
        document.getElementById("output").setAttribute("href", canvas.toDataURL())
        document.getElementById("output").removeAttribute("look")
        document.getElementById("convert").innerText = "Convert doodle to PNG (Done)"
    })
})