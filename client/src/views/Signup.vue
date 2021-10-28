<template>
  <div class="register">
    <div>
      <ValidationObserver v-slot="{ invalid, handleSubmit }">
        <form @submit.prevent="handleSubmit(createUser)">
          <ValidationProvider name="username" rules="required|minmax:3,10">
            <div slot-scope="{ errors }">
              <label for="username">Username:</label>
                  <input type="text" id="username" name="username" v-model="user.username">
                  <p class="error">{{ errors[0] }}</p>
              </div>
          </ValidationProvider>
          <ValidationProvider name="email" rules="required|email">
            <div slot-scope="{ errors }">
              <label for="email">Email:</label>
                <input type="text" id="email" name="email" v-model="user.email">
                <p class="error">{{ errors[0] }}</p>
            </div>
          </ValidationProvider>
          <ValidationProvider name="password" rules="required|password">
          <div slot-scope="{ errors }"  >
            <label for="password">Password:</label>
            <input type="password" id="password" name="password" v-model="user.password">
            <p class="error">{{ errors[0] }}</p>
          </div>
          </ValidationProvider>
          <ValidationProvider rules="">
          <div v-if="!user.image" slot-scope="{ errors }">
            <label for="image">Image:</label>
            <input type="file" id="image" @change="onFileChange">
            <p class="error">{{ errors[0] }}</p>
          </div>
          <div v-else>
            <img :src="user.image" />
            <button @click="removeImage">Remove image</button>
          </div>
          </ValidationProvider>
          <button v-bind:disabled="invalid" type="submit">Submit</button>
        </form>
      </ValidationObserver>
    </div>
    <p v-if="showError" id="error">Something went wrong, please try again !</p>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import UsersDataService from "../services/UsersDataService";
import { ValidationProvider, ValidationObserver } from 'vee-validate'

export default {
  name: "Signup",
  components: {ValidationProvider, ValidationObserver},
  data() {
    return {
      user: {
        username: "",
        email: "",
        password: "",
        image: "",
        isAdmin: ""
      },
      errors: [],
      showError: false
    };
  },
  methods: {
    ...mapMutations([
      'setUser',
      'setUserId',
      'setToken',
      'setIsAdmin',
      'setUsers',
    ]),

    isRequired(value) {
      return value ? true : 'This field is required';
    },

    onFileChange(e) {
      this.file = e.target.files[0]
    },

    removeImage: function () {
      this.file = '';
    },
    createUser() {
      let payload = new FormData();
      payload.append('image', this.file)
      payload.append('username', this.user.username)
      payload.append('email', this.user.email)
      payload.append('password', this.user.password)
      payload.append('isAdmin', false)

      UsersDataService.signup(payload)
          .then(response => {
            this.setUser(response.data);
            this.setUsers(response.data);
            this.setUserId(response.data.id);
            this.setToken(response.data.token);
            this.setIsAdmin(response.data.isAdmin);
            this.$router.push('/articles');
          })
          .catch(() => this.showError = true);
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
  background-color: #ca9494;
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
.error{
  color: #000000;
}
</style>


