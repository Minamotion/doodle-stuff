document.addEventListener("DOMContentLoaded", () => {
    /**
     * Cleans the doodle text file
     * @param {string} t Doodle to be cleaned
     * @returns A somewhat less heavy doodle text file
     */
    function cleanDoodle(t) {
        const dirty = t.split("\n")
        const clean = []
        let valid = false
        let beginDraw = false
        dirty.forEach((instruction, line) => {
            let possible = true
            let parsed;
            if (instruction.includes(":")) {
                parsed = instruction.replace("\r", "").split(":")
            } else {
                parsed = [instruction.replace("\r", "")]
            }
            switch (parsed[0]) {
                case "DOODL":
                    if (!valid) {
                        clean.push([instruction])
                        valid = true
                    }
                    break;
                case "BEGIN":
                case "DRAW":
                    possible = true
                    const compareA = dirty[line-1].split(":")
                    const compareB = parsed
                    const Atype = compareA.shift()
                    const Btype = compareB.shift()
                    if (Btype == "BEGIN") {
                        beginDraw = true
                    }
                    if (Atype == "BEGIN" || Atype == "DRAW") {
                        if (+compareA[0] === +compareB[0] && +compareA[1] === +compareB[1]) {
                            possible = false
                        }
                    }
                    if (possible) {clean.push([instruction])}
                    break;
                case "END":
                    possible = true
                    if (dirty[line-1] == instruction) {
                        possible = false
                    }
                    if (!beginDraw) {
                        possible = false
                    }
                    if (possible) {beginDraw = false, clean.push([instruction])}
                    break;
                case "PEN":
                    clean.push([instruction.toUpperCase()])
                default:
                    break;
            }
        });
        if (!valid) {
            clean.unshift(["DOODL"])
            valid = true
        }
        return clean.join("\n")
    }
    document.getElementById("doodle").addEventListener("change", () => {
        document.getElementById("doodle").files[0].text().then(async (doodle) => {
            let clean = cleanDoodle(doodle)
            clean = cleanDoodle(clean)
            document.getElementById("output").setAttribute("href",["data:text/plain,",clean.replace("\r","").replace("\n","%0A")].join(""))
            document.getElementById("output").removeAttribute("look")
        })
    })
})
