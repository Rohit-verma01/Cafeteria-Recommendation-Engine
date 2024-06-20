import { MenuItemRepository } from "../repositories/menuItemRepository";

export class MenuItemService {
    private menuItemRepository: MenuItemRepository;
  
    constructor() {
      this.menuItemRepository = new MenuItemRepository();
    }
  
    async viewMenu() {
      // Implement viewMenu functionality
    }
  
    async addItem(item: any) {
      return await this.menuItemRepository.addMenuItem(item);
    }
  
    async updateItem(item: any) {
      // Implement updateItem functionality
    }
  
    async deleteItem(itemId: number) {
      // Implement deleteItem functionality
    }
  }