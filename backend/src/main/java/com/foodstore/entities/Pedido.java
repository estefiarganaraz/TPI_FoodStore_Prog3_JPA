package com.foodstore.entities;
import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.*;

@Entity
public class Pedido extends Base {
    private LocalDate fecha;
    @Enumerated(EnumType.STRING) private Estado estado;
    private double total;
    @Enumerated(EnumType.STRING) private FormaPago formaPago;
    @ManyToOne private Usuario usuario;
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetallePedido> detalles = new ArrayList<>();

    public Pedido() {}
    public Pedido(LocalDate f, Estado e, FormaPago fp, Usuario u) { fecha=f; estado=e; formaPago=fp; usuario=u; }
    public LocalDate getFecha() { return fecha; } public void setFecha(LocalDate f) { fecha=f; }
    public Estado getEstado() { return estado; } public void setEstado(Estado e) { estado=e; }
    public double getTotal() { return total; } public void setTotal(double t) { total=t; }
    public FormaPago getFormaPago() { return formaPago; } public void setFormaPago(FormaPago f) { formaPago=f; }
    public Usuario getUsuario() { return usuario; } public void setUsuario(Usuario u) { usuario=u; }
    public List<DetallePedido> getDetalles() { return detalles; }
    public void addDetalle(DetallePedido d) { d.setPedido(this); detalles.add(d); total += d.getSubtotal(); }
    @Override public String toString() {
        return id+" - "+fecha+" | "+estado+" | $"+total+" | "+formaPago+" | "+(usuario!=null?usuario.getNombre():"-");
    }
}