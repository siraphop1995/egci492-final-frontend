<template>
  <v-toolbar >
    
  <v-spacer></v-spacer>
  <v-toolbar-items >
  <v-btn flat router to="/newsfeed">News Feed</v-btn>
  <v-layout>
    <v-flex>
      <img src="@/assets/logo.png" width="320px" />
    </v-flex>
  </v-layout>
   <v-btn flat outer to="/myprofile">My Profile</v-btn>     
  </v-toolbar-items>
  <v-spacer></v-spacer>
  
  </v-toolbar>
</template>

<script>
export default {
  name: "Toolbar",
  data() {
    return {

    };
  }
};
</script>
