const widgetNum = document.querySelector(".widget-num")
const widgetList = document.querySelector(".widget-list")
const widgetTotal = widgetList.querySelector(".widget-total")

const checkout = document.querySelector(".checkout")
const checkoutList = document.querySelector(".checkout-list")
const checkoutTotal = document.querySelector(".checkout-total")
const confirm = document.querySelector(".confirm")

let products

const local = {}

const sign = (titleText, text, icon, showCancelButton, callback = null) => {
    let confirmButtonText, cancelButtonText

    if (showCancelButton) {
        confirmButtonText = "Aceptar"
        cancelButtonText = "Cancelar"
    } else confirmButtonText = "Aceptar"

    Swal.fire({
        titleText, text, icon, showCancelButton, confirmButtonText, cancelButtonText,
        confirmButtonColor: "transparent",
        cancelButtonColor: "transparent",
        customClass: {
            popup: "sign",
            confirmButton: "button",
            cancelButton: "button"
        }
    }).then(result => result.isConfirmed && callback ? callback() : null)
}

const setProducts = data => {
    const container = document.querySelector("section.productos")

    if (container) data.forEach(product => {
        const div = document.createElement("div")
        div.className = `${product.id}-div`
        div.innerHTML = 
        `<h2>${product.name}</h2>
        <img src="../img/${product.id}.jpg" alt="${product.name}">
        <p>${product.description}</p>
        <a class="button" href="producto.html?id=${product.id}">Ver más</a>`

        container.appendChild(div)
    })
}

const setHighlighted = data => {
    const container = document.querySelector("section.destacados")

    if (container) data.forEach(product => {
        if (product.highlighted) {
            const img = document.createElement("img")
            img.className = `img${product.highlighted}`
            img.src = `img/${product.id}.jpg`
            img.alt = product.name

            const div = document.createElement("div")
            div.className = `txt${product.highlighted}`
            div.innerHTML =
            `<h3>${product.name}</h3>
            <p>${product.short}</p>
            <a class="button" href="pages/producto.html?id=${product.id}">Ver más</a>`

            container.append(img, div)
        }
    })
}

const setProduct = data => {
    try {
        const id = window.location.search.match(/(?<=id=)\w+/)[0]
        const product = data.find(product => product.id == id)

        if (product) {
            const title = document.querySelector(".title")
            const container = document.querySelector(".product")
                
            title.textContent = product.name
    
            const img = document.createElement("img")
            img.src = `../img/${product.id}.jpg`
            img.alt = product.name

            const div = document.createElement("div")
            div.innerHTML =
            `<p>${product.description}</p>
            <p class="price">$${product.price}</p>
            <div class="counter-container">
                <div class="counter">
                    <img class="down" src="../img/minus.svg" alt="Sustraer">
                    <p class="qty">1</p>
                    <img class="up" src="../img/plus.svg" alt="Agregar">
                </div>
            </div>
            <div class="buttons">
                <a class="button" href="productos.html">Seguir comprando</a>
                <a class="button" id="${product.id}">Agregar al carrito</a>
            </div>`
    
            container.append(img, div)

            return product
        } else {
            title.textContent = "Error 404"

            return null
        }
    } catch {
        return null
    }
}

const fetchData = async () => {
    let data = await (await fetch("../api/data.json")).json()
    data.forEach(product => local[product.id] = localStorage.getItem(product.id) ? parseInt(localStorage.getItem(product.id)) : 0)

    setProducts(data)
    setHighlighted(data)
    const product = setProduct(data)

    if (product) {    
        let counter = 1

        const down = () => {
            if (counter > 1) {
                counter--
                document.querySelector(".product .qty").textContent = counter
            }
        }
    
        const up = () => {
            if (counter < product.stock) {
                counter++
                document.querySelector(".product .qty").textContent = counter
            }
        }
    
        document.querySelector(".product .down").onclick = down
        document.querySelector(".product .up").onclick = up
    }

    data.forEach(product => new Product(product.id, product.name, product.price, product.stock, local[product.id]))
}

class Product {
    static sum = 0
    static total = 0

