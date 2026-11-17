import { requireAuth, logout } from '../../../utils/auth';
import { totalItems } from '../../../utils/cart';
import type { Categoria, Producto } from '../../../types';

if (!requireAuth()) throw 0;
document.getElementById('badge')!.textContent = String(totalItems());
document.getElementById('logout')!.onclick = () => { logout(); location.href = '/src/pages/auth/login/index.html'; };

let productos: Producto[] = [];
let filtroCat: number | null = null;
let busqueda = '';
let orden = 'az';

async function cargar() {
    const [cats, prods] = await Promise.all([
        fetch('/data/categorias.json').then(r => r.json()) as Promise<Categoria[]>,
        fetch('/data/productos.json').then(r => r.json()) as Promise<Producto[]>
    ]);
    productos = prods.filter(x => x.disponible && !x.eliminado);
    const sidebar = document.getElementById('cats')!;
    sidebar.innerHTML = `<button data-id="all" class="active">Todas</button>` +
        cats.filter(c => !c.eliminado).map(c => `<button data-id="${c.id}">${c.nombre}</button>`).join('');
    sidebar.querySelectorAll('button').forEach(b => b.onclick = () => {
        sidebar.querySelectorAll('button').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        const id = b.getAttribute('data-id')!;
        filtroCat = id === 'all' ? null : Number(id);
        render();
    });
    render();
}

function render() {
    let list = [...productos];
    if (filtroCat) list = list.filter(p => p.categoriaId === filtroCat);
    if (busqueda) list = list.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase()));
    list.sort((a,b) => orden === 'az' ? a.nombre.localeCompare(b.nombre)
        : orden === 'za' ? b.nombre.localeCompare(a.nombre)
            : orden === 'pa' ? a.precio - b.precio : b.precio - a.precio);
    document.getElementById('grid')!.innerHTML = list.length === 0
        ? '<div class="empty">Sin productos</div>'
        : list.map(p => `
      <div class="product-card" onclick="location.href='../productDetail/index.html?id=${p.id}'">
        <img src="${p.imagen}" alt="${p.nombre}">
        <div class="info"><h3>${p.nombre}</h3><p>${p.descripcion}</p>
        <b>$${p.precio.toLocaleString()}</b></div>
      </div>`).join('');
}

document.getElementById('buscar')!.addEventListener('input', e => { busqueda = (e.target as HTMLInputElement).value; render(); });
document.getElementById('orden')!.addEventListener('change', e => { orden = (e.target as HTMLSelectElement).value; render(); });
cargar();