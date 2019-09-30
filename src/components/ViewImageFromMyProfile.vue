<template>
  <v-container>
    <v-layout>
      <v-flex xs1>
        <v-btn flat router to="/myprofile">
          <v-icon large>arrow_back</v-icon>
        </v-btn>
      </v-flex>
      <v-flex xs11>
        <v-card>
          <v-layout column>
            <v-flex>
              <v-layout>
                <v-flex sm1 class="ma-1">
                  <v-avatar>
                    <v-img
                      src="https://i.pinimg.com/564x/12/aa/a2/12aaa2fa0b7d6aa2e3f633bd3ced0102.jpg"
                    ></v-img>
                  </v-avatar>
                </v-flex>
                <v-flex sm1 class="mt-3">{{image.originalOwnerUsername}}</v-flex>
              </v-layout>
            </v-flex>
            <v-divider></v-divider>
            <v-flex>
              <v-img :src="image.url"></v-img>
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
          <v-layout>
            <v-flex xs2 md2 class="text-xs-left my-3 ml-3 font-weight-light">Description:</v-flex>
            <v-flex xs10 md10 class="text-xs-left my-3 font-weight-light">{{image.description}}</v-flex>
          </v-layout>
          <v-layout justify-start>
            <v-flex xs1 md1 class="text-xs-left my-1 ml-3 font-weight-light">Tags:</v-flex>
            <v-flex xs1 md1 v-for="tag in image.tags" :key="tag">
              <v-chip class="text-xs-left mb-3 font-weight-light">{{tag}}</v-chip>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import firebase from "firebase/app";
import "firebase/storage";

export default {
  name: "ViewImageFromMyProfile",
  data() {
    return {
      selectedRadio: 0,
      image: [],
      imageURL: "",
      imageDetail: {
        name: "",
        description: "",
        type: "copy",
        originalOwnerId: "",
        originalOwnerUsername: "",
        copyOwnerId: guser._id,
        copyOwnerUsername: guser.username,
        tags: []
      },
      albumDetail: {
        name: "Third",
        description: "First album"
      },
      imageData: [],
      userAlbums: [],
      radioGroup: 1
    };
  },
  methods: {},
  async created() {
    try {
      const imageRes = await axios.get("/images/" + this.$route.params.imageId);
      this.image = imageRes.data;
      const userAlbumRes = await axios.get("/user_albums/" + guser._id);
      this.userAlbums = userAlbumRes.data;

      var subAlbum = this.userAlbums.filter(function(album) {
        return album.type == "sub";
      });
      this.userAlbums = subAlbum;
      console.log(this.userAlbums);
    } catch (error) {
      console.log(error);
    }
  }
};
</script>

<style>
#gold {
  background-color: #ad974f;
}
</style>

