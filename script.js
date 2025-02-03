// Array para almacenar los productos en el carrito
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para actualizar la vista del carrito
document.addEventListener("DOMContentLoaded", () => {
    const productos = [
        {
            id: 1,
            nombre: "Araña",
            descripcion: "Adorno.",
            precio: 1000,
            precio_original: 3800,
            imagen: "https://i.imgur.com/kDUrsXD.jpeg"
        },
        {
            id: 2,
            nombre: "Perrito Articulado",
            descripcion: "Juguete impreso en 3D.",
            precio: 1000,
            precio_original: 3800,
            imagen: "producto2.jpg"
        }
    ];

    const contenedorProductos = document.querySelector(".productos");
    const carritoContador = document.getElementById("carrito-contador");
    const carritoLista = document.getElementById("carrito-lista");
    const carritoTotal = document.getElementById("carrito-total");
    const carritoDetalles = document.getElementById("carrito-detalles");
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    // Función para mostrar los productos en la tienda
    function cargarProductos() {
        contenedorProductos.innerHTML = "";
        productos.forEach(producto => {
            const productoHTML = `
                <div class="producto" data-id="${producto.id}" data-nombre="${producto.nombre}" data-precio="${producto.precio}">
                    <img src="${producto.imagen}" alt="${producto.nombre}" loading="lazy">
                    <h2>${producto.nombre}</h2>
                    <p>${producto.descripcion}</p>
                    <p class="producto">
                        <span class="off">Oferta</span> 
                        <span class="precio-container">
                            <span class="precio-original">$${producto.precio_original}</span>
                            <span class="precio-final">$${producto.precio}</span>
                        </span>
                    </p>
                    <button class="agregar-carrito">Agregar al carrito</button>
                </div>
            `;
            contenedorProductos.innerHTML += productoHTML;
        });

        // Agregar eventos a los botones de los productos
        document.querySelectorAll(".agregar-carrito").forEach(boton => {
            boton.addEventListener("click", agregarAlCarrito);
        });
    }

    // Función para actualizar el carrito
    function actualizarCarrito() {
        carritoLista.innerHTML = "";
        let total = 0;

        carrito.forEach(producto => {
            total += producto.precio * producto.cantidad;

            const item = document.createElement("div");
            item.innerHTML = `
                <p>${producto.nombre} x${producto.cantidad} - $${(producto.precio * producto.cantidad).toFixed(2)}</p>
                <button class="eliminar-item" data-id="${producto.id}">Eliminar</button>
            `;
            carritoLista.appendChild(item);
        });

        carritoContador.textContent = carrito.length;
        carritoTotal.textContent = `$${total.toFixed(2)}`;
        carritoDetalles.style.display = carrito.length > 0 ? "block" : "none";
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }

    // Función para agregar un producto al carrito
    function agregarAlCarrito(event) {
        const productoElemento = event.target.closest(".producto");
        const id = productoElemento.getAttribute("data-id");
        const nombre = productoElemento.getAttribute("data-nombre");
        const precio = parseFloat(productoElemento.getAttribute("data-precio"));

        const productoExistente = carrito.find(item => item.id === id);

        if (productoExistente) {
            productoExistente.cantidad++;
        } else {
            carrito.push({ id, nombre, precio, cantidad: 1 });
        }

        actualizarCarrito();
    }

    // Función para eliminar un producto del carrito
    carritoLista.addEventListener("click", event => {
        if (event.target.classList.contains("eliminar-item")) {
            const id = event.target.getAttribute("data-id");
            carrito = carrito.filter(item => item.id !== id);
            actualizarCarrito();
        }
    });

    // Función para vaciar el carrito
    document.getElementById("vaciar-carrito").addEventListener("click", () => {
        carrito = [];
        actualizarCarrito();
    });

    // Función para enviar el pedido por WhatsApp
    document.getElementById("boton-comprar").addEventListener("click", () => {
        if (carrito.length === 0) {
            alert("Tu carrito está vacío.");
            return;
        }

        let mensaje = "¡Hola! Me gustaría comprar los siguientes productos:\n\n";
        carrito.forEach(producto => {
            mensaje += `- ${producto.nombre} (x${producto.cantidad}) - $${(producto.precio * producto.cantidad).toFixed(2)}\n`;
        });

        mensaje += `\nTotal: $${carrito.reduce((total, p) => total + p.precio * p.cantidad, 0).toFixed(2)}\n\n¡Gracias!`;

        const telefono = "3512965608"; // Cambia este número
        const enlaceWhatsApp = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
        window.open(enlaceWhatsApp, "_blank");
    });

    // Cargar los productos dinámicamente al iniciar la página
    cargarProductos();
    actualizarCarrito();
});
