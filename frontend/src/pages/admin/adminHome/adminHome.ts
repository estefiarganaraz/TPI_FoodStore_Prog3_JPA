import { requireAuth, logout } from '../../../utils/auth';
import type { Categoria, Producto, Pedido } from '../../../types';

if (!requireAuth('ADMIN')) throw 0;
document.getElementById('logout')!.onclick = () => { logout(); location.href = '/src/pages/auth/login/index.html'; };

async function cargar() {
    const [cats, prods, pedsJson] = await Promise.all([
        fetch('/data/categorias.json').then(r => r.json()) as Promise<Categoria[]>,
        fetch('/data/productos.json').then(r => r.json()) as Promise<Producto[]>,
        fetch('/data/pedidos.json').then(r => r.json()) as Promise<Pedido[]>
    ]);
    const localPeds: Pedido[] = JSON.parse(localStorage.getItem('foodstore_pedidos') || '[]');
    const peds = [...pedsJson, ...localPeds];
    document.getElementById('stats')!.innerHTML = `
    <div class="stat-card"><h4>Categorias</h4><div class="num">${cats.length}</div></div>
    <div class="stat-card"><h4>Productos</h4><div class="num">${prods.length}</div></div>
    <div class="stat-card"><h4>Pedidos</h4><div class="num">${peds.length}</div></div>
    <div class="stat-card"><h4>Disponibles</h4><div class="num">${prods.filter(p=>p.disponible).length}</div></div>`;
    const porEstado = ['PENDIENTE','CONFIRMADO','TERMINADO','CANCELADO']
        .map(e => `<div class="row"><span>${e}:</span><b>${peds.filter(p=>p.estado===e).length}</b></div>`).join('');
    document.getElementById('resumen')!.innerHTML = `
    <div class="row"><span>Categorias activas:</span><b>${cats.filter(c=>!c.eliminado).length}</b></div>
    <div class="row"><span>Productos activos:</span><b>${prods.filter(p=>!p.eliminado).length}</b></div>
    <div class="row"><span>Productos inactivos:</span><b>${prods.filter(p=>p.eliminado).length}</b></div>
    <hr style="margin:.5rem 0">${porEstado}`;
}
cargar();
