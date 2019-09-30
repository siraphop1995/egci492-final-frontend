<template>
  <v-container>
    <v-layout>
      <!-- image presentation -->
      <v-flex xs12 sm9>
        <v-layout fill-height row wrap>
          <v-flex xs4 sm4 v-for="(image,index) in Images" :key="index">
            <v-hover>
              <v-card slot-scope="{ hover }">
                <v-img :src="image.url" aspect-ratio="1">
                  <v-expand-transition>
                    <div
                      v-if="hover"
                      class="transition-fast-in-fast-out grey lighten-5 v-card--reveal"
                      style="white-space: nowrap;"
                    >
                      <router-link :to="{ path: 'viewimagefrommyprofile/' + image.id}">
                        <v-btn dark id="gold">
                          <v-icon>crop_free</v-icon>
                        </v-btn>
                      </router-link>
                      <v-btn dark class="brown lighten-1" @click="deleteImage(image)">
                        <v-icon>delete_outline</v-icon>
                      </v-btn>
                    </div>
                  </v-expand-transition>
                </v-img>
              </v-card>
            </v-hover>
          </v-flex>
        </v-layout>
      </v-flex>

      <!-- profile presentation -->
      <v-flex xs12 sm3 class="ml-1">
        <v-card>
          <v-layout column align-center>
            <v-flex>
              <v-avatar size="150px" class="mt-3">
                <v-img
                  src="https://i.pinimg.com/564x/aa/70/57/aa70579a92479cfc7668111ed82f5dd2.jpg"
                ></v-img>
              </v-avatar>
            </v-flex>
            <v-flex>
              <EditProfile />

              <router-link :to="{ path: 'signout/' }">
              <v-btn small fab dark class="deep-orange darken-4" @click="logOut">
                <v-icon dark>exit_to_app</v-icon>
              </v-btn>
              </router-link>
            </v-flex>
            <v-flex>{{User.username}}</v-flex>
            <v-flex>{{User.firstName}} {{User.lastName}}</v-flex>
            <v-flex>{{User.email}}</v-flex>
          </v-layout>
        </v-card>

        <!-- album presentaion -->
        <v-navigation-drawer stateless value="true">
          <v-list>
            <v-list-group prepend-icon="photo_library">
              <template v-slot:activator>
                <v-list-tile>
                  <v-list-tile-title>My Albums</v-list-tile-title>
                </v-list-tile>
              </template>

              <v-list-group
                no-action
                sub-group
                value="true"
                v-for="album in subAlbums"
                :key="album.id"
              >
                <template v-slot:activator>
                  <v-list-tile>
                    <v-list-tile-title @click="setAlbum(album)">{{album.name}}</v-list-tile-title>
                    <v-list-tile-action >  
                        <v-icon small color="light-blue darken-4" @click="editAlbumName=true , editAlbum(album)">edit</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-action>
                      <v-icon small color="deep-orange darken-4" @click="deleteAlbum(album)">delete</v-icon>
                    </v-list-tile-action>
                  </v-list-tile>
                </template>
              </v-list-group>

              <v-divider></v-divider>

              <v-dialog max-width="410px" v-model="dialog">
                <v-list-tile slot="activator">
                  <v-list-tile-action>
                    <v-icon color="blue">add</v-icon>
                  </v-list-tile-action>
                  <v-list-tile-title>Create New Album</v-list-tile-title>
                </v-list-tile>
                <v-card>
                  <v-card-title class="title">Create New Album</v-card-title>
                  <v-card-text>
                    <v-form ref="form" class="px-3">
                      <v-text-field label="Name" :rules="requiredRules" color="orange" v-model="newAlbumDetail.name"></v-text-field>
                      <v-text-field
                        label="Description"
                        :rules="requiredRules"
                        color="orange"
                        v-model="newAlbumDetail.description"
                      ></v-text-field>
                      <v-spacer></v-spacer>
                      <v-btn
                        flat
                        dark
                        @click="createNewAlbum"
                        class="mx-0 mt-3"
                        id="gold"
                      >Create Album</v-btn>
                      <v-btn flat dark @click="dialog=!dialog" class="mx-0 mt-3" id="gold">Cancel</v-btn>
                    </v-form>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </v-list-group>
          </v-list>
        </v-navigation-drawer>
      </v-flex>
    </v-layout>

    <!-- Edit Album Name Dialog -->
    <v-dialog max-width="410px" v-model="editAlbumName">
      <v-card>
        <v-card-title class="title">Edit Album Name</v-card-title>
        <v-card-text>
          <v-form>
            <v-text-field label="New Name" :rules="requiredRules" color="orange" v-model="newAlbumName"></v-text-field>
          </v-form>
        </v-card-text>
        <v-btn flat dark class="mx-0 mt-3" id="gold" @click="saveNewAlbumName()">OK</v-btn>
        <v-btn flat dark @click="editAlbumName=!editAlbumName" class="mx-0 mt-3" id="gold">Cancel</v-btn>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import firebase from "firebase/app";
