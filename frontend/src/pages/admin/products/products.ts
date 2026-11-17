import { requireAuth, logout } from '../../../utils/auth';
import type { Producto, Categoria } from '../../../types';

if (!requireAuth('ADMIN')) throw 0;
document.getElementById('logout')!.onclick = () => { logout(); location.href = '/src/pages/auth/login/index.html'; };

let prods: Producto[] = [];
let cats: Categoria[] = [];

async function init() {
    // 1.Cargar categorías para el select
    cats = await fetch('/data/categorias.json').then(r => r.json());

    // 2.Verificar si hay productos guardados en localStorage
    const stored = localStorage.getItem('admin_prods');

    if (stored && JSON.parse(stored).length > 0) {
        prods = JSON.parse(stored);
    } else {
        // Si no hay nada (o está vacío), traer del JSON original
        prods = await fetch('/data/productos.json').then(r => r.json());
        localStorage.setItem('admin_prods', JSON.stringify(prods));
    }

    render();
}

function render() {
    const t = document.getElementById('tabla')!;

    // Si no hay productos, mostrar un mensaje
    if (prods.length === 0) {
        t.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:#999">No hay productos cargados</td></tr>`;
        return;
    }

    t.innerHTML = `<tr><th>ID</th><th>Img</th><th>Nombre</th><th>Precio</th><th>Categoría</th><th>Stock</th><th>Estado</th><th>Acciones</th></tr>` +
        prods.filter(p => !p.eliminado).map(p => `
      <tr>
        <td>${p.id}</td>
        <td><img src="${p.imagen}" style="width:50px;height:35px;object-fit:cover;border-radius:4px" onerror="this.src='https://placehold.co/50x35'"></td>
        <td>${p.nombre}</td>
        <td>$${p.precio.toLocaleString()}</td>
        <td>${cats.find(c=>c.id===p.categoriaId)?.nombre ?? '-'}</td>
        <td>${p.stock}</td>
        <td><span class="badge ${p.disponible?'TERMINADO':'CANCELADO'}">${p.disponible?'Activo':'Inactivo'}</span></td>
        <td>
          <button class="secondary" data-edit="${p.id}">Editar</button>
          <button class="danger" data-del="${p.id}">Eliminar</button>
        </td>
      </tr>`).join('');

    // Eventos de los botones
    t.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => {
        modal(Number(b.getAttribute('data-edit')));
    }));

    t.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
        const id = Number(b.getAttribute('data-del'));
        const p = prods.find(x => x.id === id)!;
        p.eliminado = true;
        localStorage.setItem('admin_prods', JSON.stringify(prods));
        render();
    }));
}

function modal(id?: number) {
    const p = id ? prods.find(x => x.id === id) : null;
    const m = document.getElementById('modal')!;
    const opts = cats.filter(c=>!c.eliminado).map(c =>
        `<option value="${c.id}" ${p?.categoriaId===c.id?'selected':''}>${c.nombre}</option>`
    ).join('');

    m.innerHTML = `<div class="modal-bg"><div class="modal">
    <h3>${p ? 'Editar' : 'Nuevo'} Producto</h3>
    <form id="mf" style="display:flex;flex-direction:column;gap:.75rem">
      <input id="n" placeholder="Nombre" value="${p?.nombre ?? ''}" required>
      <input id="d" placeholder="Descripción" value="${p?.descripcion ?? ''}" required>
      <input id="pr" type="number" placeholder="Precio" value="${p?.precio ?? ''}" required>
      <input id="s" type="number" placeholder="Stock" value="${p?.stock ?? ''}" required>
      <select id="c" required><option value="">Categoría...</option>${opts}</select>
      <input id="i" placeholder="URL imagen" value="${p?.imagen ?? ''}">
      <label><input id="disp" type="checkbox" ${p?.disponible!==false?'checked':''} style="width:auto"> Disponible</label>
      <button>Guardar</button>
      <button type="button" class="secondary" id="cancel">Cancelar</button>
    </form>
  </div></div>`;

    document.getElementById('cancel')!.onclick = () => m.innerHTML = '';

    document.getElementById('mf')!.addEventListener('submit', e => {
        e.preventDefault();
        const g = (id: string) => (document.getElementById(id) as HTMLInputElement).value;

        const data: Producto = {
            id: p?.id ?? Date.now(),
            nombre: g('n'),
            descripcion: g('d'),
            precio: Number(g('pr')),
            stock: Number(g('s')),
            categoriaId: Number(g('c')),
            imagen: g('i') || 'https://placehold.co/400x300',
            disponible: (document.getElementById('disp') as HTMLInputElement).checked,
            eliminado: false
        };

        if (p) {
            Object.assign(p, data);
        } else {
            prods.push(data);
        }

        localStorage.setItem('admin_prods', JSON.stringify(prods));
        m.innerHTML = '';
        render();
    });
}

document.getElementById('nuevo')!.onclick = () => modal();
init();
