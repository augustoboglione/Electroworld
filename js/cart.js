const names = ["processor", "motherboard", "ssd", "ram", "card"]
const prices = {"processor": 3, "motherboard": 5, "ssd": 10, "ram": 8, "card": 11}
const products = names.map(el => new Product(el))

const cartWidget = document.getElementById("cart-widget")

class Product {
    constructor(name) {
        this.name = name
        this.price = prices[name]
        this.qty = 0
        this.button = document.getElementById(name)

        this.item = document.createElement("div")
        this.item.className = "item"
        this.item.innerHTML = `<p>${this.name}</p><img class="down"><p class="qty"></p><img class="up"><img class="delete">`

        this.button.onclick = this.addToCart
    }

    addToCart() {
        this.qty++
        this.item.querySelector(".qty").innerText = this.qty
        if (!cart.includes(this.entry)) {
            cartWidget.appendChild(this.entry)

            this.item.querySelector("down").onclick = () => this.qty == 1 ? this.delete : this.qty-- 
            this.item.querySelector("up").onclick = () => this.qty++
            this.item.querySelector("delete").onclick = this.delete
        }
    }

    delete() {
        this.qty = 0
        cartWidget.removeChild(this.entry)
    }
}

