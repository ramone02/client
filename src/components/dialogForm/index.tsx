"use-client";
import { Dialog } from "primereact/dialog";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { ChangeEvent, useEffect, useState } from "react";
import { Estado, UserError, UserProps } from "@/models/user";
import { fetchPost, fetchPut } from "@/api/apiService";
import { validateUserForm } from "@/utils/formValidationtUtils";
import { Toast } from "primereact/toast";
import { FooterContent } from "./components/footerContent";
import "./dialogForm.css";

interface DialogFormProps<T> {
  visible: boolean;
  handleVisible: (arg0: boolean) => void;
  initialState: T;
  user: T | null;
  toast: React.RefObject<Toast>;
  onUserSaved: () => void;
}

export const DialogForm = <T extends UserProps>({
  visible,
  handleVisible,
  user,
  initialState,
  toast,
  onUserSaved,
}: DialogFormProps<T>) => {
  const [userForm, setUserForm] = useState<T>(initialState);
  const [errors, setErrors] = useState<UserError>({});

  const onInputChange = (
    e: ChangeEvent<HTMLInputElement> | DropdownChangeEvent
  ) => {
    const { name, value } = e.target;
    setUserForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const validationErrors = validateUserForm(userForm);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      const isEdit = !!user?.id;

      const saveUser = isEdit
        ? fetchPut("personal", user.id!, userForm)
        : fetchPost("personal", userForm);

      saveUser
        .then(() => {
          toast.current?.show({
            severity: "success",
            summary: "Éxito",
            detail: `Usuario ${isEdit ? "actualizado" : "creado"} con éxito`,
            life: 3000,
          });
          onUserSaved();
        })
        .catch((error) => {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: error.message,
            life: 3000,
          });
        });
      handleVisible(false);
      setUserForm(initialState);
    }
  };

  const handleCancel = () => {
    setUserForm(initialState);
    setErrors({});
    handleVisible(false);
  };

  useEffect(() => {
    if (user) setUserForm(user);
  }, [user]);

  return (
    <div className="card flex justify-content-center">
      <Dialog
        header={"Usuarios"}
        visible={visible}
        style={{ width: "50vw" }}
        onHide={handleCancel}
        footer={
          <FooterContent
            handleCancel={handleCancel}
            handleSubmit={handleSubmit}
          />
        }
      >
        <form>
          <div className="field-container">
            <label htmlFor="id">ID</label>
            <InputText
              id="id"
              name="id"
              value={userForm.id}
              onChange={(e) => onInputChange(e)}
              required
              autoFocus
              disabled={!!user?.id}
            />
            {errors.id && <small className="p-error">{errors.id}</small>}
          </div>
          <div className="field-container">
            <label htmlFor="usuario">Nombre</label>
            <InputText
              id="usuario"
              name="usuario"
              value={userForm.usuario}
              onChange={(e) => onInputChange(e)}
              required
              autoFocus
            />
            {errors.usuario && (
              <small className="p-error">{errors.usuario}</small>
            )}
          </div>
          <div className="field-container">
            <label htmlFor="estado">Estado:</label>
            <Dropdown
              id="estado"
              name="estado"
              value={userForm.estado}
              onChange={(e) => onInputChange(e)}
              options={[Estado.ACTIVO, Estado.INACTIVO]}
              optionLabel="name"
              placeholder="Seleccionar el estado"
              required
            />
            {errors.estado && (
              <small className="p-error">{errors.estado}</small>
            )}
          </div>
          <div className="field-container">
            <label htmlFor="sector">Sector:</label>
            <Dropdown
              id="sector"
              name="sector"
              value={userForm.sector}
              onChange={(e) => onInputChange(e)}
              options={[5000]}
              optionLabel="name"
              placeholder="Seleccionar el sector"
              required
            />
            {errors.sector && (
              <small className="p-error">{errors.sector}</small>
            )}
          </div>
        </form>
      </Dialog>
    </div>
  );
};
