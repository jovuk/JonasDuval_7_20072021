<template>
  <div>
    <div v-if="currentArticle" id="currentArticle">
      <ArticlesItem
          :article="currentArticle"
          @updated="changed"
        />
      <div v-if="validUser || isAdmin" id="button-modification">
        <v-btn
            class="mx-2"
            fab
            dark
            small
            color="#122248"
            @click="showUpdate"
        >
          <v-icon dark>
            mdi-pencil
          </v-icon>
        </v-btn>
        <v-btn
            class="mx-2"
            fab
            dark
            small
            color="#122248"
            @click="deleteArticle"
        >
          <v-icon dark>
            mdi-delete
          </v-icon>
        </v-btn>
        <router-view />
      </div>
      <div v-else class="action invalid">
        <router-view />
      </div>
      <ul id="commentsList">
        <li v-for="comment in comments" :key="comment.id">
          <CommentsItem
              :id="comment.id"
              :userId="comment.userId"
              :content="comment.content"
              :isActive="comment.isActive"
              :date="comment.date"
               />
        </li>
      </ul>
    </div>
    <div v-if="askForUpdate">
      <div role="form" class="container text-center formUpdate">
        <h2 >Pour modifier cet article, merci de remplir les champs suivants :</h2>
        <form @submit.prevent="updateArticle">
          <div>
            <label for="title">Titre:</label>
            <input type="text" name="title" v-model="currentArticle.title">
          </div>
          <div>
            <textarea name="write_up" v-model="currentArticle.content" placeholder="Nouvelle description..."></textarea>
          </div>
          <div>
            <div>
              <h2>Select an image</h2>
              <input type="file" @change="onFileChange">
            </div>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  </div>
</template>


<script>
import ArticlesItem from "../components/ArticlesItem"
import CommentsItem from "../components/CommentsItem"
import { mapGetters, mapState } from 'vuex'
import ArticleDataService from "@/services/ArticleDataService";
import CommentDataService from "@/services/CommentDataService";

export default {
  name: "ArticleDetails",
  components: {
    ArticlesItem, CommentsItem
  },
  data () {
    return {
      currentArticle: {},
      comments: [],
      liked: false,
      likesCount: 0,
      validUser: false,
      askForUpdate: false,
      confirmation: false,
      messageUpdate: ""
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
    ...mapGetters(['isUserAdmin']),
    ...mapState({ token: "token"}),
    ...mapState({ userId: "userId"}),
    ...mapState({ isAdmin: "isAdmin"}),
    ...mapState({ user: "user"})
  },
  methods: {
    getOneArticle(id, Authorization) {
      Authorization = `Bearer ${this.token}`;
      ArticleDataService.getOneArticle(id, { Authorization })
          .then(response => {
            this.currentArticle = response.data;
            localStorage.setItem("articleId", this.currentArticle.id);
            if (this.currentArticle.userId !== this.userId) {
              this.validUser = false;
            } else if (this.isAdmin) {
              this.validUser = true;
            } else {
              this.validUser = true;
            }
          })
          .catch(error => console.log(error));
    },
    showUpdate() {
      return (this.askForUpdate = true);
    },

    onFileChange(e) {
      this.file = e.target.files[0]
    },

    changed(data) {
      this.currentArticle.likesCount = data.likesCount
    },

    updateArticle(id, data, Authorization) {
      let payload = new FormData();
      payload.append('image', this.file)
      payload.append('title', this.currentArticle.title)
      payload.append('content', this.currentArticle.content)

      Authorization = `Bearer ${this.token}`;
      const articleId = this.currentArticle.id;
      ArticleDataService.updateArticle(articleId, payload, { Authorization })
          .then(() => {
            this.messageUpdate = "Cet article a été modifié avec succès.";
            this.askForUpdate = false;
          })
          .catch(error => console.log(error));
    },

    deleteArticle(id, Authorization) {
      Authorization = `Bearer ${this.token}`;
      ArticleDataService.deleteArticle(this.currentArticle.id, { Authorization })
          .then(() => {
            this.$router.push({ path: "/articles" });
          })
          .catch(error => console.log(error));
    },

    logout() {
      this.$store.commit("logout");
      this.$router.push({ path: "/" });
      localStorage.clear();
    },

    getAllComments() {
      const articleId = this.$route.params.id
      CommentDataService.getAllComments(articleId, { Authorization: `Bearer ${this.token}`})
          .then(response => {
            this.comments = response.data;
            this.comments.forEach(comment => {
              if (comment.userId === this.userId) {
                let previousComments = JSON.parse(localStorage.getItem("alreadyCommented"));
                if (previousComments && previousComments.length !== 0) {
                  previousComments.push(this.currentArticle.articleId);
                  localStorage.setItem("alreadyCommented", JSON.stringify(previousComments));
                } else {
                  let previousComments = [];
                  previousComments[0] = this.currentArticle.articleId;
                  localStorage.setItem("alreadyCommented", JSON.stringify(previousComments));
                }
              }
            });
          })
          .catch(error => console.log(error));
    },

  },
  beforeMount() {
    this.getOneArticle(this.$route.params.id);
    this.getAllComments(this.$route.params.id);
    this.askForUpdate = false;
    this.validUser = false;
  }
}
</script>

<style scoped lang="scss">
#button-modification{
  display: flex;
  justify-content: center;
  margin: 10px;
}
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
  margin: 10px;
}
button[type=submit]:hover {
  background-color: #d36c73;
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
#currentArticle{
  margin: 30px auto;
}
ul{
  list-style: none;
}
#commentsList{
  max-width: 1000px;
  margin: 0 auto;
  padding: 0;
  background-color: #F5F5F5;

}
</style>
