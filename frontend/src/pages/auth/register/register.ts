import type { Usuario } from '../../../types';
import { guardarSesion } from '../../../utils/auth';

document.getElementById('form')!.addEventListener('submit', async (e) => {
    e.preventDefault();
    const g = (id: string) => (document.getElementById(id) as HTMLInputElement).value.trim();
    const err = document.getElementById('error')!;
    err.textContent = '';
    const users: Usuario[] = await fetch('/data/usuarios.json').then(r => r.json());
    if (users.some(u => u.mail === g('mail'))) { err.textContent = 'Email ya registrado'; return; }
    const nuevo: Usuario = {
        id: Date.now(), nombre: g('nombre'), apellido: g('apellido'),
        mail: g('mail'), celular: g('celular'), password: g('pass'), rol: 'USUARIO'
    };
    guardarSesion(nuevo);
    location.href = '/src/pages/store/home/index.html';
});