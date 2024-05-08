const cartNum = document.querySelector(".cart-num")
const cartList = document.querySelector(".cart-list")
const total = cartList.querySelector(".total")

let data, products

const local = {}

const fetchData = async () => {
    data = await (await fetch("../api/data.json")).json()
    data.forEach(product => local[product.id] = localStorage.getItem(product.id) ? parseInt(localStorage.getItem(product.id)) : 0)

    const section = document.querySelector("section.productos")

    if (section) data.forEach(product => {
        const div = document.createElement("div")
        div.className = `${product.id}-div`
        div.innerHTML = 
        `<h2>${product.name}</h2>
        <img src="../img/${product.id}.jpg" alt="${product.name}">
        <p>${product.description}</p>
        <a class="button" id="${product.id}">Agregar al carrito</a>`

        section.appendChild(div)
    })

    const highlighted = document.querySelector("section.destacados")

    if (highlighted) data.forEach(product => {
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
            <a class="button" href="pages/productos.html#${product.id}-div">Ver más</a>`

            highlighted.append(img, div)
        }
    })

    products = data.map(product => new Product(product.id, product.name, product.price, local[product.id]))
}

class Product {
    static sum = 0
    static total = 0

    constructor(id, name, price, qty) {
        this.id = id
        this.name = name
        this.price = price
        this.qty = qty
        Product.sum += qty
        Product.total += qty * price

        this.button = document.getElementById(id)
        if (this.button != null) this.button.onclick = this.addToCart.bind(this)

        this.item = document.createElement("div")
        this.item.className = "item"
        this.item.innerHTML = 
        `<p class="name">${this.name}</p>
        <div>
            <img class="down" src="../img/minus.svg" alt="Sustraer">
            <p class="qty"></p>
            <img class="up" src="../img/plus.svg" alt="Agregar">
            <img class="delete" src="../img/delete.svg" alt="Eliminar">
        </div>
        <p class="price"></p>`

        this.addItem()
        this.write()
    }

    write() {
        this.item.querySelector(".qty").innerText = this.qty
        this.item.querySelector(".price").innerText = `$${this.qty * this.price}`

        cartNum.innerText = Product.sum
        if (Product.sum >= 10) cartNum.classList.add("overflow")
        else if (cartNum.classList.contains("overflow")) cartNum.classList.remove("overflow")

        if (Product.total) {
            total.innerHTML = `<p class="name">Total</p><p class="price">$${Product.total}</p>`
            if (total.classList.contains("empty")) total.classList.remove("empty")
        }
        else {
            total.innerHTML = "<p>El carrito está vacío</p>"
            total.classList.add("empty")
        }

        localStorage.setItem(this.id, this.qty)
    }

    addItem() {
        if (!cartList.contains(this.item) && this.qty) {
            cartList.insertBefore(this.item, total)

            this.item.querySelector(".down").onclick = this.down.bind(this)
            this.item.querySelector(".up").onclick = this.up.bind(this)
            this.item.querySelector(".delete").onclick = this.delete.bind(this)
        }
    }

    addToCart() {
        this.up()
        this.addItem()
    }

    up() {
        this.qty++
        Product.sum++
        Product.total += this.price
        this.write()
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

    delete() {
        Product.sum -= this.qty
        Product.total -= this.qty * this.price
        this.qty = 0
        this.write()
        cartList.removeChild(this.item)
    }
}

fetchData()