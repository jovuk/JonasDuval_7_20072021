<template>
  <span>
    <v-avatar class="avatar"
              size="75">
      <img
          :src="User.image"
          :alt="User.username"
      >
    </v-avatar>
    <br>
    <span class="connected">Connecté <i class="fas fa-check-circle"></i></span><br>
  <span class="connected">{{ User.email }}</span>
  </span>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: 'Profile',
  components: {
  },
  data() {
    return {
    }
  },
  computed: {
    ...mapState({ User: "user" }),
    isLoggedIn : function(){ return this.$store.getters.isLoggedIn},
  },
};

</script>

<style>
.avatar{
  color: white;
  margin: 30px auto;
}
.fas.fa-check-circle{
  color: #025d02;
}
.connected{
  color: #122248;
}
</style>
