export interface IUser {
    employee_id: number;
    firstname: string;
    lastname: string;
    role_id: number;
}

export interface IRole {
    role_id: number;
    role_name: string;
}

export interface IFoodItem {
    name: string;
    price: number;
}
