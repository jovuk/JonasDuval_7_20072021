<template>
  <div class="call">
    <h2>Pour profiter des fonctionnalités de cette plate-forme, merci de vous identifier ou de créer un compte !</h2>
    <router-link to="/signup" class="call__signup"><button  type= "button" class="btn btn-primary auth__btn"><i class="fas fa-user-plus"></i> Signup</button></router-link>
    <router-link to="/login" class="call__login"><button type= "button" class="btn btn-primary auth__btn"><i class="fas fa-sign-in-alt"></i> Login</button></router-link>
    <router-view />
  </div>
</template>

<script>

export default {
  name: "CallToLogin"
}

</script>

<style scoped lang="scss">

.call {
  position: absolute;
  top: 35%;
  z-index: 2;
  max-width: 50%;
  margin-left: 20%;
  background-color: #DDD;
  border-radius: 20px;
  border: 1px solid #d36c73;
  padding: 50px;
  &__signup {
    margin-right: 20px;
    color: #122248;
  }
  &__login {
    color: #122248;

  }
}

@media screen and (max-width : 768px) {
  .call {
    top: 30%;
    max-width: 95%;
    margin-left: 2%;
  }
}

</style>
