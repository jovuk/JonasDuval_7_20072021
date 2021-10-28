<template>
  <CallToLogin v-if="!isLoggedIn" />
  <div v-else  class="articles">
    <div>
      <p>Salut {{ user.username }}, dit nous ce que tu penses :</p>
    </div>
    <div>
      <ValidationObserver v-slot="{ invalid, handleSubmit }">
        <form @submit.prevent="handleSubmit(saveArticle)">
          <ValidationProvider name="article.title" rules="required">
          <div slot-scope="{ errors }">
            <label for="title">Titre:</label>
            <input type="text" id="title" name="title" v-model="article.title">
            <p class="error">{{ errors[0] }}</p>
          </div>
          </ValidationProvider>
          <ValidationProvider name="article.content" rules="required">
          <div slot-scope="{ errors }">
            <textarea type="text" name="write_up" v-model="article.content" placeholder="Write up..."></textarea>
            <p class="error">{{ errors[0] }}</p>
          </div>
          </ValidationProvider>
          <ValidationProvider name="article.image" rules="">
          <div slot-scope="{ errors }">
            <div v-if="!article.image">
              <h2>Select an image</h2>
              <input type="file" @change="onFileChange">
              <p class="error">{{ errors[0] }}</p>
            </div>
            <div v-else>
              <img :src="article.image" />
              <button v-bind:disabled="invalid" @click="removeImage">Remove image</button>
            </div>
          </div>
          </ValidationProvider>

          <button type="submit">Submit</button>
        </form>
      </ValidationObserver>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import ArticleDataService from "@/services/ArticleDataService";
import CallToLogin from "@/components/CallToLogin";
import { ValidationProvider, ValidationObserver } from 'vee-validate'


export default {
  name: 'AddArticles',
  components: {
    ValidationProvider,
    ValidationObserver,
    CallToLogin
  },
  data() {
    return {
      article: {
        title: '',
        content: '',
        date: new Date(),
        userId: '',
        image:'',
        isActive: true,
        comments: [],
        likesCount: 0
      },
      submitted: false,
      file:'',
      errors: []
    };
  },
  computed: {
    ...mapGetters(['isLoggedIn','isUserAdmin' ]),
    ...mapState({
      token: "token",
      userId: "userId",
      user: "user",
      users: "users"
    }),
  },
  methods: {

    onFileChange(e) {
      this.file = e.target.files[0]
    },

    removeImage: function () {
      this.file = '';
    },

    saveArticle() {
      let payload = new FormData();
      payload.append('image', this.file, this.file.name)
      payload.append('title', this.article.title)
      payload.append('content', this.article.content)
      payload.append('date', this.article.date)
      payload.append('userId', this.userId)
      payload.append('isActive', this.article.isActive)
      payload.append('comments', this.article.comments)
      payload.append('likesCount', this.article.likesCount)

      ArticleDataService.createArticle(payload, { Authorization: `Bearer ${this.token}` })
          .then(() => {
            this.submitted = true;
            this.$router.push({ path: "/articles" });
          })
          .catch(error => console.log(error));
    },

    logout() {
      this.$store.commit("logout");
      this.$router.push({ path: "/" });
      localStorage.clear();
    },
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
ul {
  list-style: none;
}
.error{
  color: #000000;
}
</style>
