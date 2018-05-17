<template>
  <div class="error-page">
    <h1>Oops, something went wrong, try again!</h1>
    <p>Back to <a href="/">safety</a>!</p>
  </div>
</template>

<script>
export default {

}
</script>

<style scoped>
.error-page {
  text-align: center;
}

.error-page a {
  text-decoration: none;
  color: red;
}

.error-page a:hover,
.error-page a:active {
  color: salmon;
}
</style>
