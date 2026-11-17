package com.foodstore.repository;
import com.foodstore.entities.Categoria;
import com.foodstore.util.JPAUtil;
import jakarta.persistence.EntityManager;
import java.util.List;

public class CategoriaRepository extends BaseRepository<Categoria> {
    public CategoriaRepository() { super(Categoria.class); }
    public List<Categoria> buscarPorNombre(String nombre) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery("SELECT c FROM Categoria c WHERE LOWER(c.nombre) LIKE :n AND c.eliminado = false", Categoria.class)
                    .setParameter("n", "%" + nombre.toLowerCase() + "%").getResultList();
        } finally { em.close(); }
    }
}
