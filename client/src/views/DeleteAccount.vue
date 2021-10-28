<template>
  <CallToLogin v-if="!isLoggedIn" />
  <div v-else>
    <h1>Etes-vous sûr de vouloir supprimer votre compte ?</h1>
    <button type="submit" @click="deleteAccount">Oui</button>
    <button type="button" @click="article">Non</button>
  </div>
</template>

<script>
import CallToLogin from "../components/CallToLogin"
import UsersDataService from "@/services/UsersDataService";
import {mapGetters, mapState, mapMutations} from 'vuex'

export default {
  name: 'DeleteAccount',
  components: {
    CallToLogin
  },
  computed: {
    ...mapState({
      user: "user",
      users: "users"
    }),
    ...mapGetters(['isLoggedIn']),
  },
  ...mapMutations([
    'setUser',
    'setToken',
  ]),
  methods: {
    article() {
      this.$router.push({ path: "/articles" });
    },
    deleteAccount() {
      const userId = this.user.id;
      UsersDataService.deleteUser(userId)
      .then(()=> {
        this.$store.commit("logout");
        //supprimer le user des users
        localStorage.clear();
        this.$router.push({ path: "/signup" });
      })
      .catch((error) => error)
    }
  },

}

</script>

<style>
button {
  padding: 12px 20px;
  cursor: pointer;
  border-radius:30px;
  margin: 10px;
}

button[type=submit] {
  color: white;
  background-color: #ca9494;
}
button[type=submit]:hover {
  background-color: #d36c73;
}
</style>
