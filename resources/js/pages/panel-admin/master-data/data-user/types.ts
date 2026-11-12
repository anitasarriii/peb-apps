export type StatusType = 'Aktif' | 'Nonaktif';

export interface RoleItem {
    id: number;
    name: string;
    label: string;
    color: string | null;
}

export interface UserItem {
    id: number;
    name: string;
    email: string;
    role_id: number;
    role: RoleItem | null;
    status: StatusType;
    avatar: string | null;
    created_at: string;
}

export interface PaginationData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
}

export interface PageProps {
    users: PaginationData<UserItem>;
    roles: RoleItem[];
    filters: { search?: string };
    flash?: { success?: string };
}

export const STATUS_OPTIONS: StatusType[] = ['Aktif', 'Nonaktif'];
