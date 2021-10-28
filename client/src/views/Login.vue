<template>
  <div class="login">
    <div>
      <ValidationObserver v-slot="{ invalid, handleSubmit }">
        <form @submit.prevent="handleSubmit(loginSubmit)">
          <ValidationProvider name="user.username" rules="required|minmax:3,10">
          <div slot-scope="{ errors }">
            <label for="username">Username:</label>
            <input type="text" id="username" name="username" v-model="user.username" />
            <p class="error">{{ errors[0] }}</p>
          </div>
          </ValidationProvider>
          <ValidationProvider name="user.password" rules="required|password">
          <div slot-scope="{ errors }">
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" v-model="user.password" />
            <p class="error">{{ errors[0] }}</p>
          </div>
          </ValidationProvider>
          <button type="submit" v-bind:disabled="invalid">Submit</button>
        </form>
        <p v-if="showError" id="error">Username or Password is incorrect</p>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import UsersDataService from "../services/UsersDataService";
import { ValidationProvider, ValidationObserver } from 'vee-validate'

export default {
  name: "Login",
  components: {ValidationProvider, ValidationObserver},
  data() {
    return {
      user: {
        username: "",
        password: "",
      },
        showError: false,
      errors: []
    };
  },
  methods: {
    ...mapMutations([
      'setUser',
      'setUsers',
      'setUserId',
      'setToken',
      'setIsAdmin'
    ]),

    loginSubmit() {
      const data = {
          'username': this.user.username,
          'password': this.user.password
      }
      UsersDataService.login(data)
          .then(response => {
            this.setUser(response.data);
            this.setUsers(response.data);
            this.setUserId(response.data.id);
            this.setToken(response.data.token);
            this.setIsAdmin(response.data.isAdmin);
            this.$router.push('/articles');
          })
          .catch(() => this.showError = true)
    }
  },
};
</script>


<style scoped>
* {
  box-sizing: border-box;
}
label {
  padding: 12px 12px 12px 0;
  display: inline-block;
}
button[type=submit] {
  background-color:#864141;
  color: white;
  padding: 12px 20px;
  cursor: pointer;
  border-radius:30px;
  margin-top: 10px;
}
button[type=submit]:hover {
  background-color: #d36c73;
}
input {
  margin: 5px;
  box-shadow:0 0 15px 4px rgba(0,0,0,0.06);
  padding:10px;
  border-radius:30px;
}
#error {
  color: #ff4800;
}
.error{
  color: #000000;
}
</style>


