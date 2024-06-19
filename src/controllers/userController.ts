import { IUser, IRole } from '../types';
import { fetchUserById, fetchRolebyId } from '../services/userService';

export class UserController {

    async fetchUser(id: number): Promise<IUser | null> {
        return await fetchUserById(id);
    }

    async fetchRole(roleId: number): Promise<IRole | null> {
        return await fetchRolebyId(roleId);
    }

}
