package com.foodstore.repository;
import com.foodstore.entities.*;
import com.foodstore.util.JPAUtil;
import jakarta.persistence.EntityManager;
import java.util.List;

public class PedidoRepository extends BaseRepository<Pedido> {
    public PedidoRepository() { super(Pedido.class); }
    public List<Pedido> porUsuario(Long idUser) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery("SELECT p FROM Pedido p WHERE p.usuario.id = :u AND p.eliminado = false ORDER BY p.fecha DESC", Pedido.class)
                    .setParameter("u", idUser).getResultList();
        } finally { em.close(); }
    }
    public List<Pedido> porEstado(Estado e) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            return em.createQuery("SELECT p FROM Pedido p WHERE p.estado = :e AND p.eliminado = false ORDER BY p.fecha DESC", Pedido.class)
                    .setParameter("e", e).getResultList();
        } finally { em.close(); }
    }
    public double totalFacturado() {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            Double r = em.createQuery("SELECT SUM(p.total) FROM Pedido p WHERE p.eliminado = false AND p.estado = :e", Double.class)
                    .setParameter("e", Estado.TERMINADO).getSingleResult();
            return r == null ? 0 : r;
        } finally { em.close(); }
    }
}
