export interface Permission {
    id: number;
    name: string;
    label: string;
    description: string;
}

export interface RoleConfig {
    id: number;
    name: string;
    label: string;
    description: string | null;
    color: string | null;
    permissions: Record<string, boolean>;
}

export interface PaginationData<T> {
    data: T[];
}
