import { IUser } from "../types";

export class User implements IUser {
  constructor(
    public employee_id: number,
    public firstname: string,
    public lastname: string,
    public role_id: number
  ) {}

  // Additional methods related to User can be added here
}
