let x = undefined
let y = undefined

let myInterval = undefined

document.body.addEventListener('click', (e) => {

    if (!document.querySelector('.autoscrollCursorManager')) {
        if ((e.ctrlKey && e.button === 0) || (e.button === 2)) {

            // Create autoscrollCursorManager
            const div = document.createElement('div');
            
            div.classList.add('autoscrollCursorManager')

            // Set x and y
            x = e.clientX - 15
            y = e.clientY - 15

            // move it to the x and y
            div.style.left = `${x}px`
            div.style.top = `${y}px`

            // Add cursor to the div
            document.body.appendChild(div)
            
            myInterval = setInterval(() => {
                this.scrollBy({
                    top: y - e.clientY + 15,
                    left: x - e.clientX + 15,
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
    x = e.clientX - 15
    y = e.clientY - 15
})
