import { requireAuth, logout } from '../../../utils/auth';
import type { Pedido, Usuario, Producto } from '../../../types';

if (!requireAuth('ADMIN')) throw 0;
document.getElementById('logout')!.onclick = () => { logout(); location.href = '/src/pages/auth/login/index.html'; };

let peds: Pedido[] = [];
let usuarios: Usuario[] = [];
let prods: Producto[] = [];
let filtro = '';

async function init() {
    usuarios = await fetch('/data/usuarios.json').then(r => r.json());
    prods = await fetch('/data/productos.json').then(r => r.json());
    const json = await fetch('/data/pedidos.json').then(r => r.json()) as Pedido[];
    const local: Pedido[] = JSON.parse(localStorage.getItem('foodstore_pedidos') || '[]');
    const cambios = JSON.parse(localStorage.getItem('admin_orders') || '{}');
    peds = [...json, ...local].map(p => ({ ...p, estado: cambios[p.id] ?? p.estado }))
        .sort((a,b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
    render();
}

function render() {
    const filtered = filtro ? peds.filter(p => p.estado === filtro) : peds;
    document.getElementById('list')!.innerHTML = filtered.length === 0
        ? '<div class="empty">Sin pedidos</div>'
        : filtered.map(p => {
            const u = usuarios.find(x => x.id === p.idUsuario);
            return `<div class="card" style="margin-bottom:1rem;cursor:pointer" data-id="${p.id}">
        <div style="display:flex;justify-content:space-between">
          <b>Pedido #${p.id}</b><span class="badge ${p.estado}">${p.estado}</span>
        </div>
        <p style="color:#666;font-size:.85rem">Cliente: ${u?.nombre ?? '?'} ${u?.apellido ?? ''}</p>
        <p style="color:#666;font-size:.85rem">${new Date(p.fecha).toLocaleString()}</p>
        <p style="color:#e85a4f;font-weight:600;margin-top:.4rem">$${p.total.toLocaleString()}</p>
      </div>`;
        }).join('');
    document.querySelectorAll('#list [data-id]').forEach(el => el.addEventListener('click', () => modal(Number(el.getAttribute('data-id')))));
}

function modal(id: number) {
    const p = peds.find(x => x.id === id)!;
    const u = usuarios.find(x => x.id === p.idUsuario);
    const m = document.getElementById('modal')!;
    const items = p.detalles.map(d => {
        const prod = prods.find(x => x.id === d.idProducto);
        return `<div style="display:flex;justify-content:space-between;margin-bottom:.3rem">
      <span>${prod?.nombre ?? '?'} x${d.cantidad}</span><b>$${d.subtotal.toLocaleString()}</b></div>`;
    }).join('');
    m.innerHTML = `<div class="modal-bg"><div class="modal">
    <h3>Pedido #${p.id}</h3>
    <p>Cliente: ${u?.nombre} ${u?.apellido}</p>
    <p>Fecha: ${new Date(p.fecha).toLocaleString()}</p>
    <p>Forma de pago: ${p.formaPago}</p>
    <hr style="margin:1rem 0">
    <h4>Productos</h4>${items}
    <div class="row total"><span>Total:</span><span>$${p.total.toLocaleString()}</span></div>
    <hr style="margin:1rem 0">
    <label>Cambiar estado:
      <select id="estado">
        ${['PENDIENTE','CONFIRMADO','TERMINADO','CANCELADO'].map(e =>
        `<option value="${e}" ${p.estado===e?'selected':''}>${e}</option>`).join('')}
      </select>
    </label>
    <button class="success" id="save" style="width:100%;margin-top:.75rem">Actualizar Estado</button>
    <button class="secondary" id="close" style="width:100%;margin-top:.5rem">Cerrar</button>
  </div></div>`;
    document.getElementById('close')!.onclick = () => m.innerHTML = '';
    document.getElementById('save')!.onclick = () => {
        const nuevoEstado = (document.getElementById('estado') as HTMLSelectElement).value;
        const cambios = JSON.parse(localStorage.getItem('admin_orders') || '{}');
        cambios[p.id] = nuevoEstado;
        localStorage.setItem('admin_orders', JSON.stringify(cambios));
        p.estado = nuevoEstado as any;
        m.innerHTML = ''; render();
    };
}

document.getElementById('filtro')!.addEventListener('change', e => {
    filtro = (e.target as HTMLSelectElement).value; render();
});
init();
