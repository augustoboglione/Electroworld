const ids = ["processor", "motherboard", "ssd", "ram", "graphics"]
const text = {"processor": "Procesador", "motherboard": "Motherboard", "ssd": "Tarjeta SSD", "ram": "Tarjeta RAM", "graphics": "Tarjeta gráfica"}
const prices = {"processor": 3, "motherboard": 5, "ssd": 10, "ram": 8, "graphics": 11}

const cart = document.querySelector("#cart")
const cartList = document.querySelector(".cart-list")
const total = document.querySelector(".total")

const getLocalStorage = () => {
    if (localStorage.getItem(ids[0]) != null) ids.forEach((el, i) => products[i].qty = parseInt(localStorage.getItem(el)))
}

class Product {
    constructor(id) {
        this.id = id
        this.price = prices[id]
        this.qty = 0

        this.button = document.getElementById(id)
        if (this.button != null) this.button.onclick = this.addToCart.bind(this)

        this.item = document.createElement("div")
        this.item.className = "item"
        this.item.innerHTML = `<p class="name">${text[this.id]}</p><p class="down">-</p>
        <p class="qty"/><p class="up">+</p><img class="delete" src="../img/bin.png"><p class="price"/>`
    
        this.addToCart = this.addToCart.bind(this)
        this.up = this.up.bind(this)
        this.down = this.down.bind(this)
        this.delete = this.delete.bind(this)
    }

    save() {
        const num = products.reduce((x, y) => x + y.qty, 0)

        this.item.querySelector(".qty").innerText = this.qty
        this.item.querySelector(".price").innerText = `$${this.qty * this.price}`

        cart.querySelector(".cart-num").innerText = num

        if (num) total.innerText = products.reduce((x, y) => x + y.qty * y.price, 0)
        else total.innerText = "El carrito está vacío."

        localStorage.setItem(this.id, this.qty)
    }

    addItem() {
        if (!cartList.contains(this.item) && this.qty) {
            cartList.insertBefore(this.item, total)

            this.item.querySelector(".down").onclick = this.down
            this.item.querySelector(".up").onclick = this.up
            this.item.querySelector(".delete").onclick = this.delete
        }
        this.save()
    }

    addToCart() {
        this.up()
        this.addItem()
    }

    up() {
        this.qty++
        this.save()
    }

    down() {
        if (this.qty == 1) this.delete()
        else {
            this.qty--
            this.save()
        }
    }

    delete() {
        this.qty = 0
        this.save()
        cartList.removeChild(this.item)
    }
}

const products = ids.map(el => new Product(el))

getLocalStorage()

for (let i of products) i.addItem()