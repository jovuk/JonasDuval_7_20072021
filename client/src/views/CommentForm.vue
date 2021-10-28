<template>
  <CallToLogin v-if="!isLoggedIn" />
  <div v-else  class="comment">
    <div>
      <p>Salut {{ user.username }}, dit nous ce que tu penses :</p>
    </div>
    <div>
      <form @submit.prevent="postComment">
        <div>
          <label for="title">Commentaire:</label>
          <input type="text" name="comment" v-model="comment.content">
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  </div>
</template>


<script>
import CommentDataService from "../services/CommentDataService"
import CallToLogin from "../components/CallToLogin"
import {mapGetters, mapState} from 'vuex'

export default {
  name: 'CommentForm',
  components: {
    CallToLogin
  },
  data () {
    return {
      comment: {
        content: "",
        userId: "",
        articleId: 0,
        date: "",
      },
      submitted: false,
      message:"",
    }
  },
  computed: {
    ...mapState({
      token: "token",
      userId: "userId",
      user: "user"
    }),
    ...mapGetters(['isLoggedIn']),
  },
  methods: {
    postComment(articleId, data, Authorization) {
      data = {
        content: this.comment.content,
        userId: this.userId,
        articleId: this.$route.params.id,
        date: new Date,
      };
      Authorization = `Bearer ${this.token}`;
      articleId = this.$route.params.id;
      CommentDataService.createComment(articleId, data, { Authorization })
          .then(() => {
            this.submitted = true;
            this.message = "Votre commentaire a bien été posté !"
            this.$router.push('/articles')
          })
          .catch(error => console.log(error));
      }
    }
}
</script>

<style scoped lang="scss">
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
</style>
