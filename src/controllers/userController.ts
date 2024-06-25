
import { UserService } from '../services/userService';

export class UserController {
    private userService: UserService;
  
    constructor() {
      this.userService = new UserService();
    }

    async fetchUser(id: number) {
        return await this.userService.fetchUserById(id);
    }

    async fetchRole(roleId: number) {
        return await this.userService.fetchRolebyId(roleId);
    }

}
