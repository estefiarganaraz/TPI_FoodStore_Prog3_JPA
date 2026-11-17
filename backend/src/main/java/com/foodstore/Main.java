package com.foodstore;
import com.foodstore.entities.*;
import com.foodstore.repository.*;
import com.foodstore.service.SeedService;
import com.foodstore.util.JPAUtil;

import java.time.LocalDate;
import java.util.Scanner;

public class Main {
    static Scanner sc = new Scanner(System.in);
    static CategoriaRepository catRepo = new CategoriaRepository();
    static ProductoRepository prodRepo = new ProductoRepository();
    static UsuarioRepository userRepo = new UsuarioRepository();
    static PedidoRepository pedRepo = new PedidoRepository();

    public static void main(String[] args) {
        SeedService.inicializar();
        int op = -1;
        do {
            try {
                System.out.println("\n=== FOOD STORE–BACKEND ===");
                System.out.println("1.Categorías");
                System.out.println("2.Productos");
                System.out.println("3.Usuarios");
                System.out.println("4.Pedidos");
                System.out.println("5.Consultas JPQL");
                System.out.println("0.Salir");
                System.out.print("Opción: ");
                op = Integer.parseInt(sc.nextLine().trim());
                switch (op) {
                    case 1 -> menuCategorias();
                    case 2 -> menuProductos();
                    case 3 -> menuUsuarios();
                    case 4 -> menuPedidos();
                    case 5 -> menuConsultas();
                    case 0 -> { System.out.println("👋 Hasta luego"); JPAUtil.close(); }
                    default -> System.out.println("Opción inválida");
                }
            } catch (NumberFormatException e) {
                System.out.println("✖ Ingresá un número válido");
            } catch (Exception e) {
                System.out.println("✖ Error: " + e.getMessage());
            }
        } while (op != 0);
    }

    static void menuCategorias() {
        System.out.println("\n-- CATEGORÍAS --\n1.Alta 2.Listar 3.Editar 4.Eliminar 5.Buscar por nombre");
        int op = Integer.parseInt(sc.nextLine());
        switch (op) {
            case 1 -> {
                System.out.print("Nombre: "); String n = sc.nextLine();
                System.out.print("Descripción: "); String d = sc.nextLine();
                System.out.print("Imagen: "); String i = sc.nextLine();
                catRepo.guardar(new Categoria(n, d, i)); System.out.println("✔ Creada");
            }
            case 2 -> catRepo.listarActivos().forEach(System.out::println);
            case 3 -> {
                catRepo.listarActivos().forEach(System.out::println);
                System.out.print("ID: "); Categoria c = catRepo.buscar(Long.parseLong(sc.nextLine()));
                if (c == null) { System.out.println("No existe"); return; }
                System.out.print("Nuevo nombre: "); c.setNombre(sc.nextLine());
                System.out.print("Nueva descripción: "); c.setDescripcion(sc.nextLine());
                catRepo.actualizar(c); System.out.println("✔ Actualizada");
            }
            case 4 -> {
                catRepo.listarActivos().forEach(System.out::println);
                System.out.print("ID a eliminar: "); catRepo.eliminarLogico(Long.parseLong(sc.nextLine()));
                System.out.println("✔ Eliminada");
            }
            case 5 -> {
                System.out.print("Nombre a buscar: ");
                catRepo.buscarPorNombre(sc.nextLine()).forEach(System.out::println);
            }
        }
    }

    static void menuProductos() {
        System.out.println("\n-- PRODUCTOS --\n1.Alta 2.Listar 3.Editar 4.Eliminar 5.Por categoría 6.Disponibles");
        int op = Integer.parseInt(sc.nextLine());
        switch (op) {
            case 1 -> {
                System.out.print("Nombre: "); String n = sc.nextLine();
                System.out.print("Precio: "); double p = Double.parseDouble(sc.nextLine());
                System.out.print("Descripción: "); String d = sc.nextLine();
                System.out.print("Stock: "); int s = Integer.parseInt(sc.nextLine());
                System.out.print("Imagen: "); String i = sc.nextLine();
                System.out.print("Disponible (s/n): "); boolean disp = sc.nextLine().equalsIgnoreCase("s");
                catRepo.listarActivos().forEach(System.out::println);
                System.out.print("ID categoría: "); Categoria c = catRepo.buscar(Long.parseLong(sc.nextLine()));
                if (c == null) { System.out.println("Categoría inválida"); return; }
                prodRepo.guardar(new Producto(n, p, d, s, i, disp, c)); System.out.println("✔ Creado");
            }
            case 2 -> prodRepo.listarActivos().forEach(System.out::println);
            case 3 -> {
                prodRepo.listarActivos().forEach(System.out::println);
                System.out.print("ID: "); Producto p = prodRepo.buscar(Long.parseLong(sc.nextLine()));
                if (p == null) return;
                System.out.print("Nuevo precio: "); p.setPrecio(Double.parseDouble(sc.nextLine()));
                System.out.print("Nuevo stock: "); p.setStock(Integer.parseInt(sc.nextLine()));
                prodRepo.actualizar(p); System.out.println("✔ Actualizado");
            }
            case 4 -> {
                prodRepo.listarActivos().forEach(System.out::println);
                System.out.print("ID a eliminar: "); prodRepo.eliminarLogico(Long.parseLong(sc.nextLine()));
                System.out.println("✔ Eliminado");
            }
            case 5 -> {
                catRepo.listarActivos().forEach(System.out::println);
                System.out.print("ID categoría: ");
                prodRepo.porCategoria(Long.parseLong(sc.nextLine())).forEach(System.out::println);
            }
            case 6 -> prodRepo.disponibles().forEach(System.out::println);
        }
    }

