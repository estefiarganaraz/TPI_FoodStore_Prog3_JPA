import type { Usuario } from '../types';
const KEY = 'foodstore_user';

export function guardarSesion(u: Usuario) {
    const { password, ...safe } = u;
    localStorage.setItem(KEY, JSON.stringify(safe));
}
export function getUsuario(): Omit<Usuario,'password'> | null {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
}
export function logout() { localStorage.removeItem(KEY); }
export function requireAuth(rol?: Rol): Omit<Usuario,'password'> | null {
    const u = getUsuario();
    if (!u) { location.href = '/src/pages/auth/login/index.html'; return null; }
    if (rol && u.rol !== rol) { location.href = '/src/pages/store/home/index.html'; return null; }
    return u;
}
type Rol = 'ADMIN' | 'USUARIO';