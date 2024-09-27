import { Estado, UserError, UserProps } from "@/models/user";

export const validateUserForm = (userForm: UserProps): UserError => {
    const errors: UserError = {};
    if (!userForm.id || userForm.id.trim() === "") {
        errors.id = "El ID es obligatorio.";
    }
    if (!userForm.usuario || userForm.usuario.trim() === "") {
        errors.usuario = "El nombre de usuario es obligatorio.";
    } else if (userForm.usuario.length < 3) {
        errors.usuario = "El nombre de usuario debe tener al menos 3 caracteres.";
    }
    if (!Object.values(Estado).includes(userForm.estado)) {
        errors.estado = "El estado es invalido. Debe ser 'Activo' o 'Inactivo'.";
    }
    if (userForm.sector !== 5000) {
        errors.sector = "El sector es invalido. Debe ser 5000.";
    }

    return errors;
};
