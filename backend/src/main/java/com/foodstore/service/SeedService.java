package com.foodstore.service;
import com.foodstore.entities.*;
import com.foodstore.repository.*;

public class SeedService {
    public static void inicializar() {
        CategoriaRepository catRepo = new CategoriaRepository();
        ProductoRepository prodRepo = new ProductoRepository();
        UsuarioRepository userRepo = new UsuarioRepository();

        if (!catRepo.listarActivos().isEmpty()) return;

        Categoria c1 = new Categoria("Hamburguesas", "Hamburguesas artesanales", "https://placehold.co/300x200");
        Categoria c2 = new Categoria("Bebidas", "Bebidas frías", "https://placehold.co/300x200");
        Categoria c3 = new Categoria("Postres", "Postres caseros", "https://placehold.co/300x200");
        catRepo.guardar(c1); catRepo.guardar(c2); catRepo.guardar(c3);

        prodRepo.guardar(new Producto("Hamburguesa triple", 25000, "Triple carne con cheddar", 10, "https://placehold.co/400x300", true, c1));
        prodRepo.guardar(new Producto("Hamburguesa clásica", 18000, "Carne, lechuga, tomate", 15, "https://placehold.co/400x300", true, c1));
        prodRepo.guardar(new Producto("Coca Cola 500ml", 3000, "Bebida fría", 30, "https://placehold.co/400x300", true, c2));
        prodRepo.guardar(new Producto("Flan casero", 5000, "Con dulce de leche", 8, "https://placehold.co/400x300", true, c3));

        userRepo.guardar(new Usuario("Admin", "Sistema", "admin@food.com", "1122334455", "admin123", Rol.ADMIN));
        userRepo.guardar(new Usuario("Juan", "Perez", "juan@mail.com", "1155667788", "juan123", Rol.USUARIO));

        System.out.println("✔ Datos de prueba cargados.");
    }
}
