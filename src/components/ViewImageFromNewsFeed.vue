<template>
  <v-container>
    <v-layout>
      <v-flex xs1>
        <v-btn flat router to="/newsfeed">
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
                <!-- <v-flex sm1 class="mt-3">name: {{image.name}}</v-flex> -->
                <v-spacer></v-spacer>
                <v-flex sm3 class="pl-4">
                  <v-dialog max-width="410px" v-model="dialog">
                    <v-btn dark id="gold" slot="activator">
                      <v-icon left>favorite_border</v-icon>add to album
                    </v-btn>
                    <v-card>
                      <v-card-title class="title">Choose Album</v-card-title>
                      <v-card-text>
                        <v-layout justify-center>
                          <v-form ref="form" class="px-3">
                            <v-radio-group v-model="radioGroup">
                              <v-radio
                                v-for="n in userAlbums"
                                :key="n._id"
                                :label="`name: ${n.name}`"
                                :value="n"
                              ></v-radio>
                            </v-radio-group>

                            <v-btn
                              flat
                              dark
                              @click="addToAlbum(image), snackbar=true"
                              class="mx-0 mt-3"
                              id="gold"
                            >Add to Album</v-btn>
                            <v-btn
                              flat
                              dark
                              @click="dialog=!dialog"
                              class="mx-0 mt-3"
                              id="gold"
                            >Cancel</v-btn>
                          </v-form>
                        </v-layout>
                      </v-card-text>
                    </v-card>
                    <v-snackbar v-model="snackbar">
                  {{ text }}
                  <v-btn color="pink" text @click="snackbar = false">Close</v-btn>
                    </v-snackbar>
                  </v-dialog>
                </v-flex>
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
          <!-- <v-card-text>Description: {{image.description}}</v-card-text> -->
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>
<script>
import firebase from "firebase/app";
import "firebase/storage";

export default {
  name: "ViewImageFromNewsFeed",
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
      dialog: false,
      snackbar: false,
      radioGroup: 1,
      text: "Added to Album"
    };
  },
  methods: {
    async addToAlbum(image) {
      this.selectedImage = image;

      this.imageDetail.name = image.name;
      this.imageDetail.description = image.description;
      this.imageDetail.originalOwnerId = image.originalOwnerId;
      this.imageDetail.originalOwnerUsername = image.originalOwnerUsername;
      this.imageDetail.tags = image.tags;
      this.albumDetail.name = this.radioGroup.name;
      this.albumDetail.description = this.radioGroup.description;

      this.saveData1();
    },
    viewImage() {
      console.log("viewImage");
    },
    async saveData1() {
      try {
        await this.saveImageTemplate();
        await this.upload();
      } catch (error) {
        console.log(error);
      }
    },
    async saveData2() {
      try {
        await this.saveImageUrl();
        await this.saveMainAlbum();
      } catch (error) {
        console.log(error);
      }
    },
    async saveImageTemplate() {
      console.log("Saving to image as template");
      const imageRes = await axios.post("/images", this.imageDetail);
      console.log("Saving to image as template complete");
      this.imageData = imageRes.data;
    },
    async upload() {
      console.log("uploading to firebase");
      this.uploading = true;
      var firestorage = firebase.storage();

      let file = await fetch(this.selectedImage.url)
        .then(r => r.blob())
        .then(
          blobFile => new File([blobFile], "img.jpg", { type: "image/png" })
        );

      var task = firestorage
        .ref(
          "images/" +
            guser._id +
            "/s" +
            this.albumDetail.name +
            "/" +
            this.imageData._id +
            ".jpg"
        )
        .put(file);

      task.on(
        "state_changed",
        //progress
        snapshot => {},
        null,
        //on complete
        () => {
          task.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.downloadURL = downloadURL;
            console.log("uploading to firebase complete");
            this.saveData2();
          });
        }
      );
    },
    async saveImageUrl() {
      console.log("Saving imageUrl");
      try {
        let newImage = {
          url: this.downloadURL
        };
        const imageRes = await axios.post(
          "/images/" + this.imageData._id,
          newImage
        );
        this.imageData = imageRes.data;
        // console.log(this.imageData);
        console.log("Saving imageUrl complete");
      } catch (error) {
        console.log(error);
      }
    },
    async saveMainAlbum() {
      console.log("Saving to subAlbum name: " + this.albumDetail.name);
      let newAlbum = {
        name: this.albumDetail.name,
        imageData: [],
        type: "sub",
        ownerId: guser._id,
        ownerUsername: guser.username,
        description: this.albumDetail.description,
        modifiedDate: new Date()
      };
      const userAlbumsRes = await axios.get("/user_albums/" + guser._id);
      //filtered main album
      var userAlbums = userAlbumsRes.data;

      var albumName = this.albumDetail.name;
      userAlbums = userAlbums.filter(function(album) {
        return album.name == albumName;
      });
      //Create new album + add to userAlbumData
      if (userAlbums.length == 0) {
        newAlbum.imageData.push({
          url: this.imageData.url,
          id: this.imageData._id,
          name: this.imageData.name,
          description: this.imageData.description,
          tags: this.imageData.tags
        });
        var response = await axios.post("/albums", newAlbum);
      } else {
        //Update to album
        newAlbum.imageData = userAlbums[0].imageData;
        newAlbum.imageData.push({
          url: this.imageData.url,
          id: this.imageData._id,
          name: this.imageData.name,
          description: this.imageData.description,
          tags: this.imageData.tags
        });
        var response = await axios.post(
          "/albums/" + userAlbums[0]._id,
          newAlbum
        );
        // console.log(response);
      }
      console.log(
        "Saving to subAlbum name: " + this.albumDetail.name + " complete"
      );
      this.dialog = false
    }
  },
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

