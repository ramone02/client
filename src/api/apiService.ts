import { UserProps } from "@/models/user";

const BASE_URL = "https://staging.duxsoftware.com.ar/api";

const _SECTOR = 5000;

export const fetchGetWithSector = async (endpoint: string, params: Record<string, any> = {}) => {
    const url = new URL(`${BASE_URL}/${endpoint}`);

    const queryParams = { ...params, sector: _SECTOR };

    Object.keys(queryParams).forEach((key) => {
        url.searchParams.append(key, queryParams[key]);
    });

    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error("Error fetching data");
    }
    return response.json();
};

export const fetchPost = async (endpoint: string, data: UserProps) => {
    const url = `${BASE_URL}/${endpoint}`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        if (response.status === 400) {
            throw new Error("Error Bad Request, revisa los campos enviados.");
        }
        throw new Error(`Error al crear el Usuario con el id: ${data.id}`);
    }
    return response.json();
};

export const fetchPut = async (endpoint: string, id: string, data: UserProps) => {
    const url = `${BASE_URL}/${endpoint}/${id}`;

    const response = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        if (response.status === 400) {
            throw new Error("Error Bad Request, revisa los campos enviados.");
        }
        throw new Error(`Error al actualizar el Usuario con el id: ${id}`);
    }
    return response.json();
};

export const fetchDelete = async (endpoint: string, id: string) => {
    const url = `${BASE_URL}/${endpoint}/${id}`;

    const response = await fetch(url, {
        method: "DELETE",
    });

    if (response.status === 200) {
        return;
    } else if (response.status === 400) {
        throw new Error("Error Bad Request");
    } else {
        throw new Error("Error al eliminar el usuario");
    }
};
