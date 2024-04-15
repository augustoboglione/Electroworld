const ids = ["processor", "motherboard", "ssd", "ram", "graphics"]
const names = {"processor": "Procesador", "motherboard": "Motherboard", "ssd": "Tarjeta SSD", "ram": "Tarjeta RAM", "graphics": "Tarjeta gráfica"}
const prices = {"processor": 3, "motherboard": 5, "ssd": 10, "ram": 8, "graphics": 11}
const local = {}

const cart = document.getElementById("cart")
const cartNum = cart.querySelector(".cart-num")
const cartList = cart.querySelector(".cart-list")
const total = cartList.querySelector(".total")

const getLocalStorage = () => ids.forEach(el => local[el] = localStorage.getItem(el) ? parseInt(localStorage.getItem(el)) : 0)

class Product {
    static sum = 0

    constructor(id, name, price, qty) {
        this.id = id
        this.name = name
        this.price = price
        this.qty = qty
        Product.sum += qty

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
    }

    write() {
        this.item.querySelector(".qty").innerText = this.qty
        this.item.querySelector(".price").innerText = `$${this.qty * this.price}`

        cartNum.innerText = Product.sum
        if (Product.sum >= 10) cartNum.classList.add("overflow")
        else if (cartNum.classList.contains("overflow")) cartNum.classList.remove("overflow")

        if (Product.sum) total.innerHTML = `<p class="name">Total</p><p class="price">$${products.reduce((x, y) => x + y.qty * y.price, 0)}</p>`
        else total.innerHTML = "<p class='empty'>El carrito está vacío</p>"

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
        this.write()
    }

    down() {
        if (this.qty == 1) this.delete()
        else {
            this.qty--
            Product.sum--
            this.write()
        }
    }

    delete() {
        Product.sum -= this.qty
        this.qty = 0
        this.write()
        cartList.removeChild(this.item)
    }
}

getLocalStorage()

const products = ids.map(el => new Product(el, names[el], prices[el], local[el]))

for (let i of products) {
    i.addItem()
    i.write()
}