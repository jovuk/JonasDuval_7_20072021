<template>
  <v-app>
    <v-app-bar id="bar" fixed app :clipped-left="clipped">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="$vuetify.breakpoint.smAndDown" ></v-app-bar-nav-icon>
      <img src="./assets/icon-left-font-monochrome-white.svg" alt="Logo groupomania">
    </v-app-bar>
    <v-navigation-drawer :clipped="clipped"
                         v-model="drawer"
                         enable-resize-watcher
                         id="navigation-drawer"
                         absolute
                         :permanent="!$vuetify.breakpoint.smAndDown"
                         left
                         app>
      <profile  v-if="isLoggedIn">
      </profile >
      <NavBar  />
    </v-navigation-drawer>
    <v-main>
      <v-container id="container-content" fluid>
        <router-view/>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import Vuetify from "vuetify";
import NavBar from '@/components/NavBar.vue'
import Profile from '@/components/Profile.vue'

export default {
  name: 'App',
  vuetify: new Vuetify(),

  components: {
    NavBar,
    Profile
  },
  data: () => ({
    drawer: true,
    clipped: false,
  }),
  computed: {
    isLoggedIn : function(){ return this.$store.getters.isLoggedIn}
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0 auto;
  background-color: rgba(216, 216, 216, 0.39);
}

#navigation-drawer {
  background-color: #EBD6D6;
  position: fixed;
}

#bar{
  z-index: 1;
  display: flex;
  margin: auto;
  text-align: center;
  background-color: #D1D1D1;
}

img{
  justify-content: flex-end;
  width: 60%;
}
</style>

