<template>
  <v-card
      class="mx-auto"
      max-width="1000"
  >
    <v-card-title>
      <h3>{{ article.title }}</h3>
    </v-card-title>

    <v-card-text class="font-weight-light" v-if="$route.path === `/articles/${article.id}`">
      {{ article.content }}
    </v-card-text>
    <v-card-text class="font-weight-light" v-else>
      {{ content }}
    </v-card-text>
    <v-img v-if="article.image !== '' && $route.path === `/articles/${article.id}`"
        class="white--text align-end"
        height="450px"
        :src="article.image"
    ></v-img>
    <v-img v-else
           class="white--text align-end"
           height="200px"
           :src="article.image"
    ></v-img>

    <v-card-actions>
      <v-list-item class="grow">
        <v-list-item-avatar color="grey darken-1">
          <v-img
              class="elevation-6"
              :alt="articleUser.username"
              :src="articleUser.image"
          ></v-img>
        </v-list-item-avatar>

        <v-list-item-content>
          <v-list-item-title><strong>{{ articleUser.username }}</strong></v-list-item-title>
        </v-list-item-content>

        <v-row
            align="center"
            justify="end"
        >
          <v-btn
              icon
              color="#ae5157"
              @click="sendLike"
            >.
            <v-icon>mdi-heart</v-icon>
          </v-btn>
          <span class="subheading mr-2">{{ article.likesCount }}</span>
          <router-link :to="`/articles/${article.id}`">
            <v-btn
                icon
                color="#ae5157"
            >.
              <v-icon>mdi-eye</v-icon>
            </v-btn>
          </router-link>
          <router-link :to="`/articles/${article.id}/comments`">
            <v-btn
                icon
                color="#ae5157"
            >.
              <v-icon>mdi-chat-plus-outline</v-icon>
            </v-btn>
          </router-link>
        </v-row>
      </v-list-item>
    </v-card-actions>
  </v-card>
</template>


<script>
import ArticleDataService from "@/services/ArticleDataService";
import { mapState } from "vuex";

export default {
  name: "ArticlesItem",
  props: {
    article: {
      type: Object,
      required: true
    },
  },
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      user: "user",
      token: "token",
      users: "users",
    }),
    content: function () {
      if (this.article.content && this.article.content.length < 130) {
        return this.article.content
      } else {
        return this.article.content.substring(0, 150) + "..."
      }
    },
    articleUser: function () {
      if(this.users.length > 0 && this.article.userId > 0) {
        return this.users.find(x => x.id == this.article.userId)
      }
      return {  id: 0, image: "anonyme.jpeg", username:"anonyme"}
    },
    /*username: function() {
      return "Anonyme"
      /!*const username = this.users.find(x => x.id === this.article.userId)
      return username.username*!/
    },
    image: function() {
      if(this.users.length > 0 && this.article.userId > 0) {

        const image = this.users.find(x => x.id == this.article.userId)
        if(image.hasOwnProperty("image")){
          return image.image
        }
      }
      return "Anonyme"
    }*/
  },
  methods: {
    sendLike() {
      const data = {
        articleId: this.article.id,
        userId: this.userId,
        like: 1,
      };
      const id = this.article.id;
      ArticleDataService.likeArticle(id, data, { Authorization: `Bearer ${this.token}` })
          .then((res) => {
            this.$emit('updated', {
              likesCount: res.data.total,
              id: this.article.id
            })
          })
          .catch(error => console.log(error));
    },

    logout() {
      this.$store.commit("logout");
      this.$router.push({ path: "/" });
    },
  }
}
</script>

<style scoped lang="scss">
.v-list-item__content{
  flex: none;
}
.v-application a {
  text-decoration: none;
  color: black;
}
</style>
