<template>
  <div class="admin">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "Admin",
  data() {
    return {};
  },
  computed: {
    nickname() {
      return this.$store.state.login.nickname;
    }
  },
  methods: {
    loginOutFun() {
      this.$store.commit("CLEAR_TOKEN");
      this.$router.push({ name: "login" });
    }
  }
};
</script>
<style lang="scss" scoped>
.admin {
  text-align: left;
  padding: 0px 50px;
}
</style>
