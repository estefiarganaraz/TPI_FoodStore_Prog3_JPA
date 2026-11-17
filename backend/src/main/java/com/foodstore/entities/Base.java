package com.foodstore.entities;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@MappedSuperclass
public abstract class Base {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    protected Long id;
    protected LocalDateTime createdAt = LocalDateTime.now();
    protected boolean eliminado = false;
    public Long getId() { return id; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public boolean isEliminado() { return eliminado; }
    public void setEliminado(boolean e) { this.eliminado = e; }
}
