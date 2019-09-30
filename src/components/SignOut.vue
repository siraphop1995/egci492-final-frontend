<template>
  <div>
    <h2>{{message}}</h2>
  </div>
</template>


<script>
export default {
  data() {
    return {
      message: "Sign Out"
    };
  },
  created() {
    this.$cookies.remove("user");
    this.$cookies.remove("token");
    window.user = null
    window.token = null
    console.log("Signout successfully")
    Event.$emit("signout");
  }
};
</script>