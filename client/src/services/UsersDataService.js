import http from "../http-common";

class UsersDataServices {
    login(data) {
        return http.post('users/auth/login', data);
    }
    signup(data) {
        return http.post('users/auth/signup', data);
    }
    getOneUser(id) {
        return http.get(`users/${id}`);
    }
    deleteUser(id) {
        return http.delete(`users/${id}`);
    }
}

export default new UsersDataServices();
