const d = 3;

let x = undefined
let y = undefined

let myInterval = undefined

document.body.addEventListener('mousedown', (e) => {

    if (!document.querySelector('.autoscrollCursorManager')) {
        if ((e.ctrlKey && e.button === 0) || (e.button === 1)) {

            // Create autoscrollCursorManager
            const div = document.createElement('div');
            
            div.classList.add('autoscrollCursorManager')

            // Set x and y
            x = e.clientX - d
            y = e.clientY - d

            // move it to the x and y
            div.style.left = `${x}px`
            div.style.top = `${y}px`

            // Add cursor to the div
            document.body.appendChild(div)
            
            myInterval = setInterval(() => {
                this.scrollBy({
                    top: y - e.clientY + d,
                    left: x - e.clientX + d,
                    behavior: "smooth",
                })
            }, 10)

            document.body.style.cursor = "all-scroll"
        }

    } else {
        e.preventDefault()
        document.querySelector('.autoscrollCursorManager').remove()
        x = undefined
        y = undefined

        clearInterval(myInterval)
        document.body.style.cursor = "default"
    }
})

document.addEventListener('mousemove', (e) => {
    x = e.clientX - d
    y = e.clientY - d
})
