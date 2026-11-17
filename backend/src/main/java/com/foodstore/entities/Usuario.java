package com.foodstore.entities;
import jakarta.persistence.*;
import java.util.*;

@Entity
public class Usuario extends Base {
    private String nombre, apellido, mail, celular, password;
    @Enumerated(EnumType.STRING) private Rol rol;
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    private List<Pedido> pedidos = new ArrayList<>();

    public Usuario() {}
    public Usuario(String n, String a, String m, String c, String p, Rol r) {
        nombre=n; apellido=a; mail=m; celular=c; password=p; rol=r;
    }
    public String getNombre() { return nombre; } public void setNombre(String n) { nombre=n; }
    public String getApellido() { return apellido; } public void setApellido(String a) { apellido=a; }
    public String getMail() { return mail; } public void setMail(String m) { mail=m; }
    public String getCelular() { return celular; } public void setCelular(String c) { celular=c; }
    public String getPassword() { return password; } public void setPassword(String p) { password=p; }
    public Rol getRol() { return rol; } public void setRol(Rol r) { rol=r; }
    public List<Pedido> getPedidos() { return pedidos; }
    @Override public String toString() { return id+" - "+nombre+" "+apellido+" | "+mail+" | "+rol; }
}