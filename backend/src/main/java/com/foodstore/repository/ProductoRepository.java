package com.foodstore.repository;
import com.foodstore.entities.Producto;
import com.foodstore.util.JPAUtil;
import jakarta.persistence.EntityManager;
import java.util.List;

public class ProductoRepository extends BaseRepository<Producto> {
    public ProductoRepository() { super(Producto.class); }
    public List<Producto> porCategoria(Long catId) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery("SELECT p FROM Producto p WHERE p.categoria.id = :c AND p.eliminado = false", Producto.class)
                    .setParameter("c", catId).getResultList();
        } finally { em.close(); }
    }
    public List<Producto> disponibles() {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery("SELECT p FROM Producto p WHERE p.disponible = true AND p.eliminado = false", Producto.class).getResultList();
        } finally { em.close(); }
    }
    public List<Producto> masCaros() {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery("SELECT p FROM Producto p WHERE p.eliminado = false ORDER BY p.precio DESC", Producto.class)
                    .setMaxResults(5).getResultList();
        } finally { em.close(); }
    }
}
