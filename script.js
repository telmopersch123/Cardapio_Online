document.addEventListener("DOMContentLoaded", function () {
  const checkboxes = document.querySelectorAll(".CheckedBox");
  const cartItems = document.getElementById("cartItems");
  const TotItens = document.getElementById("TotItens");
  const modalCartItems = document.querySelector(
    "#modal-Confirmar .ItensFinais"
  );

  checkboxes.forEach((checkbox) => {
    const itemQuantityInput = document.getElementById(
      checkbox.id + "-quantity"
    );

    checkbox.addEventListener("change", function () {
      updateCartItem(this);
    });

    itemQuantityInput.addEventListener("change", function () {
      if (checkbox.checked) {
        updateCartItem(checkbox);
      }
    });
  });

  function updateTotalPrice(checkbox) {
    const cartItems = document.querySelectorAll("#cartItems .cart-item");
    let total = 0;
    cartItems.forEach((item) => {
      const itemPriceElement = item.querySelector(".item-price");
      if (itemPriceElement) {
        const ItemPriceText = itemPriceElement.textContent
          .replace("R$", "")
          .replace(",", ".");
        const itemPrice = parseFloat(ItemPriceText);
        total += itemPrice;
      }
    });
    if (TotItens) {
      TotItens.innerHTML = `Total: R$ ${total.toFixed(2)}`;
    }
    if (cartItems.length === 0) {
      TotItens.innerHTML = "";
    }
  }

  function updateCartItem(checkbox) {
    const itemName = checkbox.value;
    const itemPrice = parseFloat(checkbox.dataset.price);
    const itemQuantityInput = document.getElementById(
      checkbox.id + "-quantity"
    );
    const itemQuantity = parseInt(itemQuantityInput.value);
    const existingCartItem = document.querySelector(
      `#cartItems .cart-item[data-item="${itemName}"]`
    );

    if (checkbox.checked) {
      if (existingCartItem) {
        existingCartItem.querySelector(".item-quantity").textContent =
          itemQuantity;
        const totalItemPrice = itemQuantity * itemPrice;
        existingCartItem.querySelector(
          ".item-price"
        ).textContent = `R$ ${totalItemPrice.toFixed(2)}`;
      } else {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.dataset.item = itemName;
        cartItem.innerHTML = `
        <div class="div-Items">
          <span class="item-name">${itemName}</span>
          <span class="item-quantity">${itemQuantity}</span>
          <span class="item-price">R$ ${(itemPrice * itemQuantity).toFixed(
            2
          )}</span>
        </div>`;
        cartItems.appendChild(cartItem);
      }
    } else {
      if (existingCartItem) {
        cartItems.removeChild(existingCartItem);
        updateModalCartItems();
      }
    }
    updateTotalPrice(checkbox);
  }

  function updateModalCartItems() {
    const modalTotItems = document.querySelector(
      "#modal-Confirmar .ValorFinal"
    );
    modalTotItems.innerHTML = "";

    const modalCartItems = document.querySelector(
      "#modal-Confirmar .ItensFinais"
    );
    modalCartItems.innerHTML = "";
    const cartItems = document.querySelectorAll("#cartItems .cart-item");
    cartItems.forEach((cartItem) => {
      const itemName = cartItem.querySelector(".item-name").textContent;
      const itemQuantity = cartItem.querySelector(".item-quantity").textContent;
      const itemPrice = cartItem.querySelector(".item-price").textContent;

      const modalItem = document.createElement("div");
      modalItem.className = "modal-cart-item";
      modalItem.innerHTML = `
         <div class="div-Items">
      <span class="item-name">${itemName}</span>
      <span class="item-quantity">${itemQuantity}</span>
      <span class="item-price">${itemPrice}</span>
      </div>
    `;
      modalCartItems.appendChild(modalItem);

      let total = 0;
      cartItems.forEach((item) => {
        const itemPriceElement = item.querySelector(".item-price");
        if (itemPriceElement) {
          const ItemPriceText = itemPriceElement.textContent
            .replace("R$", "")
            .replace(",", ".");
          const itemPrice = parseFloat(ItemPriceText);
          total += itemPrice;
        }
      });
      if (TotItens) {
        modalTotItems.innerHTML = `Total: R$ ${total.toFixed(2)}`;
      }
    });
  }
  function areNoCheckboxesChecked() {
    const checkboxes = document.querySelectorAll(".CheckedBox");
    return Array.from(checkboxes).every((checkbox) => !checkbox.checked);
  }
  //
  const modal = document.getElementById("modal-Confirmar");
  const showModalBtn = document.getElementById("showModalBtn");
  const closeBtn = document.getElementById("closeBtn");
  const NehumItem = document.getElementById("NenhumItem");
  showModalBtn.addEventListener("click", function () {
    if (areNoCheckboxesChecked()) {
      NehumItem.style.display = "flex";
    } else {
      NehumItem.style.display = "none";
      updateModalCartItems();
      updateTotalPrice();
    }

    modal.style.display = "flex";
  });

  closeBtn.onclick = function () {
    NehumItem.style.display = "none";
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      NehumItem.style.display = "none";
      modal.style.display = "none";
    }
  };

  BotaoCancelar.addEventListener("click", function () {
    checkboxes.forEach((checkbox) => {
      checkbox.checked = false;
    });
    while (cartItems.firstChild) {
      cartItems.removeChild(cartItems.firstChild);
      updateModalCartItems();
      updateTotalPrice();
    }
    NehumItem.style.display = "none";
    modal.style.display = "none";
  });

  BotaoConfirmar.addEventListener("click", function () {
    if (areNoCheckboxesChecked()) {
      alert("Por Favor, Selecione algum Alimento!");
    } else {
      const userConfirmed = confirm(
        "Você tem certeza que deseja fechar esse pedido?"
      );
      if (userConfirmed) {
        document.querySelector("main").style.display = "none";
        document.getElementById("CarrinhoId").style.display = "none";
        document.getElementById("showModalBtn").style.display = "none";
        NehumItem.style.display = "none";
        modal.style.display = "none";
        document.getElementById("modal-Pagamento").style.display = "flex";
      }
    }
  });

  const paymentForm = document.getElementById("paymentForm");
  const cartaoInfo = document.getElementById("cartao-info");
  const pixInfo = document.getElementById("pix-info");
  paymentForm.addEventListener("change", function (event) {
    if (event.target.name === "paymentMethod") {
      const selectedMethod = event.target.value;
      if (selectedMethod === "cartao") {
        cartaoInfo.style.display = "block";
        pixInfo.style.display = "none";
      } else if (selectedMethod === "pix") {
        cartaoInfo.style.display = "none";
        pixInfo.style.display = "block";
      }
    }
  });

  document
    .getElementById("creditCardOption")
    .addEventListener("change", function () {
      if (this.checked) {
        document
          .getElementById("cardNumber")
          .setAttribute("required", "required");
        document
          .getElementById("cardExpiry")
          .setAttribute("required", "required");
        document.getElementById("cardCVC").setAttribute("required", "required");
      } else {
        document.getElementById("cardNumber").removeAttribute("required");
        document.getElementById("cardExpiry").removeAttribute("required");
        document.getElementById("cardCVC").removeAttribute("required");
      }
    });

  document
    .querySelector(".BotaoDesistir")
    .addEventListener("click", function () {
      document.querySelector("main").style.display = "flex";
      document.getElementById("CarrinhoId").style.display = "flex";
      document.getElementById("showModalBtn").style.display = "flex";
      NehumItem.style.display = "none";
      modal.style.display = "none";
      document.getElementById("modal-Pagamento").style.display = "none";
      alert("Pedido Cancelado!");
    });
  document.querySelector(".BotaoFechar").addEventListener("click", function () {
    const radios = document.querySelectorAll('input[name="paymentMethod"]');
    let selecionado = null;
    radios.forEach((radio) => {
      if (radio.checked) {
        selecionado = radio.value;
      }
    });
    if (selecionado) {
      if (selecionado === "cartao") {
        const cardNumber = document.getElementById("cardNumber").value.trim();
        const cardExpiry = document.getElementById("cardExpiry").value.trim();
        const cardCVC = document.getElementById("cardCVC").value.trim();

        if (cardNumber === "" || cardExpiry === "" || cardCVC === "") {
          return false;
        }
      }
      const deliveryAddress = document
        .getElementById("deliveryAddress")
        .value.trim();
      const customerName = document.getElementById("customerName").value.trim();
      if (deliveryAddress === "" || customerName === "") {
        return false;
      }
      document.querySelector("main").style.display = "flex";
      document.getElementById("CarrinhoId").style.display = "flex";
      document.getElementById("showModalBtn").style.display = "flex";
      NehumItem.style.display = "none";
      modal.style.display = "none";
      document.getElementById("modal-Pagamento").style.display = "none";
      alert("Pedido Efetuado com Sucesso!");
      return true;
    }
  });
});
