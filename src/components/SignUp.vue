<template>
  <v-container fluid fill-height class="back">
    <v-layout column align-center justify-center>
      <v-card width="410px" height="auto" class="elevation-8">
        <v-card-title>
          <v-layout column align-center pt-2>
            <p class="headline">Sign Up</p>
          </v-layout>
        </v-card-title>

        <v-card-text class="px-4 py-0">
          <v-form ref="form">
            <v-text-field
              label="Username"
              v-model="User.username"
              :rules="requiredRules"
              :error-messages="error_msg"
              color="amber accent-4"
              autofocus
            ></v-text-field>
            <v-text-field
              label="Password"
              :type="'password'"
              v-model="User.password"
              :rules="passwordRules"
              color="amber accent-4"
            ></v-text-field>
            <v-text-field
              label="Confirm Password"
              :type="'password'"
              v-model="confirmPassword"
              :rules="confirmPasswordRules"
              color="amber accent-4"
            ></v-text-field>
            <v-text-field label="Firstname" v-model="User.firstName" :rules="requiredRules" color="amber accent-4"></v-text-field>
            <v-text-field label="Lastname" v-model="User.lastName" :rules="requiredRules" color="amber accent-4"></v-text-field>
            <v-text-field label="Email" v-model="User.email" :rules="emailRules" color="amber accent-4"></v-text-field>
          </v-form>
        </v-card-text>

        <v-card-actions class="px-3">
          <v-layout wrap py-3 px-0 ma-0>
            <v-flex pt-3 xs12>
              <v-btn class="ma-0" id="gold" block round @click="addToAPI">Create New Account</v-btn>
            </v-flex>
            <v-flex class="text-xs-center" pt-4>
              <p class="caption">
                <span>Already Registed?</span>
                <a href="/signin">Sign In now</a>
              </p>
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
  name: "SignUp",
  data() {
    return {
      User: {
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: ""
      },
      confirmPassword: "",
      error_msg: [],
      inputRules: [
        v => !!v || "required to fill",
        v => v.length >= 8 || "must be more than 8 characters"
      ],
      requiredRules: [v => !!v || "required to fill"],
      passwordRules: [
        v => !!v || "Password confirmation is required",
        v => v.length >= 8 || "Password must be more than 8 characters",
        v =>
          v.match(/[0-9]/g) !== null ||
          "Password must contain at least one number"
      ],
      confirmPasswordRules: [
        v => !!v || "Password confirmation is required",
        v => v == this.User.password || "Password must match"
      ],
      emailRules: [
        v => !!v || "E-mail is required",
        v =>
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "E-mail must be valid"
      ]
    };
  },
  methods: {
    async addToAPI() {
      // this.$refs.form.validate()
      if (this.$refs.form.validate()) {
        try {
          const userRes = await axios.post("/signup", this.User);
          //creating Main Album
          console.log(userRes);
          let newAlbum = {
            name: "Default_"+this.User.username,
            imageData: [],
            type: "main",
            ownerId: userRes.data._id,
            ownerUsername: userRes.data.username,
            description: "This is main album of user"
          };
          console.log(newAlbum)
          var albumRes = await axios.post("/albums", newAlbum);

          this.$router.push("/signin");
        } catch (error) {
          console.log(error);
          if (error.response.status == 400) {
            this.error_msg = "username already existed";
          }
        }
        // axios
        //   .post("/signup", this.User)
        //   .then(response => {
        //     this.$router.push("/signin");
        //   })
        //   .catch(error => {
        //     console.log(error.response.status);
        //     if (error.response.status == 400) {
        //     this.error_msg="username already existed"
        //   }
        //   });
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