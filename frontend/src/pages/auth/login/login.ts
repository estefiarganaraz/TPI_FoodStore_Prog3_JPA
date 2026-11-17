import { guardarSesion, getUsuario } from '../../../utils/auth';
import type { Usuario } from '../../../types';

if (getUsuario()) location.href = '/src/pages/store/home/index.html';

document.getElementById('form')!.addEventListener('submit', async (e) => {
    e.preventDefault();
    const mail = (document.getElementById('mail') as HTMLInputElement).value.trim();
    const pass = (document.getElementById('pass') as HTMLInputElement).value;
    const err = document.getElementById('error')!;
    err.textContent = '';
    try {
        const users: Usuario[] = await fetch('/data/usuarios.json').then(r => r.json());
        const u = users.find(x => x.mail === mail && x.password === pass);
        if (!u) { err.textContent = 'Credenciales incorrectas'; return; }
        guardarSesion(u);
        location.href = u.rol === 'ADMIN'
            ? '/src/pages/admin/adminHome/index.html'
            : '/src/pages/store/home/index.html';
    } catch { err.textContent = 'Error al conectar'; }
});
