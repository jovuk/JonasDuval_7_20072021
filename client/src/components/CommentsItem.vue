<template>
  <v-expansion-panels>
    <v-expansion-panel>
      <v-expansion-panel-header>
          Commentaire de {{userOwnerComment.username}} : {{ content}}
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        {{ content }}
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import UsersDataService from "@/services/UsersDataService";
import {mapGetters, mapState} from "vuex";

export default {
  name: "CommentsItem",
  props: {
    id: {
      type: Number,
      required: true
    },
    userId: {
      type: Number,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      userOwnerComment: 0,
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
    ...mapState(['user'])
  },
  methods: {
    getUserOfTheArticle(userId) {
      UsersDataService.getOneUser(userId  , { Authorization: `Bearer ${this.token}`})
          .then(response => {
            this.userOwnerComment = response.data;
          })
          .catch(error => console.log(error));
    },

    logout() {
      this.$store.commit("logout");
      this.$router.push({ path: "/" });
    }
  },
  beforeMount() {
    this.getUserOfTheArticle(this.userId);
  }
}

</script>

<style scoped lang="scss">
</style>