    constructor(id, name, price, stock, qty) {
        this.id = id
        this.name = name
        this.price = price
        this.stock = stock
        this.qty = qty
        Product.sum += qty
        Product.total += qty * price

        this.counter = document.querySelector(".product .qty")

        this.button = document.getElementById(id)
        if (this.button) this.button.onclick = this.addToCart.bind(this)

        this.widgetItem = document.createElement("div")
        this.widgetItem.className = "widget-item"
        this.widgetItem.innerHTML = 
        `<p class="name">${name}</p>
        <div class="counter">
            <img class="down" src="../img/minus.svg" alt="Sustraer">
            <p class="qty"></p>
            <img class="up" src="../img/plus.svg" alt="Agregar">
            <img class="delete" src="../img/delete.svg" alt="Eliminar">
        </div>
        <p class="price"></p>`

        if (checkout) {
            this.checkoutItem = document.createElement("div")
            this.checkoutItem.className = "checkout-item"
            this.checkoutItem.innerHTML = 
            `<img class="checkout-img" src="../img/${id}.jpg" alt="${name}">
            <a class="name" href="producto.html?id=${id}">${name}</a>
            <div class="counter">
                <img class="down" src="../img/minus.svg" alt="Sustraer">
                <p class="qty"></p>
                <img class="up" src="../img/plus.svg" alt="Agregar">
                <img class="delete" src="../img/delete.svg" alt="Eliminar">
            </div>
            <p class="price"></p>`
        }

        this.addItem()
        this.write()
    }

    write() {
        this.widgetItem.querySelector(".qty").innerText = this.qty
        this.widgetItem.querySelector(".price").innerText = `$${this.qty * this.price}`

        if (checkout) {
            this.checkoutItem.querySelector(".qty").innerText = this.qty
            this.checkoutItem.querySelector(".price").innerText = `$${this.qty * this.price}`
        }

        widgetNum.innerText = Product.sum
        if (Product.sum >= 10) widgetNum.classList.add("overflow")
        else if (widgetNum.classList.contains("overflow")) widgetNum.classList.remove("overflow")

        if (Product.total) {
            widgetTotal.innerHTML = `<p class="name">Total</p><p class="price">$${Product.total}</p>`
            if (checkout) checkoutTotal.innerHTML = `<p>Total: $${Product.total}</p>`

            if (widgetTotal.classList.contains("empty")) {
                widgetTotal.classList.remove("empty")
                if (checkout) checkout.classList.remove("empty")
            }
        }
        else {
            widgetTotal.innerHTML = "<p>El carrito está vacío</p>"
            if (checkout) checkoutTotal.innerHTML = "<p>El carrito está vacío.</p>"

            widgetTotal.classList.add("empty")
            if (checkout) checkout.classList.add("empty")
        }

        localStorage.setItem(this.id, this.qty)
    }

    addItem() {
        if (!widgetList.contains(this.widgetItem) && this.qty) {
            widgetList.insertBefore(this.widgetItem, widgetTotal)

            this.widgetItem.querySelector(".down").onclick = this.down.bind(this)
            this.widgetItem.querySelector(".up").onclick = () => this.up(1)
            this.widgetItem.querySelector(".delete").onclick = this.delete.bind(this)

            if (checkout) {
                checkoutList.appendChild(this.checkoutItem)
            
                this.checkoutItem.querySelector(".down").onclick = this.down.bind(this)
                this.checkoutItem.querySelector(".up").onclick = () => this.up(1)
                this.checkoutItem.querySelector(".delete").onclick = this.delete.bind(this)
            }
        }
    }

    down() {
        if (this.qty == 1) this.delete()
        else {
            this.qty--
            Product.sum--
            Product.total -= this.price
            this.write()
        }
    }

    up(n) {
        if (this.qty + n > this.stock) sign("Atención", "Por el momento no contamos con más stock del producto.", "warning", false)

        else {
            this.qty += n
            Product.sum += n
            Product.total += n * this.price
            this.write()
        }
    }
    
    addToCart() {
        this.up(parseInt(this.counter.textContent))
        this.addItem()
    }

    delete() {
        sign("Eliminar", `¿Quiere eliminar ${this.name} del carrito?`, "error", true, () => {
            Product.sum -= this.qty
            Product.total -= this.qty * this.price
            this.qty = 0
            this.write()
            widgetList.removeChild(this.widgetItem)
            if (checkout) checkoutList.removeChild(this.checkoutItem)
        })
    }
}

fetchData()

if (confirm) confirm.onclick = () => sign("Confirmar", "¿Quiere confirmar la compra?", "question", true, () => {
    sign("Gracias", "¡Muchas gracias por su compra!", "success", false, () => {
        localStorage.clear()
        window.location.href = "../index.html"
    })
})