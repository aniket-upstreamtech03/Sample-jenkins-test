const database = require('../config/database');

class User {
  static async findAll(filters = {}) {
    try {
      return await database.findUsers(filters);
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  static async findById(id) {
    try {
      const user = await database.findUserById(id);
      if (!user) {
        throw new Error(`User with ID ${id} not found`);
      }
      return user;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  static async create(userData) {
    try {
      // Check if email already exists
      const existingUsers = await database.findUsers();
      const emailExists = existingUsers.some(user => 
        user.email.toLowerCase() === userData.email.toLowerCase()
      );
      
      if (emailExists) {
        throw new Error('User with this email already exists');
      }

      return await database.createUser(userData);
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  static async update(id, updateData) {
    try {
      const updatedUser = await database.updateUser(id, updateData);
      if (!updatedUser) {
        throw new Error(`User with ID ${id} not found`);
      }
      return updatedUser;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  static async delete(id) {
    try {
      const deletedUser = await database.deleteUser(id);
      if (!deletedUser) {
        throw new Error(`User with ID ${id} not found`);
      }
      return deletedUser;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  static async getStats() {
    try {
      return await database.getUserStats();
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  // Additional model methods
  static async findByEmail(email) {
    try {
      const users = await database.findUsers();
      return users.find(user => user.email.toLowerCase() === email.toLowerCase());
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  static async getUsersByDepartment(department) {
    try {
      return await database.findUsers({ department });
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  static async getActiveUsers() {
    try {
      return await database.findUsers({ status: 'active' });
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  static async getInactiveUsers() {
    try {
      return await database.findUsers({ status: 'inactive' });
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  // Get users created in a date range
  static async getUsersByDateRange(startDate, endDate) {
    try {
      const users = await database.findUsers();
      return users.filter(user => {
        const userDate = new Date(user.createdAt);
        return userDate >= new Date(startDate) && userDate <= new Date(endDate);
      });
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  // Get user count by status
  static async getUserCountByStatus() {
    try {
      const stats = await database.getUserStats();
      return {
        active: stats.active,
        inactive: stats.inactive,
        total: stats.total
      };
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }
}

module.exports = User;