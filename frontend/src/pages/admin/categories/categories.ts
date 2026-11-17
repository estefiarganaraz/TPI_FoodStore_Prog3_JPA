import { requireAuth, logout } from '../../../utils/auth';
import type { Categoria } from '../../../types';

if (!requireAuth('ADMIN')) throw 0;
document.getElementById('logout')!.onclick = () => { logout(); location.href = '/src/pages/auth/login/index.html'; };

let cats: Categoria[] = JSON.parse(localStorage.getItem('admin_cats') || 'null') || [];

async function init() {
    if (cats.length === 0) {
        cats = await fetch('/data/categorias.json').then(r => r.json());
        localStorage.setItem('admin_cats', JSON.stringify(cats));
    }
    render();
}

function render() {
    const t = document.getElementById('tabla')!;
    t.innerHTML = `<tr><th>ID</th><th>Imagen</th><th>Nombre</th><th>Descripcion</th><th>Acciones</th></tr>` +
        cats.filter(c => !c.eliminado).map(c => `
      <tr><td>${c.id}</td><td><img src="${c.imagen}" style="width:50px;height:35px;object-fit:cover;border-radius:4px"></td>
      <td>${c.nombre}</td><td>${c.descripcion}</td>
      <td><button class="secondary" data-edit="${c.id}">Editar</button>
      <button class="danger" data-del="${c.id}">Eliminar</button></td></tr>`).join('');
    t.querySelectorAll('[data-edit]').forEach(b => b.addEventListener('click', () => modal(Number(b.getAttribute('data-edit')))));
    t.querySelectorAll('[data-del]').forEach(b => b.addEventListener('click', () => {
        const id = Number(b.getAttribute('data-del'));
        const c = cats.find(x => x.id === id)!; c.eliminado = true;
        localStorage.setItem('admin_cats', JSON.stringify(cats));
        render();
    }));
}

function modal(id?: number) {
    const c = id ? cats.find(x => x.id === id) : null;
    const m = document.getElementById('modal')!;
    m.innerHTML = `<div class="modal-bg"><div class="modal">
    <h3>${c ? 'Editar' : 'Nueva'} Categoria</h3>
    <form id="mf" style="display:flex;flex-direction:column;gap:.75rem">
      <input id="n" placeholder="Nombre" value="${c?.nombre ?? ''}" required>
      <input id="d" placeholder="Descripcion" value="${c?.descripcion ?? ''}" required>
      <input id="i" placeholder="URL imagen" value="${c?.imagen ?? ''}">
      <button>Guardar</button>
      <button type="button" class="secondary" id="cancel">Cancelar</button>
    </form></div></div>`;
    document.getElementById('cancel')!.onclick = () => m.innerHTML = '';
    document.getElementById('mf')!.addEventListener('submit', e => {
        e.preventDefault();
        const n = (document.getElementById('n') as HTMLInputElement).value.trim();
        const d = (document.getElementById('d') as HTMLInputElement).value.trim();
        const i = (document.getElementById('i') as HTMLInputElement).value.trim();
        if (c) { c.nombre = n; c.descripcion = d; c.imagen = i; }
        else cats.push({ id: Date.now(), nombre: n, descripcion: d, imagen: i || 'https://placehold.co/300x200', eliminado: false });
        localStorage.setItem('admin_cats', JSON.stringify(cats));
        m.innerHTML = ''; render();
    });
}

document.getElementById('nuevo')!.onclick = () => modal();
init();