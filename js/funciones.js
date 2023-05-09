if (localStorage.getItem("productos") === null) {
  fetch("js/productos.json")
    .then((response) => response.json())
    .then((data) => {
      localStorage.setItem("productos", JSON.stringify(data));
      var productos = JSON.parse(localStorage.getItem("productos"));
    })
    .catch((error) => console.error(error));
} else {
  var productos = JSON.parse(localStorage.getItem("productos"));
}

const columna1 = document.querySelector(".columna1");
const columna2 = document.querySelector(".columna2");

for (let i = 0; i < productos.length; i++) {
  const card = document.createElement("div");
  card.classList.add("card");

  const image = document.createElement("img");
  image.src = productos[i].imagen;
  image.alt = productos[i].nombre;
  card.appendChild(image);

  const title = document.createElement("h3");
  title.textContent = productos[i].nombre;
  card.appendChild(title);

  const description = document.createElement("p");
  description.textContent = productos[i].descripcion;
  card.appendChild(description);

  const price = document.createElement("p");
  price.classList.add("price");
  price.textContent = `$ ${productos[i].precio}`;
  card.appendChild(price);

  const button = document.createElement("button");
  button.classList.add("button");
  button.textContent = "Iniciar Reserva";
  button.addEventListener("click", () => {
    agregarAlCarrito(productos[i]);
  });
  card.appendChild(button);

  // columnas cards
  if (i % 2 === 0) {
    columna1.appendChild(card);
  } else {
    columna2.appendChild(card);
  }
}

////////CARRITO///////////

const carrito = [];

function agregarAlCarrito(producto) {
  // Comprobar
  const productoExistente = carrito.find((p) => p.nombre === producto.nombre);

  if (productoExistente) {
    Swal.fire({
      icon: "warning",
      title: "Propiedad ya seleccionada",
      showConfirmButton: false,
      timer: 1500,
      customClass: {
        popup: "my-custom-class",
      },
    });

    return;
  }

  // Agregar el producto
  carrito.push(producto);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  // SWEET ALERT
  Swal.fire({
    icon: "success",
    title: "",
    showConfirmButton: false,
    timer: 1100,
    customClass: {
      popup: "my-custom-class",
    },
  });

  // cards en el contenedor del carrito
  const carritoContainer = document.querySelector(".carrito-container");

  // nueva card para el producto agregado
  const card = document.createElement("div");
  card.classList.add("card");

  const image = document.createElement("img");
  image.src = producto.imagen;
  image.alt = producto.nombre;
  card.appendChild(image);

  const title = document.createElement("h3");
  title.textContent = producto.nombre;
  card.appendChild(title);

  const price = document.createElement("p");
  price.classList.add("price");
  price.textContent = `$ ${producto.precio}`;
  card.appendChild(price);

  // Agrega un botón para eliminar la card
  const eliminarButton = document.createElement("button");
  eliminarButton.textContent = "Eliminar";
  eliminarButton.addEventListener("click", () => {
    carrito.splice(carrito.indexOf(producto), 1);
    carritoContainer.removeChild(card);
  });
  card.appendChild(eliminarButton);

  // Agrega la card al contenedor del carrito
  carritoContainer.appendChild(card);
}

////////////////////////////////form/////////////////////////

const formReserva = document.querySelector("#form-reserva");
const nombreInput = document.querySelector("#nombre");
const telefonoInput = document.querySelector("#telefono");
const seniaInput = document.querySelector("#senia");
const mensajeInput = document.querySelector("#mensaje");

formReserva.addEventListener("submit", (event) => {
  event.preventDefault();

  const reserva = {
    nombre: nombreInput.value,
    telefono: telefonoInput.value,
    senia: seniaInput.value,
    mensaje: mensajeInput.value,
  };

  // guardar reserva en el LocalStorage
  localStorage.setItem("reserva", JSON.stringify(reserva));

  // limpiar el formulario
  formReserva.reset();

  // mostrar mensaje de éxito
  alert("¡Reserva enviada con éxito!");
});

//////Finalizacion:

const enviarReservaButton = document.querySelector(".enviar-reserva");
enviarReservaButton.addEventListener("click", async (event) => {
  event.preventDefault();

  const formReserva = document.querySelector("#form-reserva");

  if (!formReserva.checkValidity()) {
    // Verifica si el formulario está completo
    Swal.fire({
      icon: "error",
      title: "complete formulario",
      showConfirmButton: false,
      timer: 1100,
      customClass: {
        popup: "my-custom-class",
      },
    });
    return;
  }

  if (carrito.length > 0) {
    // Verifica si el carrito tiene productos
    const { value: accept } = await Swal.fire({
      title: "Listo para demostrar tu humanidad?",
      input: "checkbox",
      inputValue: 1,
      inputPlaceholder: "SOY UN SER HUMANO",
      confirmButtonText: 'Continuar <i class="fa fa-arrow-right"></i>',
      confirmButtonColor: "green",
      inputValidator: (result) => {
        return !result && "CLick en el campo!";
      },
      timer: 5000,
      customClass: {
        popup: "my-custom-class",
      },
    });

    if (accept) {
      Swal.fire({
        title: "¡Gracias por confiar en nosotros!",
        confirmButtonColor: "green",
        timer: 3000,
        customClass: {
          popup: "my-custom-class",
        },
      });
    }

    // Obtener elementos form
    const seniaInput = document.getElementById("senia");
    const mensajeInput = document.getElementById("mensaje");

    formReserva.reset();
  }
});
