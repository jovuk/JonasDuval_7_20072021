<template>
  <main>
    <div class="jumbotron container comment">
      <h1 class="comment__msg">{{ message }}</h1>
      <div class="row">
        <div class="container col-12 col-md-10">
          <div class='row'>
            <div v-if="!deleted" class="col-12 col-md-9 comment__box">
              <CommentsItem
                  :id="currentComment.id"
                  :content="currentComment.content"
                  :userId="currentComment.userId"
                  :date="currentComment.date"
                  :isActive="currentComment.isActive" />
            </div>
            <div class="comment__btnBox">
              <div v-if="validUser && !deleted" class="comment__btns">
                <button @click="showUpdate" type= "button" class="btn btn-primary"><i class="fas fa-edit"></i></button>
                <button @click="deleteComment" type= "button" class="btn btn-primary"><i class="far fa-trash-alt"></i></button>
              </div>

              <div>
                <router-link to="/articles" aria-label="Lien vers la liste d'articles"><button type= "button" class="btn btn-primary"><i class="fas fa-arrow-left"></i> Retour à la liste</button></router-link>
                <router-view />
              </div>
            </div>
            <div v-if="updateIsAsked" class="formUpComment container">
              <h2 class="formUpComment__title">Mettez à jour votre commentaire :</h2>
              <div class="row">
                <div class="col-12 col-md-9 text-center formUpComment__box">
                  <div class="form-group">
                    <label for="content"></label>
                    <textarea
                        type="textarea"
                        rows="5"
                        cols="30"
                        class="form-control"
                        required
                        v-model="currentComment.content"
                        placeholder="content"
                        name="content" />
                  </div>
                  <button class="btn btn-success" @click="updateComment">Valider</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import CommentsItem from "../components/CommentsItem"
import CommentDataService from "../services/CommentDataService"
import { mapGetters, mapState } from 'vuex'

export default {
  name: "CommentDetails",
  components: {
    CommentsItem,
  },
  data () {
    return {
      message: "",
      deleted: null,
      currentComment: {
        id: 0,
        content: "",
        userId: 0,
        date: "",
        isActive:""
      },
      alreadyCommented: false,
      validUser: false,
      updateIsAsked: false,
    }
  },
  computed: {
    ...mapGetters(['isLoggedIn']),
    ...mapGetters(['isUserAdmin']),
    ...mapState({ token: "token"}),
    ...mapState({ user: "user"}),
    ...mapState({ userId: "userId"}),
    ...mapState({ isAdmin: "isAdmin"})
  },
  methods: {
    getOneComment(articleId, commentId, Authorization) {
      Authorization = `Bearer ${this.token}`;
      CommentDataService.getOneComment(this.$route.params.articleId, this.$route.params.commentId, { Authorization })
          .then(response => {
            this.currentComment = response.data[0];
            this.validUser = this.currentComment.userId === this.userId || this.isAdmin === 1;
          })
          .catch(error => console.log(error));
    },

    showUpdate() {
      this.updateIsAsked = true;
    },

    updateComment(articleId, commentId, data, Authorization) {
      data = {
        content: this.currentComment.content,
        userId: this.userId,
        date: new Date,
      };
      Authorization = `Bearer ${this.token}`;
      CommentDataService.update(this.$route.params.articleId, this.$route.params.commentId, data, { Authorization })
          .then(() => {
            this.message = "Votre commentaire a bien été modifié";
            this.updateIsAsked = false;
          })
          .catch(error => console.log(error));
    },

    deleteComment(articleId, commentId, Authorization) {
      Authorization = `Bearer ${this.token}`;
      CommentDataService.delete(this.$route.params.articleId, this.$route.params.commentId, { Authorization })
          .then(() => {
            this.message = "Votre commentaire a bien été supprimé";
            this.deleted = true;
            let previousComments = JSON.parse(localStorage.getItem("alreadyCommented"));
            previousComments = previousComments.filter(item => (item !== this.$route.params.commentId));
            localStorage.setItem("alreadyCommented", JSON.stringify(previousComments));
          })
          .catch(error => console.log(error));
    },

    logout() {
      this.$store.commit("logout");
      this.$router.push({ path: "/" });
      localStorage.clear();
    }
  },
  beforeMount() {
    this.getOneComment(this.$route.params.articleId, this.$route.params.commentId);
  }
}
</script>

<style lang="scss">

$color-primary: #cc2810;
$color-secondary: #324392;

.comment {
  margin-bottom: 0!important;
  &__btns {
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
    margin-bottom: 20px;
  }
  &__box {
    margin-top: 40px!important;
    margin-bottom: 120px!important;
  }
  &__btnBox {
    margin: auto!important;
    margin-top: 40px!important;
  }
  &__msg {
    margin-top: 120px;
    margin-bottom: 40px!important;
    font-size: 1.2em!important;
    color:$color-secondary;
  }
}

.formUpComment {
  position: absolute;
  top: 10%;
  width: 50%;
  z-index: 2;
  background: #DDD;
  padding: 20px;
  margin: auto;
  border: 1px solid $color-secondary;
  &__box {
    margin: auto;
  }
  &__title {
    margin-bottom: 15px!important;
  }
}

h1 {
  margin-bottom: 0px!important;
}


/*ANIMATION A L'ARRIVEE SUR LA PAGE*/
.comment {
  &__box {
    animation: leftShow 700ms both ease-in-out;
  }
  &__btnBox {
    animation: rightShow 700ms both ease-in-out;
  }
}


.formUpComment {
  animation: opacity 700ms both ease-in-out;
}


//Média query pour adapter la page à la tablette
@media screen and (min-width : 768px) and (max-width : 1024px) {
  .comment__box {
    margin: auto!important;
  }
}

//Média query pour adapter la page au smartphone
@media screen and (max-width : 768px) {
  .comment__box {
    margin-bottom: 40px!important;
  }
}


</style>
