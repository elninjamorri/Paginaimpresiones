// Array para almacenar los productos en el carrito
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para actualizar la vista del carrito
function actualizarCarrito() {
    const contador = document.getElementById('carrito-contador');
    const carritoLista = document.getElementById('carrito-lista');
    const totalCarrito = document.getElementById('carrito-total');
    const carritoDetalles = document.getElementById('carrito-detalles');

    // Limpiar la lista del carrito
    carritoLista.innerHTML = '';

    let total = 0;
    
    // Mostrar cada producto del carrito
    carrito.forEach(producto => {
        total += producto.precio * producto.cantidad;

        const itemCarrito = document.createElement('div');
        itemCarrito.classList.add('item-carrito');
        itemCarrito.innerHTML = `
            <p>${producto.nombre} x${producto.cantidad} - $${(producto.precio * producto.cantidad).toFixed(2)}</p>
            <button class="eliminar-item" data-id="${producto.id}">Eliminar</button>
        `;
        carritoLista.appendChild(itemCarrito);
    });

    // Actualizar el contador de productos y el total
    contador.textContent = carrito.length;
    totalCarrito.textContent = `$${total.toFixed(2)}`;

    // Mostrar el carrito si hay productos
    if (carrito.length > 0) {
        carritoDetalles.style.display = 'block';
    } else {
        carritoDetalles.style.display = 'none';
    }

    // Guardar el carrito en el localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// Función para agregar productos al carrito
function agregarAlCarrito(event) {
    const producto = event.target.closest('.producto');
    const id = producto.getAttribute('data-id');
    const nombre = producto.getAttribute('data-nombre');
    const precio = parseFloat(producto.getAttribute('data-precio'));

    // Verificar si el producto ya está en el carrito
    const productoExistente = carrito.find(item => item.id === id);

    if (productoExistente) {
        productoExistente.cantidad++;
    } else {
        carrito.push({ id, nombre, precio, cantidad: 1 });
    }

    actualizarCarrito();
}

// Función para eliminar un producto del carrito
function eliminarProducto(event) {
    if (event.target.classList.contains('eliminar-item')) {
        const id = event.target.getAttribute('data-id');
        carrito = carrito.filter(item => item.id !== id);
        actualizarCarrito();
    }
}

// Función para vaciar el carrito
function vaciarCarrito() {
    carrito = [];
    actualizarCarrito();
}

// Agregar eventos a los botones
document.querySelectorAll('.agregar-carrito').forEach(boton => {
    boton.addEventListener('click', agregarAlCarrito);
});

document.getElementById('carrito-lista').addEventListener('click', eliminarProducto);
document.getElementById('vaciar-carrito').addEventListener('click', vaciarCarrito);

// Inicializar el carrito
actualizarCarrito();

// Función para generar el mensaje de WhatsApp con los productos del carrito
function generarMensajeWhatsApp() {
    // Verificar si hay productos en el carrito
    if (carrito.length === 0) {
        alert('Tu carrito está vacío.');
        return;
    }

    // Generar el mensaje con los productos y sus precios
    let mensaje = '¡Hola! Me gustaría comprar los siguientes productos:\n\n';

    carrito.forEach(producto => {
        mensaje += `- ${producto.nombre} (x${producto.cantidad}) - $${(producto.precio * producto.cantidad).toFixed(2)}\n`;
    });

    // Añadir mensaje final
    mensaje += `\nTotal: $${calcularTotal()}\n\n¡Gracias!`;

    // Crear el enlace de WhatsApp con el mensaje
    const telefono = '3512965608'; // Cambia este número por el tuyo o el número de contacto
    const mensajeCodificado = encodeURIComponent(mensaje);
    const enlaceWhatsApp = `https://wa.me/${telefono}?text=${mensajeCodificado}`;

    // Abrir el enlace en una nueva pestaña
    window.open(enlaceWhatsApp, '_blank');
}

// Función para calcular el total del carrito
function calcularTotal() {
    let total = 0;
    carrito.forEach(producto => {
        total += producto.precio * producto.cantidad;
    });
    return total.toFixed(2); // Formatear a 2 decimales
}

// Evento para el botón de compra
const botonComprar = document.getElementById('boton-comprar');
botonComprar.addEventListener('click', generarMensajeWhatsApp);
