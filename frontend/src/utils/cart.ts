import type { CartItem, Producto } from '../types';
const KEY = 'foodstore_cart';

export function getCart(): CartItem[] { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
export function setCart(items: CartItem[]) { localStorage.setItem(KEY, JSON.stringify(items)); }
export function agregar(p: Producto, cant: number) {
    const cart = getCart();
    const ex = cart.find(c => c.producto.id === p.id);
    if (ex) ex.cantidad = Math.min(ex.cantidad + cant, p.stock);
    else cart.push({ producto: p, cantidad: Math.min(cant, p.stock) });
    setCart(cart);
}
export function quitar(id: number) { setCart(getCart().filter(c => c.producto.id !== id)); }
export function vaciar() { localStorage.removeItem(KEY); }
export function totalItems() { return getCart().reduce((s,c) => s + c.cantidad, 0); }
export function subtotal() { return getCart().reduce((s,c) => s + c.producto.precio * c.cantidad, 0); }