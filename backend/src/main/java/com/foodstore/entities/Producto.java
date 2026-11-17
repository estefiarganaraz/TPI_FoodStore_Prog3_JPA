package com.foodstore.entities;
import jakarta.persistence.*;

@Entity
public class Producto extends Base {
    private String nombre, descripcion, imagen;
    private double precio;
    private int stock;
    private boolean disponible;
    @ManyToOne private Categoria categoria;

    public Producto() {}
    public Producto(String n, double p, String d, int s, String i, boolean disp, Categoria c) {
        nombre=n; precio=p; descripcion=d; stock=s; imagen=i; disponible=disp; categoria=c;
    }
    public String getNombre() { return nombre; } public void setNombre(String n) { nombre=n; }
    public double getPrecio() { return precio; } public void setPrecio(double p) { precio=p; }
    public String getDescripcion() { return descripcion; } public void setDescripcion(String d) { descripcion=d; }
    public int getStock() { return stock; } public void setStock(int s) { stock=s; }
    public String getImagen() { return imagen; } public void setImagen(String i) { imagen=i; }
    public boolean isDisponible() { return disponible; } public void setDisponible(boolean d) { disponible=d; }
    public Categoria getCategoria() { return categoria; } public void setCategoria(Categoria c) { categoria=c; }
    @Override public String toString() { return id+" - "+nombre+" $"+precio+" stock="+stock+" ("+(disponible?"disp":"no disp")+")"; }
}
