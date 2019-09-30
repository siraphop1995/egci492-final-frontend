<template>
  <v-dialog max-width="410px" v-model="dialog">
    <v-btn small fab dark class="light-blue darken-4" slot="activator">
      <v-icon>edit</v-icon>
    </v-btn>
    <v-card>
      <v-card-text>
        <v-form ref="form" class="px-3">
          <!-- <v-btn color="grey lighten-1">
              <v-icon left>edit</v-icon>Change Profile Photo
          </v-btn>-->
          <v-text-field
            v-model="User.username"
            :rules="requiredRules"
            label="Username"
            prepend-icon="edit"
            color="orange"
          ></v-text-field>
          <v-text-field
            v-model="User.firstName"
            :rules="requiredRules"
            label="First Name"
            prepend-icon="edit"
            color="orange"
          ></v-text-field>
          <v-text-field
            v-model="User.lastName"
            :rules="requiredRules"
            label="Last Name"
            prepend-icon="edit"
            color="orange"
          ></v-text-field>
          <v-text-field
            v-model="User.email"
            :rules="emailRules"
            label="Email"
            prepend-icon="edit"
            color="orange"
          ></v-text-field>
          <v-spacer></v-spacer>
          <v-btn flat dark @click="updateUser" class="mx-0 mt-3" id="gold">Update</v-btn>
          <v-btn flat dark @click="dialog=!dialog" class="mx-0 mt-3" id="gold">Cancel</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: "EditProfile",
  data() {
    return {
      User: [],
      editUser: [],
      dialog: false,
      requiredRules: [v => !!v || "required to fill"],
      emailRules: [
        v => !!v || "E-mail is required",
        v =>
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v) ||
          "E-mail must be valid"
      ]
    };
  },
  methods: {
    async updateUser() {
      let newUser = {
        username: this.User.username,
        firstName: this.User.firstName,
        lastName: this.User.lastName,
        email: this.User.email
      };
      console.log(newUser);
      try {
        const response = await axios.post("/users/" + this.User._id, newUser);
        this.$cookies.set("user", response.data);
        this.dialog = false;
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  },
  created() {
    this.User = this.$cookies.get("user");
  }
};
</script>

<style>
#gold {
  background-color: #ad974f;
}
</style>


