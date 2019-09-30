<template>
  <v-container fluid fill-height class="back">
    <v-layout column align-center justify-center>
      <v-card width="410px" height="auto" class="elevation-8">
        <v-card-title>
          <v-layout column align-center pt-2>
            <p class="headline">Sign In</p>
            <p class="caption">
              <span>or</span>
              <a href="/signup">create an account</a>
            </p>
          </v-layout>
        </v-card-title>
        <v-card-text class="px-4 py-0">
          <v-form @keyup.enter="logItIn">
            <v-text-field
              v-model="login.username"
              label="Username"
              :error-messages="error_msg"
              required
              autofocus
              color="orange"
            ></v-text-field>
            <v-text-field
              v-model="login.password"
              label="Password"
              type="password"
              :error-messages="error_msg"
              required
              color="orange"
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions class="px-3">
          <v-layout wrap py-3 px-0 ma-0>
            <!-- <v-flex class="text-xs-right">
            <a href="/forgotpassword">Forgot password?</a></v-flex>-->
            <v-flex pt-4 xs12>
              <v-btn class="ma-0" id="gold" dark block round @click="logItIn">Sign In</v-btn>
            </v-flex>
          </v-layout>
        </v-card-actions>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  name: "SignIn",
  data() {
    return {
      login: {
        username: "",
        password: ""
      },
      error_msg: []
    };
  },
  methods: {
    async logItIn() {
      try {
        const response = await axios.post("/signin", this.login);
        console.log("1")
        console.log(response.data)
        let token = response.data.token;
        let user = response.data.user;
        this.$cookies.set('user',user);
        this.$cookies.set('token',token);

        Event.$emit("signin");
      } 
      catch (error) {
        console.log("2")
        console.log(error);
        if (error.response.status == 401) {
          this.error_msg = "username or password is incorrect";
        }
      }

    }
  }
};
</script>

<style>
.back {
  background-image: url("https://i.pinimg.com/originals/7a/04/82/7a04822185459b8d8e0b2249d50e0578.png");
  background-size: cover;
}
#gold {
  background-color:#ad974f;
}
a {
  color: #ad974f;
}
</style>
