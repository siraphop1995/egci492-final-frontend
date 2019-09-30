<template>
  <v-app>
    <!-- <img src="./assets/logo.png"> -->
    <Toolbar v-if="isSignin" />
    <router-view />
  </v-app>
</template>

<script>
import axios from "axios";
import Toolbar from "@/components/Toolbar";

export default {
  name: "App",
  data() {
    return {
      isSignin: false
    };
  },
  components: { Toolbar },
  created() {
    this.redirectGuestToLogin();

    Event.$on("signin", () => {
      this.setDefault();
      this.$router.push("/newsfeed");
    });

    Event.$on("signout", () => {
      this.isSignin = false;
      this.redirectGuestToLogin();
    });
  },
  methods: {
    redirectGuestToLogin() {
      window.token = this.$cookies.get("token");
      if (this.$route.path == "/signup") {
      } else if (token) {
        this.setDefault();
        this.authentication();
      } else {
        this.$router.push("/signin");
      }
    },
    setDefault() {
      this.isSignin = true;

      window.guser = this.$cookies.get("user");
      window.token = this.$cookies.get("token");

      window.axios = axios;
      window.axios.defaults.headers.common = {
        Authorization: "Bearer " + token,
        userid: guser._id
      };
    },
    authentication() {
      axios
        .get("/authentication")
        .then(response => {
          if (response.status == 200) {
            console.log("auth");
          }
        })
        .catch(error => {
          console.log("err");
          //return this.$router.push("/logout");
          console.log(error);
        });
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  
}
#gold {
  background-color:#ad974f;
}
a {
  color: #ad974f;
}
</style>
