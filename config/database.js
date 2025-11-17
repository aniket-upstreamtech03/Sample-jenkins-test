/**
 * Mock database configuration
 * In a real application, this would connect to MongoDB, PostgreSQL, etc.
 * This mock implementation allows the app to work without a real database
 */

class MockDatabase {
  constructor() {
    // Initial sample data
    this.users = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        age: 28,
        department: 'Engineering',
        createdAt: new Date('2023-01-15T10:00:00Z'),
        status: 'active'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        age: 32,
        department: 'Marketing',
        createdAt: new Date('2023-02-20T14:30:00Z'),
        status: 'active'
      },
      {
        id: 3,
        name: 'Mike Johnson',
        email: 'mike.johnson@example.com',
        age: 25,
        department: 'Sales',
        createdAt: new Date('2023-03-10T09:15:00Z'),
        status: 'inactive'
      },
      {
        id: 4,
        name: 'Sarah Wilson',
        email: 'sarah.wilson@example.com',
        age: 29,
        department: 'Engineering',
        createdAt: new Date('2023-04-05T16:45:00Z'),
        status: 'active'
      },
      {
        id: 5,
        name: 'David Brown',
        email: 'david.brown@example.com',
        age: 35,
        department: 'HR',
        createdAt: new Date('2023-05-12T11:20:00Z'),
        status: 'active'
      }
    ];
    this.nextId = 6;
  }

  // Find all users with optional filters
  async findUsers(filters = {}) {
    // Simulate database delay
    await this.simulateDelay();
    
    let users = [...this.users];
    
    // Apply filters
    if (filters.department) {
      users = users.filter(user => 
        user.department.toLowerCase().includes(filters.department.toLowerCase())
      );
    }
    
    if (filters.status) {
      users = users.filter(user => user.status === filters.status);
    }
    
    if (filters.email) {
      users = users.filter(user => 
        user.email.toLowerCase().includes(filters.email.toLowerCase())
      );
    }
    
    return users;
  }

  // Find user by ID
  async findUserById(id) {
    await this.simulateDelay();
    return this.users.find(user => user.id === parseInt(id));
  }

  // Create new user
  async createUser(userData) {
    await this.simulateDelay();
    
    const newUser = {
      id: this.nextId++,
      ...userData,
      createdAt: new Date()
    };
    
    this.users.push(newUser);
    return newUser;
  }

  // Update user
  async updateUser(id, updateData) {
    await this.simulateDelay();
    
    const userIndex = this.users.findIndex(user => user.id === parseInt(id));
    
    if (userIndex === -1) {
      return null;
    }
    
    // Preserve original createdAt and id
    this.users[userIndex] = { 
      ...this.users[userIndex], 
      ...updateData,
      id: this.users[userIndex].id, // Ensure ID doesn't change
      createdAt: this.users[userIndex].createdAt // Preserve creation date
    };
    
    return this.users[userIndex];
  }

  // Delete user
  async deleteUser(id) {
    await this.simulateDelay();
    
    const userIndex = this.users.findIndex(user => user.id === parseInt(id));
    
    if (userIndex === -1) {
      return null;
    }
    
    return this.users.splice(userIndex, 1)[0];
  }

  // Get user statistics
  async getUserStats() {
    await this.simulateDelay();
    
    const totalUsers = this.users.length;
    const activeUsers = this.users.filter(u => u.status === 'active').length;
    const inactiveUsers = this.users.filter(u => u.status === 'inactive').length;
    
    // Department statistics
    const departmentStats = this.users.reduce((acc, user) => {
      acc[user.department] = (acc[user.department] || 0) + 1;
      return acc;
    }, {});
    
    // Age statistics
    const ageStats = {
      average: Math.round(this.users.reduce((sum, user) => sum + user.age, 0) / totalUsers),
      min: Math.min(...this.users.map(u => u.age)),
      max: Math.max(...this.users.map(u => u.age))
    };
    
    // Recent activity (users created in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = this.users.filter(user => 
      new Date(user.createdAt) > thirtyDaysAgo
    ).length;
    
    return {
      total: totalUsers,
      active: activeUsers,
      inactive: inactiveUsers,
      recent: recentUsers,
      departments: departmentStats,
      age: ageStats,
      generatedAt: new Date().toISOString()
    };
  }

  // Utility method to simulate database delay
  simulateDelay() {
    return new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
  }

  // Utility method to reset database (for testing)
  reset() {
    this.users = [
      {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        age: 28,
        department: 'Engineering',
        createdAt: new Date('2023-01-15T10:00:00Z'),
        status: 'active'
      },
      {
        id: 2,
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        age: 32,
        department: 'Marketing',
        createdAt: new Date('2023-02-20T14:30:00Z'),
        status: 'active'
      }
    ];
    this.nextId = 3;
  }

  // Utility method to get database info
  getInfo() {
    return {
      type: 'mock',
      totalUsers: this.users.length,
      nextId: this.nextId,
      supportedOperations: ['findUsers', 'findUserById', 'createUser', 'updateUser', 'deleteUser', 'getUserStats']
    };
  }
}

// Create singleton instance
const database = new MockDatabase();

// Log database info on startup
console.log('📊 Mock Database Initialized:', database.getInfo());

module.exports = database;