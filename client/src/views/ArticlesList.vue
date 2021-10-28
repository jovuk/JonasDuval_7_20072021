<template>
  <main>
    <CallToLogin v-if="!isLoggedIn" />
    <div v-else>
      <h2>Plateforme de partage d'articles</h2>
      <div>
        <h3>Derniers articles postés</h3>
        <div class="articleList">
            <ul>
              <li v-for="article in articles" :key="article.id" class="articleList">
                <ArticlesItem
                    :article="article"
                    @updated="changed"
                />
              </li>
            </ul>
        </div>
        <p v-if="articles.length === 0">{{ message }}</p>
      </div>
    </div>
  </main>
</template>

<script>
import { mapGetters, mapState, mapMutations } from "vuex";
import ArticleDataService from "@/services/ArticleDataService";
import ArticlesItem from "@/components/ArticlesItem";
import CallToLogin from "@/components/CallToLogin";

export default {
  name: 'ArticlesList',
  components: {
    ArticlesItem,
    CallToLogin
  },
  data () {
    return {
      articles:[],
      activeArticle: null,
      message: "Il n'y a aucun article posté sur la plateforme à ce jour."
    }
  },
  computed: {
    ...mapMutations(['setUser']),
    ...mapGetters(['isLoggedIn']),
    ...mapGetters(['isUserAdmin']),
    ...mapState({
      token: "token",
      users: 'users'
    }),
  },
  methods: {
    getAllArticles() {
      ArticleDataService.getAllArticles({ Authorization: `Bearer ${this.token}`})
          .then(response => {
            this.articles = response.data;
          })
          .catch(error => console.log(error));
    },

    changed(data) {
      let article = this.articles.find((article) => {
        return article.id == data.id;
      })
      article.likesCount = data.likesCount;
    },

    logout() {
      this.$store.commit("logout");
      this.$router.push({ path: "/" });
      localStorage.clear();
    }
  },
  beforeMount() {
    this.getAllArticles();
  }
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
  background-color: #4CAF50;
  color: white;
  padding: 12px 20px;
  cursor: pointer;
  border-radius:30px;
  margin: 10px;
}
button[type=submit]:hover {
  background-color: #45a049;
}
input {
  width:60%;
  margin: 15px;
  border: 0;
  box-shadow:0 0 15px 4px rgba(0,0,0,0.06);
  padding:10px;
  border-radius:30px;
}
textarea {
  width:75%;
  resize: vertical;
  padding:15px;
  border-radius:15px;
  border:0;
  box-shadow:0 0 15px 4px rgba(0,0,0,0.06);
  height:150px;
  margin: 15px;
}
ul {
  list-style: none;
}
.articleList {
  margin: 15px;
}
</style>