    static void menuUsuarios() {
        System.out.println("\n-- USUARIOS --\n1.Alta 2.Listar 3.Editar 4.Eliminar 5.Buscar por mail");
        int op = Integer.parseInt(sc.nextLine());
        switch (op) {
            case 1 -> {
                System.out.print("Nombre: "); String n = sc.nextLine();
                System.out.print("Apellido: "); String a = sc.nextLine();
                System.out.print("Mail: "); String m = sc.nextLine();
                System.out.print("Celular: "); String c = sc.nextLine();
                System.out.print("Password: "); String pw = sc.nextLine();
                System.out.print("Rol (ADMIN/USUARIO): "); Rol r = Rol.valueOf(sc.nextLine().toUpperCase());
                userRepo.guardar(new Usuario(n, a, m, c, pw, r)); System.out.println("✔ Creado");
            }
            case 2 -> userRepo.listarActivos().forEach(System.out::println);
            case 3 -> {
                userRepo.listarActivos().forEach(System.out::println);
                System.out.print("ID: "); Usuario u = userRepo.buscar(Long.parseLong(sc.nextLine()));
                if (u == null) return;
                System.out.print("Nuevo celular: "); u.setCelular(sc.nextLine());
                userRepo.actualizar(u); System.out.println("✔ Actualizado");
            }
            case 4 -> {
                userRepo.listarActivos().forEach(System.out::println);
                System.out.print("ID: "); userRepo.eliminarLogico(Long.parseLong(sc.nextLine()));
                System.out.println("✔ Eliminado");
            }
            case 5 -> {
                System.out.print("Mail: "); Usuario u = userRepo.porMail(sc.nextLine());
                System.out.println(u == null ? "No encontrado" : u);
            }
        }
    }

    static void menuPedidos() {
        System.out.println("\n-- PEDIDOS --\n1.Alta 2.Listar 3.Cambiar estado 4.Por usuario 5.Por estado 6.Eliminar");
        int op = Integer.parseInt(sc.nextLine());
        switch (op) {
            case 1 -> {
                userRepo.listarActivos().forEach(System.out::println);
                System.out.print("ID usuario: "); Usuario u = userRepo.buscar(Long.parseLong(sc.nextLine()));
                if (u == null) { System.out.println("Usuario inválido"); return; }
                System.out.print("Forma pago (EFECTIVO/TARJETA/TRANSFERENCIA): ");
                FormaPago fp = FormaPago.valueOf(sc.nextLine().toUpperCase());
                Pedido ped = new Pedido(LocalDate.now(), Estado.PENDIENTE, fp, u);
                while (true) {
                    prodRepo.disponibles().forEach(System.out::println);
                    System.out.print("ID producto (0 para terminar): ");
                    Long pid = Long.parseLong(sc.nextLine());
                    if (pid == 0) break;
                    Producto p = prodRepo.buscar(pid);
                    if (p == null) { System.out.println("Producto inválido"); continue; }
                    System.out.print("Cantidad: ");
                    int c = Integer.parseInt(sc.nextLine());
                    ped.addDetalle(new DetallePedido(p, c));
                }
                pedRepo.guardar(ped); System.out.println("✔ Pedido creado – Total $" + ped.getTotal());
            }
            case 2 -> pedRepo.listarActivos().forEach(System.out::println);
            case 3 -> {
                pedRepo.listarActivos().forEach(System.out::println);
                System.out.print("ID: "); Pedido p = pedRepo.buscar(Long.parseLong(sc.nextLine()));
                if (p == null) return;
                System.out.print("Nuevo estado (PENDIENTE/CONFIRMADO/TERMINADO/CANCELADO): ");
                p.setEstado(Estado.valueOf(sc.nextLine().toUpperCase()));
                pedRepo.actualizar(p); System.out.println("✔ Estado actualizado");
            }
            case 4 -> {
                userRepo.listarActivos().forEach(System.out::println);
                System.out.print("ID usuario: ");
                pedRepo.porUsuario(Long.parseLong(sc.nextLine())).forEach(System.out::println);
            }
            case 5 -> {
                System.out.print("Estado: ");
                pedRepo.porEstado(Estado.valueOf(sc.nextLine().toUpperCase())).forEach(System.out::println);
            }
            case 6 -> {
                pedRepo.listarActivos().forEach(System.out::println);
                System.out.print("ID a eliminar: "); pedRepo.eliminarLogico(Long.parseLong(sc.nextLine()));
                System.out.println("✔ Eliminado");
            }
        }
    }

    static void menuConsultas() {
        System.out.println("\n-- CONSULTAS JPQL --");
        System.out.println("1.Productos disponibles");
        System.out.println("2.Total facturado (pedidos TERMINADO)");
        System.out.println("3.Productos más caros (top 5)");
        System.out.println("4.Pedidos por estado");
        int op = Integer.parseInt(sc.nextLine());
        switch (op) {
            case 1 -> prodRepo.disponibles().forEach(System.out::println);
            case 2 -> System.out.println("Total facturado: $" + pedRepo.totalFacturado());
            case 3 -> prodRepo.masCaros().forEach(System.out::println);
            case 4 -> {
                System.out.print("Estado: ");
                pedRepo.porEstado(Estado.valueOf(sc.nextLine().toUpperCase())).forEach(System.out::println);
            }
        }
    }
}
