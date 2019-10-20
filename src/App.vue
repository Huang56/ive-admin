<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: "app"
};
</script>

<style>
#app {
  height: 100%;
}

@media (min-width: 768px) {
  .ivu-col-span-md-4 {
    display: block;
    width: 32.666667%;
  }
}

@media (min-width: 992px) {
  .ivu-col-span-lg-3 {
    display: block;
    width: 20.5%;
  }
}
</style>
