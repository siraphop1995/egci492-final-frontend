<template>
  <v-container>
    <v-layout row wrap>
      <v-flex xs12 sm12>
        <v-text-field color="orange" append-icon="search" label="Search...." v-model="search"></v-text-field>
      </v-flex>
      <v-flex xs4 sm4 v-for="(image,index) in filterdImage" :key="index">
        <v-hover>
          <v-card slot-scope="{ hover }">
            <v-img :src="image.url" aspect-ratio="1">
              <v-expand-transition>
                <div
                  v-if="hover"
                  class="d-flex transition-fast-in-fast-out grey lighten-5 v-card--reveal"
                  style="height: 100%;"
                >
                  <router-link :to="{ path: 'viewimagefromnewsfeed/' + image._id}">
                    <v-btn flat>
                      <v-icon large>crop_free</v-icon>
                    </v-btn>
                  </router-link>
                </div>
              </v-expand-transition>
            </v-img>
          </v-card>
        </v-hover>
      </v-flex>
    </v-layout>
    <AddImage />
  </v-container>
</template>

<script>
import firebase from "firebase/app";
import "firebase/storage";
import AddImage from "./AddImage";
import Fuse from "fuse.js";

export default {
  name: "NewsFeed2",
  components: {
    AddImage
  },
  data() {
    return {
      Images: [],
      User: guser,
      userAlbums: [],
      downloadURL: "",
      imageData: [],
      albumDetail: {
        name: "Third",
        description: "First album"
      },
      imageDetail: {
        name: "Default name",
        description: "Default description",
        type: "copy",
        originalOwnerId: "",
        originalOwnerUsername: "",
        copyOwnerId: guser._id,
        copyOwnerUsername: guser.username,
        tags: []
      },
      search: "",
      selectedImage: null,
      blob: null,
      y: "top",
      x: null
    };
  },
  methods: {
    async addToAlbum(image) {
      this.selectedImage = image;
      this.imageDetail.originalOwnerId = image.originalOwnerId;
      this.imageDetail.originalOwnerUsername = image.originalOwnerUsername;
      this.imageDetail.tags = image.tags;
      console.log("addToAlbum");
      this.saveData1();
    },
    viewImage() {
      console.log("viewImage");
    },
    selectFile() {
      this.$refs.uploadInput.click();
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

      console.log("TEST");

      //PRAISEEEE THISSS LINEEEEEEEEEE IT BEEENNNNNN 3HOURRRRRRR
      let file = await fetch(this.selectedImage.url)
        .then(r => r.blob())
        .then(
          blobFile => new File([blobFile], "img.jpg", { type: "image/png" })
        );

      //////////////////////////////need to change image .jpg to variable//////////////////////////////////
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
        console.log("ImageUrl save complete");
        this.imageData = imageRes.data;
        console.log(this.imageData);
        console.log("Saving imageUrl complete");
      } catch (error) {
        console.log(error);
      }
    },
    async saveMainAlbum() {
      console.log("Saving to mainAlbum");
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
        console.log(response);
      }
      console.log("Saving to mainAlbum complete");
      window.location.reload();
    }
  },
  created() {
    axios
      .get("/new_images")
      .then(response => {
        console.log(response);
        this.Images = response.data;

      })
      .catch(error => {
        console.log(error);
      });
  },
  computed: {
    filterdImage: function() {
       if (this.search == "") {
        return this.Images
      } else {
        var options = {
          shouldSort: true,
          // tokenize: true,
          findAllMatches: true,
          // includeScore: true,
          //includeMatches: true,
          // threshold: 0.3,
          location: 0,
          distance: 100,
          maxPatternLength: 32,
          minMatchCharLength: 3,
          keys: [
            {
              name: "name",
              weight: 0.5
            },
            {
              name: "tags",
              weight: 0.5
            }
          ]
        };

        var fuse = new Fuse(this.Images, options);
        var result = fuse.search(this.search);
        return result

      }
    }
  }
};
</script>
<style scoped>
#gold {
  background-color: #d4af37;
}
.v-card--reveal {
  align-items: center;
  bottom: 0;
  justify-content: center;
  opacity: 0.5;
  position: absolute;
  width: 100%;
}
</style>
