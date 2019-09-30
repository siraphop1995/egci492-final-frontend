<template>
  <v-container>
    <div v-for="(image, key) in selectedImage" v-bind:key="key">
      <div>
        <img class="preview" v-bind:ref="'image' +parseInt( key )" height="100px" width="150px" />
        {{ image.name }}
      </div>
    </div>

    <input
      id="images"
      type="file"
      name="image"
      ref="uploadInput"
      accept="image/*"
      :multiple="false"
      @change="detectFiles($event)"
    />
    <v-progress-circular
      v-if="uploading && !uploadEnd"
      :size="100"
      :width="15"
      :rotate="360"
      :value="progressUpload"
      color="primary"
    >%</v-progress-circular>
    <!-- <img v-if="uploadEnd" :src="downloadURL" width="100%" /> -->
    <v-btn color="green" @click="saveData1()">Upload</v-btn>
    <v-btn @click="testBtn1()">testBtn1</v-btn>
    <v-btn @click="testBtn2()">testBtn2</v-btn>
    <v-btn @click="testBtn3()">testBtn3</v-btn>
    <v-btn @click="$router.push('/newsfeed2')">newsfeed2</v-btn>
    <!-- <div v-if="uploadEnd">
      <v-btn class="ma-0" dark small color="error" @click="deleteImage()">Delete</v-btn>
    </div>-->

    <v-btn @click.native="selectFile" id="gold" dark fab fixed bottom right large>
      <v-icon>add</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import firebase from "firebase/app";
import "firebase/storage";

export default {
  data() {
    return {
      progressUpload: 0,
      selectedImage: [],
      uploadTask: "",
      uploading: false,
      uploadEnd: false,
      downloadURL: "",
      imageData: [],
      albumName: "Default",
      imageDetail: {
        name: "Default name",
        description: "Default description",
        type: "original",
        originalOwnerId: guser._id,
        originalOwnerUsername: guser.username,
        tags: []
      }
    };
  },
  methods: {
    selectFile() {
      this.$refs.uploadInput.click();
    },
    detectFiles(e) {
      let imageList = e.target.files || e.dataTransfer.files;
      this.selectedImage = [];
      this.selectedImage.push(imageList[0]);
      //To preview START
      let reader = new FileReader();
      reader.addEventListener(
        "load",
        function() {
          this.$refs["image" + parseInt(0)][0].src = reader.result;
        }.bind(this),
        false
      );
      reader.readAsDataURL(this.selectedImage[0]);
      //To Preview END
    },
    async saveData1() {
      try {
        await this.saveImageTemplate();
        await this.upload(this.selectedImage[0]);
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
      //TEMP TAGS
      this.imageDetail.tags.push("test")
      this.imageDetail.tags.push("example")
      const imageRes = await axios.post("/images", this.imageDetail);
      console.log("Saving to image as template complete");
      this.imageData = imageRes.data;
    },
    async upload(image) {
      console.log("uploading to firebase");
      this.uploading = true;
      var firestorage = firebase.storage();

      var newMetadata = {
        customMetadata: {
          name: "b1.jpg",
          owner: guser.username,
          location: "Bangkok",
          description: "description"
        }
      };
      var task = firestorage
        //////////////////////////////need to change image .jpg to variable//////////////////////////////////
        .ref("images/" + guser._id + "/m"+this.albumName+"/" + this.imageData._id + ".jpg")
        .put(image, newMetadata);

      task.on(
        "state_changed",
        //progress
        snapshot => {
          this.progressUpload = Math.floor(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
        },
        null,
        //on complete
        () => {
          task.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.uploadEnd = true;
            this.downloadURL = downloadURL;
            this.$emit("downloadURL", downloadURL);
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
        imageData: []
      };
      try {
        const userAlbumsRes = await axios.get("/user_albums/" + guser._id);
        //filtered main album
        var userAlbums = userAlbumsRes.data;
        userAlbums = userAlbums.filter(function(album) {
          return album.type == "main";
        });
      console.log(this.imageData)
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

        console.log("Saving to mainAlbum complete");
      } catch (error) {
        console.log(error);
      }
    },
    testBtn1() {
      //get gsUrl from downloadUrl
      const downloadUrl =
        "https://firebasestorage.googleapis.com/v0/b/egci427final.appspot.com/o/DSS%2Fb1.jpg?alt=media&token=f95d1476-d794-49c7-8dbc-d837104ebe7b";
      const storage = firebase.storage();
      const imgPath = storage.refFromURL(downloadUrl).location.path; //.toString();

      //set metadata
      var newMetadata = {
        customMetadata: {
          owner: guser.username,
          location: "Bangkok"
        }
      };
      var deleteMetadata = {
        contentType: null,
        customMetadata: null
      };

      var storageRef = storage
        .ref()
        .child("images/" + guser.username + "/b1.jpg");
      //update metadata
      storageRef
        .updateMetadata(newMetadata)
        .then(function(metadata) {
          console.log("Succ");
        })
        .catch(function(error) {
          console.log("Error");
        });
      //get download url
      storageRef.getDownloadURL().then(url => {
        console.log(url);
      });
    },
    testBtn2() {
      const downloadUrl =
        "https://firebasestorage.googleapis.com/v0/b/egci427final.appspot.com/o/images%2Fa%2Fb1.jpg?alt=media&token=5cd4fc51-6c4a-4dad-9986-6128df681724";
      const storage = firebase.storage();
      const imgPath = storage.refFromURL(downloadUrl).location.path;
      console.log(imgPath);

      var storageRef = storage.ref().child(imgPath);
      storageRef
        .getMetadata()
        .then(function(metadata) {
          // Metadata now contains the metadata for 'images/forest.jpg'
          console.log(metadata);
        })
        .catch(function(error) {
          // Uh-oh, an error occurred!
        });
    },
    async testBtn3() {
      try {
        const res = await axios.get("/test");
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    }
  },
  watch: {
    uploadTask: async function() {
      this.uploadTask.on(
        "state_changed",
        snapshot => {
          this.progressUpload = Math.floor(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
        },
        null,
        () => {
          this.uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            this.uploadEnd = true;
            this.downloadURL = downloadURL;
            this.$emit("downloadURL", downloadURL);
            console.log("uploading to firebase complete");
          });
        }
      );
    }
  },
  mounted() {}
};
</script>

<style>
.progress-bar {
  margin: 10px 0;
}
input[type="file"] {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}
</style>