<template>
  <div id="nav">
    <router-link to="/">Accueil</router-link><br><v-divider class="router-link"></v-divider>
    <router-link to="/articles">Voir tous les articles</router-link><br><v-divider class="router-link"></v-divider>
    <router-link to="/articles/add">Ajouter un article</router-link><br><v-divider class="router-link"></v-divider>
    <span v-if="isLoggedIn">
      <a @click="logout">Logout</a><v-divider class="router-link"></v-divider>
      <router-link :to="`/delete-account/${user.id}`">Supprimer mon compte</router-link>
    </span>
    <span v-else>
      <router-link to="/signup">Signup</router-link><br><v-divider class="router-link"></v-divider>
      <router-link to="/login">Login</router-link><br>
    </span>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: 'NavBar',
  computed : {
    isLoggedIn : function(){ return this.$store.getters.isLoggedIn},
    ...mapState({ user: "user" })
  },
  methods: {
    async logout() {
      await this.$store.dispatch("logout");
      this.$router.push("/login");
    },
  },
}
</script>

<style>
#nav {
  padding: 35px;
}
#nav a {
  font-weight: bold;
  color: #122248;
  text-decoration: none;
}
a:hover {
  cursor: pointer;
}

#nav a:hover {
  color: #d3545c;
}

#nav a.router-link-exact-active {
  color: #7E2027;
}
.router-link{
  margin: 7px auto;
}

</style>
