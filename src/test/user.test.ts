// userService.test.ts
import { UserService } from '../services/userService';
import { UserRepository } from '../repositories/userRepository';
import { IUser, IRole } from '../types';

// Mock UserRepository
jest.mock('../repositories/userRepository');
const MockUserRepository = UserRepository as jest.MockedClass<typeof UserRepository>;

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    jest.clearAllMocks();
    userService = new UserService();
  });

  describe('fetchUserById', () => {
    it('should fetch user by ID', async () => {
      const mockUser: IUser = { employee_id: 1011, firstname: 'rohit', lastname: 'verma', role_id: 1 };
      MockUserRepository.prototype.getUserById.mockResolvedValue(mockUser);

      const result = await userService.fetchUserById(1011);

      expect(result).toEqual(mockUser);
      expect(MockUserRepository.prototype.getUserById).toHaveBeenCalledWith(1011);
    });

    it('should handle error when fetching user fails', async () => {
      const errorMessage = 'Database error';
      MockUserRepository.prototype.getUserById.mockRejectedValue(new Error(errorMessage));

      const result = await userService.fetchUserById(1011);

      expect(result).toBe('Error in fetching user by ID');
      expect(MockUserRepository.prototype.getUserById).toHaveBeenCalledWith(1011);
    });
  });

  describe('fetchRoleById', () => {
    it('should fetch role by ID', async () => {
      const mockRole: IRole = { role_id: 1011, role_name: 'admin' };
      MockUserRepository.prototype.getRoleById.mockResolvedValue(mockRole);

      const result = await userService.fetchRolebyId(1011);

      expect(result).toEqual(mockRole);
      expect(MockUserRepository.prototype.getRoleById).toHaveBeenCalledWith(1011);
    });

    it('should handle error when fetching role fails', async () => {
      const errorMessage = 'Database error';
      MockUserRepository.prototype.getRoleById.mockRejectedValue(new Error(errorMessage));

      const result = await userService.fetchRolebyId(1011);

      expect(result).toBe('Error in fetching the user role');
      expect(MockUserRepository.prototype.getRoleById).toHaveBeenCalledWith(1011);
    });
  });

  describe('updateProfileById', () => {
    it('should update profile successfully', async () => {
      const payload = { dietType: 1, spicyLevel: 2, prefer: 2, likeSweet: true };
      MockUserRepository.prototype.updateProfileById.mockResolvedValue('Employee profile updated successfully.\n');

      const result = await userService.updateProfileById(payload, 1012);

      expect(result).toBe('Employee profile updated successfully.\n');
      expect(MockUserRepository.prototype.updateProfileById).toHaveBeenCalledWith(payload, 1012);
    });

    it('should handle error when updating profile fails', async () => {
      const payload = { dietType: 1, spicyLevel: 2, prefer: 1, likeSweet: true };
      const errorMessage = 'Database error';
      MockUserRepository.prototype.updateProfileById.mockRejectedValue(new Error(errorMessage));

      const result = await userService.updateProfileById(payload, 1013);

      expect(result).toBe('Error in updating the employee profile');
      expect(MockUserRepository.prototype.updateProfileById).toHaveBeenCalledWith(payload, 1013);
    });
  });

  describe('addUserActivity', () => {
    it('should add user activity successfully', async () => {
      const employeeId = 1;
      const activity = 'Logged in';
      MockUserRepository.prototype.addActivity.mockResolvedValue(undefined);

      await userService.addUserActivity(employeeId, activity);

      expect(MockUserRepository.prototype.addActivity).toHaveBeenCalledWith(employeeId, activity);
    });

    it('should handle error when adding user activity fails', async () => {
      const employeeId = 1;
      const activity = 'Logged in';
      const errorMessage = 'Database error';
      MockUserRepository.prototype.addActivity.mockRejectedValue(new Error(errorMessage));

      await expect(userService.addUserActivity(employeeId, activity)).rejects.toThrow(errorMessage);

      expect(MockUserRepository.prototype.addActivity).toHaveBeenCalledWith(employeeId, activity);
    });
  });
});
