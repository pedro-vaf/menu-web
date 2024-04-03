const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemscontainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkoutBtn = document.getElementById("checkout-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")

/* Lista - Array vazio */
let cart = []

/* Abrir modal do carrinho */
cartBtn.addEventListener("click", function(){
    cartModal.style.display = "flex"
})

/* Fechar cliclando em qualquer lugar da tela menos no modal */
cartModal.addEventListener("click", function(event){
    if(event.target === cartModal){
        cartModal.style.display = "none"
    }
})

/* Fechar o modal quando clicar no botão 'fechar' */
closeModalBtn.addEventListener("click", function(){
    cartModal.style.display = "none"
})

/* Selecionando item para o carrinho */
menu.addEventListener("click", function(event){
    let parentButton = event.target.closest(".add-to-cart-btn")
    if(parentButton){
        const  name = parentButton.getAttribute("data-name")
        const  price = parseFloat(parentButton.getAttribute("data-price")) /* Convertendo String para float */

        /* Adicionando item para o carrinho */ 
        addToCart(name, price)
    }
})

/* Função para adicionar no carrinho */
function addToCart(name, price){

    /* Verificação se há item repetidos no array */
    const existingItem = cart.find(item => item.name === name)

    if(existingItem){
        /* Se existir item repetido aumentar a quantidade do produto */
        existingItem.quantity += 1;
    } else { 
        /* Alimentando o array */
        cart.push({
            name,
            price,
            quantity: 1,
        }) 
    }

    updateCartModal()
}

/* Função para atualizar visualmente o carrinho */
function updateCartModal(){
    cartItemscontainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {

        /* Criando elemento div com dados do produto selecionado */
        const cartItemElement = document.createElement("div");
        
        /* Adicionando class para o elemento div [estilização] */
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")
        
        cartItemElement.innerHTML = `
            <div class="flex items-center justify-between">

                <div>
                <p class="font-bold"> ${item.name} </p>
                <p> Qtd: ${item.quantity} </p>
                <p class="font-medium mt-2"> ${item.price.toLocaleString('pt-br', {style:'currency', currency:'BRL'})} </p>
                </div>

                
                <button class="remove-from-cart-btn" data-name="${item.name}"> 
                    Remover
                </button>
                
            </div>
        `
        /* Cálculo para o total */
        total += item.price * item.quantity;

        cartItemscontainer.appendChild(cartItemElement)
    })

    /* Exibir o valor total de acordo com o valor e quantidade de cada item */
    cartTotal.innerHTML = `${total.toLocaleString('pt-br', {style:'currency', currency:'BRL'})}`

    /* Exibir a quantidade de item na tela antes do modal */
    cartCounter.innerHTML = cart.length;
}

/* Função para remover item do carrinho */
cartItemscontainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name)

    if(index !== -1){
        const item = cart[index];

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

/* Pegar endereço para envio */
addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value

    if(inputValue !== ""){
        addressWarn.classList.add("hidden")
        addressInput.classList.remove("border-red-500")
    }
})

/* Finalizar pedido */
checkoutBtn.addEventListener("click", function(){

    const isOpen = checkRestaurantOpen();

    /* Sem retorno se tentar finalizar o pedido sem nada no carrinho */
    if(cart.length === 0) return;

    /* Retorno de erro se tentar finalizar o pedido sem colocar endereço */
    if(addressInput.value === ""){
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    } else {

    if(!isOpen){
        Toastify({
            text: "Ops! O restaurante está fechado",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
              background: "#ef4444",
            },
        }).showToast();
        return;
    } 

    /* Enviar o pedido para API do Whatsapp */
    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: ${item.price.toLocaleString('pt-br', {style:'currency', currency:'BRL'})} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "71999024539"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank") }

    /* Limpar e atualizar o carrinho */
    cart = [];
    updateCartModal;
})

/* Função para verificar se o restaurante está aberto */
function checkRestaurantOpen(){
    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora < 22 // retorno True 
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-red-500");
    spanItem.classList.add("bg-green-600");
} else {
    spanItem.classList.add("bg-red-500");
    spanItem.classList.remove("bg-green-600");
} 