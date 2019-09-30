<template>
  <v-dialog max-width="410px" v-model="dialog">
    <v-btn id="gold" dark fab fixed bottom right large slot="activator">
      <v-icon>add</v-icon>
    </v-btn>
    <v-card>
      <v-card-text>
        <v-layout column justify-center>
        
        <!-- Image preview -->
        <div v-for="(image, key) in selectedImage" v-bind:key="key">
          <div>
            <img class="preview" v-bind:ref="'image' +parseInt( key )" height="100px" width="150px" />
            <!-- {{ image.name }} -->
          </div>
        </div>
        <v-form ref="form" class="px-3">
          <v-text-field color="orange" :rules="requiredRules" label="Name" v-model="imageDetail.name"></v-text-field>
          <v-text-field color="orange" :rules="requiredRules" label="Description" v-model="imageDetail.description"></v-text-field>
          <v-combobox color="orange" label="tags" chips multiple deletable-chips  v-model="imageDetail.tags"></v-combobox>
          <v-spacer></v-spacer>
          <input
            v-show="false"
            id="images"
            type="file"
            name="image"
            ref="uploadInput"
            accept="image/*"
            :multiple="false"
            @change="detectFiles($event)"
          />
          <v-btn flat dark @click="selectFile" class="mx-0 mt-3" id="gold">Attach</v-btn>
          <v-btn flat dark @click="saveData1" class="mx-0 mt-3" id="gold">OK</v-btn>
          <v-btn flat dark @click="dialog=!dialog" class="mx-0 mt-3" id="gold">Cancel</v-btn>
        </v-form>
        <!-- Uploading image -->
        <v-flex>
        <v-progress-circular
          v-if="uploading && !uploadEnd"
          :size="100"
          :width="15"
          :rotate="360"
          :value="progressUpload"
          color="primary"
        >%</v-progress-circular>
        </v-flex>
        </v-layout>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import firebase from "firebase/app";
import "firebase/storage";
export default {
  name: "AddImage",
  data() {
    return {
      dialog: false,
      User: guser,
      progressUpload: 0,
      selectedImage: [],
      uploadTask: "",
      uploading: false,
      uploadEnd: false,
      downloadURL: "",
      imageData: [],
      albumName: "Default",
      imageDetail: {
        name: "",
        description: "",
        type: "original",
        originalOwnerId: guser._id,
        originalOwnerUsername: guser.username,
        tags: []
      },
      tags: [],
      requiredRules: [v => !!v || "required to fill"]
    };
  },
  methods: {
    addImage() {
      console.log("addImage");
    },
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
      //Save image to database first and get the return id of image, will set image name in firebase to be the same as id
      console.log("Saving to image as template");
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
          name: this.imageDetail.name,
          owner: guser.username,
          description: this.imageDetail.description
        }
      };
      var task = firestorage
        .ref(
          "images/" +
            guser._id +
            "/m" +
            this.albumName +"_"+guser.username+
            "/" +
            this.imageData._id +
            ".jpg"
        )
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
        this.imageData = imageRes.data;
        // console.log(this.imageData);
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
        // console.log(this.imageData);
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

        console.log("Saving to mainAlbum complete");
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    }
  }
};
</script>

<style>
#gold {
  background-color: #d4af37;
}
</style>


