package com.foodstore.repository;
import com.foodstore.util.JPAUtil;
import jakarta.persistence.*;
import java.util.List;

public abstract class BaseRepository<T> {
    protected Class<T> clazz;
    public BaseRepository(Class<T> clazz) { this.clazz = clazz; }

    public void guardar(T e) {
        EntityManager em = JPAUtil.getEntityManager();
        try { em.getTransaction().begin(); em.persist(e); em.getTransaction().commit(); }
        catch (Exception ex) { em.getTransaction().rollback(); throw ex; }
        finally { em.close(); }
    }
    public void actualizar(T e) {
        EntityManager em = JPAUtil.getEntityManager();
        try { em.getTransaction().begin(); em.merge(e); em.getTransaction().commit(); }
        catch (Exception ex) { em.getTransaction().rollback(); throw ex; }
        finally { em.close(); }
    }
    public T buscar(Long id) {
        EntityManager em = JPAUtil.getEntityManager();
        try { return em.find(clazz, id); } finally { em.close(); }
    }
    public List<T> listarActivos() {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery("SELECT e FROM " + clazz.getSimpleName() + " e WHERE e.eliminado = false", clazz).getResultList();
        } finally { em.close(); }
    }
    public void eliminarLogico(Long id) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            em.getTransaction().begin();
            em.createQuery("UPDATE " + clazz.getSimpleName() + " x SET x.eliminado = true WHERE x.id = :id")
                    .setParameter("id", id).executeUpdate();
            em.getTransaction().commit();
        } finally { em.close(); }
    }
}
