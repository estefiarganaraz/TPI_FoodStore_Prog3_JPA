package com.foodstore.entities;
import jakarta.persistence.*;
import java.util.*;

@Entity
public class Categoria extends Base {
    private String nombre, descripcion, imagen;
    @OneToMany(mappedBy = "categoria", cascade = CascadeType.ALL)
    private List<Producto> productos = new ArrayList<>();

    public Categoria() {}
    public Categoria(String n, String d, String i) { nombre=n; descripcion=d; imagen=i; }
    public String getNombre() { return nombre; } public void setNombre(String n) { nombre=n; }
    public String getDescripcion() { return descripcion; } public void setDescripcion(String d) { descripcion=d; }
    public String getImagen() { return imagen; } public void setImagen(String i) { imagen=i; }
    public List<Producto> getProductos() { return productos; }
    @Override public String toString() { return id+" - "+nombre+" | "+descripcion; }
}
