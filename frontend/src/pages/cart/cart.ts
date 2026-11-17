import { requireAuth } from '../../utils/auth';
import { getCart, setCart, vaciar, totalItems } from '../../utils/cart';
import { ENVIO } from '../../utils/config';
import type { Pedido, FormaPago } from '../../types';

const user = requireAuth(); if (!user) throw 0;
document.getElementById('badge')!.textContent = String(totalItems());

function render() {
    const items = getCart();
    const cont = document.getElementById('items')!;
    const summary = document.getElementById('summary')!;
    if (items.length === 0) {
        cont.innerHTML = `<div class="empty"><p>Tu carrito esta vacio</p>
      <button onclick="location.href='../store/home/index.html'" style="margin-top:1rem">Ir a la tienda</button></div>`;
        summary.style.display = 'none';
        return;
    }
    summary.style.display = 'block';
    cont.innerHTML = items.map(it => `
    <div class="cart-item">
      <img src="${it.producto.imagen}">
      <div class="info"><h3>${it.producto.nombre}</h3><p style="color:#e85a4f">$${it.producto.precio.toLocaleString()} c/u</p></div>
      <div class="qty">
        <button data-menos="${it.producto.id}">-</button>
        <span>${it.cantidad}</span>
        <button data-mas="${it.producto.id}">+</button>
      </div>
      <b style="margin-left:1rem">$${(it.producto.precio*it.cantidad).toLocaleString()}</b>
      <button class="danger" data-del="${it.producto.id}">✕</button>
    </div>`).join('');
    cont.querySelectorAll('[data-menos]').forEach(b => b.addEventListener('click', () => {
        const id = Number(b.getAttribute('data-menos'));
        const cart = getCart(); const it = cart.find(c => c.producto.id === id)!;
        if (it.cantidad > 1) it.cantidad--; else cart.splice(cart.indexOf(it),1);
        setCart(cart); render();
    }));
    cont.querySelectorAll('[data-mas]').forEach(b => b.addEventListener('click', () => {
        const id = Number(b.getAttribute('data-mas'));
        const cart = getCart(); const it = cart.find(c => c.producto.id === id)!;
        if (it.cantidad < it.producto.stock) it.cantidad++;
        setCart(cart); render();
    }));
    cont.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
        const id = Number(b.getAttribute('data-del'));
        setCart(getCart().filter(c => c.producto.id !== id)); render();
    }));
    const sub = items.reduce((s,c) => s + c.producto.precio*c.cantidad, 0);
    document.getElementById('sub')!.textContent = '$' + sub.toLocaleString();
    document.getElementById('env')!.textContent = '$' + ENVIO.toLocaleString();
    document.getElementById('tot')!.textContent = '$' + (sub + ENVIO).toLocaleString();
    document.getElementById('badge')!.textContent = String(totalItems());
}

document.getElementById('vaciar')!.onclick = () => { if (confirm('¿Vaciar carrito?')) { vaciar(); render(); } };

document.getElementById('checkout')!.onclick = () => {
    const modal = document.getElementById('modal')!;
    const items = getCart();
    const sub = items.reduce((s,c) => s + c.producto.precio*c.cantidad, 0);
    modal.innerHTML = `
    <div class="modal-bg"><div class="modal">
      <h3>Completar Pedido</h3>
      <form id="checkout-form" style="display:flex;flex-direction:column;gap:.75rem">
        <input id="tel" placeholder="Telefono" required>
        <input id="dir" placeholder="Direccion de entrega" required>
        <select id="pago" required>
          <option value="">Forma de pago...</option>
          <option value="EFECTIVO">Efectivo</option>
          <option value="TARJETA">Tarjeta</option>
          <option value="TRANSFERENCIA">Transferencia</option>
        </select>
        <textarea id="notas" placeholder="Notas adicionales (opcional)" rows="2"></textarea>
        <div class="row total"><span>Total:</span><span>$${(sub+ENVIO).toLocaleString()}</span></div>
        <button class="success">Confirmar Pedido</button>
        <button type="button" class="secondary" id="cancel">Cancelar</button>
      </form>
    </div></div>`;
    document.getElementById('cancel')!.onclick = () => modal.innerHTML = '';
    document.getElementById('checkout-form')!.addEventListener('submit', (e) => {
        e.preventDefault();
        const pedidos: Pedido[] = JSON.parse(localStorage.getItem('foodstore_pedidos') || '[]');
        const nuevo: Pedido = {
            id: Date.now(), fecha: new Date().toISOString(), estado: 'PENDIENTE',
            total: sub + ENVIO, formaPago: (document.getElementById('pago') as HTMLSelectElement).value as FormaPago,
            idUsuario: user.id,
            detalles: items.map(i => ({ idProducto: i.producto.id, cantidad: i.cantidad, subtotal: i.producto.precio*i.cantidad }))
        };
        pedidos.push(nuevo);
        localStorage.setItem('foodstore_pedidos', JSON.stringify(pedidos));
        vaciar();
        alert('¡Pedido confirmado!');
        location.href = '../client/orders/index.html';
    });
};

render();