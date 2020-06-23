<template>
  <div>
    <h1 class="title">
      {{ $t('article.title') }}
    </h1>
    <h2 class="subtitle">
      {{ $t('article.subtitle') }}
    </h2>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  name: 'Article'
})
</script>
