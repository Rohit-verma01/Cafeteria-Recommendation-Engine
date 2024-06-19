import { getRoleById, getUserById } from '../repositories/userRepository';
import { IUser,IRole } from '../types';
export const fetchUserById = async (id: number): Promise<IUser | null> => {
    try {
      return await getUserById(id);
    } catch (error) {
      console.error('Error in service while fetching user:', error);
      return null;
    }
  };

export const fetchRolebyId = async (id: number): Promise<IRole | null> => {
    try {
      return await getRoleById(id);
    } catch (error) {
      console.error('Error in service while fetching user:', error);
      return null;
    }
  };