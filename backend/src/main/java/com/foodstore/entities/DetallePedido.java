package com.foodstore.entities;
import jakarta.persistence.*;

@Entity
public class DetallePedido extends Base {
    private int cantidad;
    private double subtotal;
    @ManyToOne private Producto producto;
    @ManyToOne private Pedido pedido;

    public DetallePedido() {}
    public DetallePedido(Producto p, int c) { producto=p; cantidad=c; subtotal=p.getPrecio()*c; }
    public int getCantidad() { return cantidad; } public void setCantidad(int c) { cantidad=c; }
    public double getSubtotal() { return subtotal; } public void setSubtotal(double s) { subtotal=s; }
    public Producto getProducto() { return producto; } public void setProducto(Producto p) { producto=p; }
    public Pedido getPedido() { return pedido; } public void setPedido(Pedido p) { pedido=p; }
}
