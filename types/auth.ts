export type RegisterData = {
    firstName: string;
    lastName: string;
    businessEmail: string;
    phoneNumber: string;
    password: string;
    confirmPassword?: string;
};

export type User = {
    id?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    accountType: string
};

export type LoginResponse = {
    user?: User;
    [key: string]: unknown;
};

export type AccountType = "ADVERTISER" | "PUBLISHER";

export type UserRole =
    | "OWNER"
    | "ADMIN"
    | "MEMBER"
    | "ANALYST";

export interface Users {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
}

export interface AuthUser extends User {
    organizationId: string;
    organizationName: string;
    accountType: AccountType;
    role: UserRole;
}

export interface LoginRequest {
    businessEmail: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    organizationName: string;
    accountType: AccountType;
}

export interface AuthResponse {
    user: AuthUser;
}