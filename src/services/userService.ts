import { UserRepository } from "../repositories/userRepository";
export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async fetchUserById(id: number) {
    try {
      return await this.userRepository.getUserById(id);
    } catch (error) {
      console.error("Error in service while fetching user:", error);
      return "Error in fetching user by ID";
    }
  }

  async fetchRolebyId(id: number) {
    try {
      return await this.userRepository.getRoleById(id);
    } catch (error) {
      console.error("Error in service while fetching user role:", error);
      return "Error in fetching the user role";
    }
  }

  async updateProfileById(payload:any,id:number){
    try {
      return await this.userRepository.updateProfileById(payload,id);
    } catch (error) {
      console.error("Error in service while updating employee profile:", error);
      return "Error in updating the employee profile";
    }
  }
}
