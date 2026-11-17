import { requireAuth } from '../../../utils/auth';
import { totalItems } from '../../../utils/cart';
import type { Pedido, Producto } from '../../../types';

const user = requireAuth(); if (!user) throw 0;
document.getElementById('badge')!.textContent = String(totalItems());

async function cargar() {
    const prods: Producto[] = await fetch('/data/productos.json').then(r => r.json());
    const jsonPedidos: Pedido[] = await fetch('/data/pedidos.json').then(r => r.json());
    const localPedidos: Pedido[] = JSON.parse(localStorage.getItem('foodstore_pedidos') || '[]');
    const all = [...jsonPedidos, ...localPedidos];
    const mios = all.filter(p => p.idUsuario === user.id)
        .sort((a,b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    const cont = document.getElementById('orders')!;
    if (mios.length === 0) {
        cont.innerHTML = `<div class="empty"><p>No tenés pedidos aún</p>
      <button onclick="location.href='../../store/home/index.html'" style="margin-top:1rem">Ir a la tienda</button></div>`;
        return;
    }
    cont.innerHTML = mios.map(p => {
        const resumen = p.detalles.slice(0,3).map(d => {
            const prod = prods.find(x => x.id === d.idProducto);
            return `${prod?.nombre ?? '?'} x${d.cantidad}`;
        }).join(' · ');
        return `<div class="card" style="margin-bottom:1rem;cursor:pointer" data-id="${p.id}">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:.5rem">
        <b>Pedido #${p.id}</b>
        <span class="badge ${p.estado}">${p.estado}</span>
      </div>
      <p style="color:#666;font-size:.85rem">${new Date(p.fecha).toLocaleString()}</p>
      <p style="font-size:.9rem;margin:.4rem 0">${resumen}</p>
      <p style="color:#e85a4f;font-weight:600;text-align:right">$${p.total.toLocaleString()}</p>
    </div>`;
    }).join('');
    cont.querySelectorAll('[data-id]').forEach(el => el.addEventListener('click', () => {
        const ped = mios.find(x => x.id === Number(el.getAttribute('data-id')))!;
        abrirModal(ped, prods);
    }));
}

function abrirModal(p: Pedido, prods: Producto[]) {
    const modal = document.getElementById('modal')!;
    const items = p.detalles.map(d => {
        const prod = prods.find(x => x.id === d.idProducto);
        return `<div style="display:flex;justify-content:space-between;margin-bottom:.5rem">
      <span>${prod?.nombre ?? '?'} x${d.cantidad}</span><b>$${d.subtotal.toLocaleString()}</b></div>`;
    }).join('');
    modal.innerHTML = `<div class="modal-bg"><div class="modal">
    <h3>Pedido #${p.id}</h3>
    <p>Estado: <span class="badge ${p.estado}">${p.estado}</span></p>
    <p style="margin:.5rem 0">Fecha: ${new Date(p.fecha).toLocaleString()}</p>
    <p style="margin:.5rem 0">Forma de pago: ${p.formaPago}</p>
    <hr style="margin:1rem 0">
    <h4 style="margin-bottom:.5rem">Productos</h4>${items}
    <div class="row total"><span>Total:</span><span>$${p.total.toLocaleString()}</span></div>
    <button class="secondary" style="width:100%;margin-top:1rem" id="close">Cerrar</button>
  </div></div>`;
    document.getElementById('close')!.onclick = () => modal.innerHTML = '';
}
cargar();