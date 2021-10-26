const { RESTDataSource } = require("apollo-datasource-rest");

type User = { id: any; nome: any; email: any; role: string };

export class UsersAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = "http://localhost:3000";
  }

  async getUsers() {
    const users = await this.get("/users");
    users.map(async (user: User) => ({
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: await this.get("/roles/" + user.role),
    }));
  }

  async getUserById(id: number) {
    const user = await this.get("/users/" + id);
    user.role = await this.get("/roles/" + user.role);
    return user;
  }

  async addUser(user: User) {
    const users = await this.get("/users");
    const role = await this.get("/roles?type=" + user.role);
    user.id = users.length + 1;
    await this.post("users", { ...user, role: role[0].id });
    return {
      ...user,
      role: role[0],
    };
  }

  async updateUser(newData: User) {
    const role = await this.get("/roles?type=" + newData.role);
    this.put("users/" + newData.id, { ...newData, role: role[0].id });
    return {
      ...newData,
      role: role[0],
    };
  }

  async deleteUser(id: number) {
    await this.delete("users/" + id);
    return id;
  }
}

module.exports = UsersAPI;