import "firebase/storage";
import EditProfile from "./EditProfile";
export default {
  name: "MyProfile2",
  components: { EditProfile },
  data() {
    return {
      Images: [],
      allAlbums: [],
      mainAlnum: [],
      subAlbums: [],
      selectedAlbum: [],
      newEditAlbum: [],
      User: guser,
      newAlbum: "",
      dialog: false,
      editAlbumName: false,
      newAlbumDetail: {
        name: "",
        description: ""
      },
      newAlbumName: "",
      requiredRules: [v => !!v || "required to fill"]
    };
  },
  methods: {
    viewImage(id) {
      console.log("viewImage" + id);
      console.log(id);
    },
    saveNewAlbumName() {
      console.log(this.newAlbumName)
      console.log(this.newEditAlbum)
      this.newEditAlbum.name = this.newAlbumName
      axios.post("/albums/"+this.newEditAlbum._id, this.newEditAlbum)
        .then((response => {
          console.log(response)
          this.newAlbumName=""
          this.editAlbumName=false
        }))
        .catch((error) => {
          console.log(error)
        })

    },
    editAlbum(album) {
      console.log("EditAlbum");
      this.newEditAlbum = album
    },
    async deleteImage(image) {
      console.log("deleteImage:" + image.id);
      try {
        await this.removeImageFunction(image);

        //Remove photo from album.imageData
        var filteredImageData = this.selectedAlbum.imageData.filter(function(
          album
        ) {
          return album.id != image.id;
        });
        this.selectedAlbum.imageData = filteredImageData;
        const resAlbum = await axios.post(
          "/albums/" + this.selectedAlbum._id,
          this.selectedAlbum
        );

        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    },
    logOut() {
      console.log("log out");
    },
    setAlbum(album) {
      this.selectedAlbum = album;
      this.Images = this.selectedAlbum.imageData;
    },
    async createNewAlbum() {
      try {
        let newAlbum = {
          name: this.newAlbumDetail.name,
          imageData: [],
          type: "sub",
          ownerId: guser._id,
          ownerUsername: guser.username,
          description: this.newAlbumDetail.description,
          modifiedDate: new Date()
        };
        const response = await axios.post("/albums", newAlbum);
        const albumRes = response.data;
        console.log(albumRes);
        window.location.reload();
      } catch (error) {
        if (error.response.status == 400) {
          console.log("ERROR: duplicated album name");
        } else {
          console.log(error);
        }
      }
    },
    async deleteAlbum(album) {
      console.log("deleteAlbum");
      //se default to mainAlbum
      this.selectedAlbum = this.mainAlbum;
      this.Images = this.mainAlbum.imageData;
      console.log(album);
      try {
        for (var i = 0; i < album.imageData.length; i++) {
          // await this.removeImageFunction(album.imageData[i])
        }
        // console.log(album._id)
        const response = await axios.delete("/albums/" + album._id);
        window.location.reload();
      } catch (error) {
        console.log(error);
      }
    },
    async removeImageFunction(image) {
      //Delete photo from mongodb
      const resImage = await axios.delete("/images/" + image.id);
      //Delete photo from firebase
      const storage = firebase.storage();
      const imgPath = storage.refFromURL(image.url).location.path;
      storage.ref(imgPath).delete();
      console.log("image " + image.name + " removed");
    }
  },
  created() {
    axios
      .get("/user_albums/" + guser._id)
      .then(response => {
        // console.log(response);
        this.allAlbums = response.data;
        var mainAlbum = this.allAlbums.filter(function(album) {
          return album.type == "main";
        });
        this.mainAlbum = mainAlbum[0];
        this.selectedAlbum = mainAlbum[0];
        // console.log(this.selectedAlbum);
        this.Images = this.selectedAlbum.imageData;
        var subAlbum = this.allAlbums.filter(function(album) {
          return album.type == "sub";
        });
        this.subAlbums = subAlbum;
        console.log(this.subAlbums);
      })
      .catch(error => {
        console.log(error);
      });
  }
};
</script>

<style>
#gold {
  background-color: #d4af37;
}
</style>
