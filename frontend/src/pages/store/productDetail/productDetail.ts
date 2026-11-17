import { requireAuth } from '../../../utils/auth';
import { agregar, totalItems } from '../../../utils/cart';
import type { Producto } from '../../../types';

if (!requireAuth()) throw 0;
document.getElementById('badge')!.textContent = String(totalItems());

const id = Number(new URLSearchParams(location.search).get('id'));

async function cargar() {
    const prods: Producto[] = await fetch('/data/productos.json').then(r => r.json());
    const p = prods.find(x => x.id === id && !x.eliminado);
    const cont = document.getElementById('detail')!;
    if (!p) { cont.innerHTML = '<div class="empty">Producto no encontrado</div>'; return; }
    const puedeAgregar = p.disponible && p.stock > 0;
    cont.innerHTML = `
    <div style="display:flex;gap:2rem;flex-wrap:wrap">
      <img src="${p.imagen}" style="width:380px;border-radius:12px">
      <div style="flex:1;min-width:280px">
        <h2 style="margin-bottom:.5rem">${p.nombre}</h2>
        <p style="color:#666;margin-bottom:1rem">${p.descripcion}</p>
        <p style="font-size:1.8rem;color:#e85a4f;font-weight:700">$${p.precio.toLocaleString()}</p>
        <p style="margin:.5rem 0">Stock: ${p.stock} | <span class="badge ${p.disponible?'TERMINADO':'CANCELADO'}">${p.disponible?'DISPONIBLE':'NO DISPONIBLE'}</span></p>
        <div class="qty" style="margin:1rem 0">
          <button id="menos">-</button>
          <input id="cant" type="number" value="1" min="1" max="${p.stock}" style="width:70px;text-align:center">
          <button id="mas">+</button>
        </div>
        <button id="add" ${puedeAgregar?'':'disabled'} style="width:100%;margin-bottom:.5rem">Agregar al carrito</button>
        <button class="secondary" style="width:100%" onclick="location.href='../home/index.html'">Volver</button>
        <p id="msg" style="color:#2ecc71;margin-top:1rem"></p>
      </div>
    </div>`;
    const cant = document.getElementById('cant') as HTMLInputElement;
    document.getElementById('menos')!.onclick = () => { cant.value = String(Math.max(1, Number(cant.value)-1)); };
    document.getElementById('mas')!.onclick = () => { cant.value = String(Math.min(p.stock, Number(cant.value)+1)); };
    document.getElementById('add')!.onclick = () => {
        const c = Math.max(1, Math.min(p.stock, Number(cant.value)));
        agregar(p, c);
        document.getElementById('badge')!.textContent = String(totalItems());
        document.getElementById('msg')!.textContent = `✔ Agregado (${c} unidad${c>1?'es':''})`;
    };
}
cargar();