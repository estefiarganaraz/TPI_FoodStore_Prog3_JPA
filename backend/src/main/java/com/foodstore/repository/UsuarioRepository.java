package com.foodstore.repository;
import com.foodstore.entities.Usuario;
import com.foodstore.util.JPAUtil;
import jakarta.persistence.EntityManager;
import java.util.List;

public class UsuarioRepository extends BaseRepository<Usuario> {
    public UsuarioRepository() { super(Usuario.class); }
    public Usuario porMail(String mail) {
        EntityManager em = JPAUtil.getEntityManager();
        try {
            List<Usuario> r = em.createQuery("SELECT u FROM Usuario u WHERE u.mail = :m AND u.eliminado = false", Usuario.class)
                    .setParameter("m", mail).getResultList();
            return r.isEmpty() ? null : r.get(0);
        } finally { em.close(); }
    }
}

