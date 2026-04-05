import { z } from "zod";

export const loginSchema = z.object({
  userName: z.string().min(1, "El correo es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export const registerSchema = z.object({
  name:    z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email:   z.string().email("Correo electrónico inválido"),
  phone:   z.string().min(7, "Ingresa un número de celular válido"),
  address: z.string().optional(),
});

export const changePassSchema = z.object({
  newPass: z.string().min(7, "El número debe tener al menos 7 dígitos"),
});

export const productSchema = z.object({
  name:        z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  cost:        z.coerce.number().min(0, "El costo no puede ser negativo"),
  price:       z.coerce.number().min(1, "El precio debe ser mayor a 0"),
  description: z.string().optional(),
  stock:       z.coerce.number().int().min(0, "Las existencias no pueden ser negativas"),
  brand:       z.string().optional(),
  category:    z.string().min(1, "Selecciona una categoría"),
});

export const categorySchema = z.object({
  name:        z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  description: z.string().optional(),
});

export const advertisementSchema = z.object({
  title:       z.string().min(2, "El título debe tener al menos 2 caracteres"),
  description: z.string().optional(),
  whatsapp:    z.string().optional(),
  link:        z.string().url("Ingresa una URL válida").optional().or(z.literal("")),
  active:      z.boolean().optional(),
});
