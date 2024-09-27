"use client";
import "primereact/resources/themes/lara-light-blue/theme.css";
import "primeicons/primeicons.css";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Skeleton } from "primereact/skeleton";
import { Button } from "primereact/button";
import { DialogForm } from "@/components/dialogForm";
import { useEffect, useRef, useState } from "react";
import { Estado, UserProps } from "@/models/user";
import { fetchDelete, fetchGetWithSector } from "@/api/apiService";
import { Toast } from "primereact/toast";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { HeaderUser } from "@/components/headerUser";
import { IconField } from "primereact/iconfield";
import { InputText } from "primereact/inputtext";
import { InputIcon } from "primereact/inputicon";
/* import { Dropdown } from "primereact/dropdown";
import { FilterMatchMode } from "primereact/api"; */

const userInitialState: UserProps = {
  id: "",
  usuario: "",
  estado: Estado.INACTIVO,
  sector: 5000,
};

interface UserDashboardProps {
  initialUsers: UserProps[];
}

export default function UserDashboard({ initialUsers }: UserDashboardProps) {
  const [visible, setVisible] = useState<boolean>(false);
  const [users, setUsers] = useState<UserProps[]>(initialUsers || []);
  const [user, setUser] = useState<UserProps | null>(null);
  const [filterUsers, setFilterUsers] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const toast = useRef<Toast>(null);

  /* Intente seguir el ejemplo que da Prime React para los filtros de comlumna segun su documentacion,
  pero nunca pude hacer que se renderize en el header */

  /* const [filters, setFilters] = useState({
    estado: { value: null, matchMode: FilterMatchMode.EQUALS },
  }); */

  const handleVisible = (value: boolean) => {
    setUser(null);
    setVisible(value);
  };

  const handleEdit = (rowUser: UserProps) => {
    setUser(rowUser);
    setVisible(true);
  };

  const acceptFnDialog = (id: string) => {
    fetchDelete("personal", id)
      .then(() => {
        toast.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "El usuario ha sido eliminado correctamente",
          life: 3000,
        });
        loadUsers();
      })
      .catch((error) => {
        toast.current?.show({
          severity: "error",
          summary: "Error",
          detail: error.message,
          life: 3000,
        });
      });
  };

  const handleDelete = (id: string) => {
    confirmDialog({
      message: `¿Está seguro de eliminar este usuario con el id ${id}?`,
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      rejectClassName: "p-button-info",
      acceptLabel: "Continuar",
      rejectLabel: "Cancelar",
      accept: () => {
        acceptFnDialog(id);
      },
      reject: () => {},
    });
  };

  const onFilterUsers = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterUsers(e.target.value);
  };

  const filteredUsers = users.filter((user: UserProps) => {
    return (
      user.usuario.toLowerCase().includes(filterUsers.toLowerCase()) ||
      user.estado.toLowerCase().includes(filterUsers.toLowerCase()) ||
      user.sector.toString().includes(filterUsers)
    );
  });

  /* const filterDropdownTemplate = (options) => {
    const statusOptions = [
      { label: "ACTIVO", value: Estado.ACTIVO },
      { label: "INACTIVO", value: Estado.INACTIVO },
    ];

    return (
      <Dropdown
        value={options?.value || null}
        options={statusOptions}
        onChange={(e) => options.filterApplyCallback(e.value)}
        placeholder="Seleccione uno"
        className="p-column-filter"
        showClear
        style={{ minWidth: "12rem" }}
      />
    );
  }; */

  const onUserSaved = () => {
    loadUsers();
    setVisible(false);
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const fetchedUsers = await fetchGetWithSector("personal");
      setUsers(fetchedUsers);
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div style={{ padding: "0 8rem 0 8rem", minWidth: "60%" }}>
      <Toast ref={toast} />
      <ConfirmDialog />
      <HeaderUser
        header="Usuarios"
        labelButton="Nuevo Usuario"
        handleVisible={handleVisible}
      />
      <DataTable
        value={filteredUsers}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 15]}
        tableStyle={{ minWidth: "50rem" }}
        className="p-datatable-striped"
        header={() => (
          <div className="flex justify-content-end">
            <IconField iconPosition="left">
              <InputIcon className="pi pi-search" />
              <InputText
                value={filterUsers}
                onChange={onFilterUsers}
                placeholder="Buscar"
              />
            </IconField>
            {/* Luego probe poniendo el dropdown aca, pero no logre que funcione correctamente */}
          </div>
        )}
        /* filters={filters}
        filterDisplay="row"
        onFilter={(e) => setFilters(e.filters)} */
        emptyMessage={"No se han encontrado registros."}
      >
        <Column
          field="id"
          header="Id"
          sortable
          body={loading ? <Skeleton /> : undefined}
        />
        <Column
          field="usuario"
          header="Usuario"
          sortable
          body={loading ? <Skeleton /> : undefined}
        />
        <Column
          field="estado"
          header="Estado"
          sortable
          body={loading ? <Skeleton /> : undefined}
          /* filterElement={filterDropdownTemplate}
          showFilterMenu={false} */
        />
        <Column
          field="sector"
          header="Sector"
          sortable
          body={loading ? <Skeleton /> : undefined}
        />
        <Column
          body={(rowUser: UserProps) =>
            loading ? (
              <Skeleton width="5rem" />
            ) : (
              <Button onClick={() => handleEdit(rowUser)}>Editar</Button>
            )
          }
        />
        <Column
          body={(rowUser: UserProps) =>
            loading ? (
              <Skeleton width="5rem" />
            ) : (
              <Button
                onClick={() => handleDelete(rowUser.id)}
                severity="danger"
                icon="pi pi-trash"
              />
            )
          }
        />
      </DataTable>
      <DialogForm
        visible={visible}
        handleVisible={handleVisible}
        user={user}
        initialState={userInitialState}
        toast={toast}
        onUserSaved={onUserSaved}
      />
    </div>
  );
}
