<template>
  <AsyncArticle />
</template>

<script lang="ts">
import Vue from 'vue'
import AsyncArticle from '~/components/article/AsyncArticle'

export default Vue.extend({
  components: {
    AsyncArticle
  }
})
</script>
