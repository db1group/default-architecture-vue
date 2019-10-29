<template lang="pug">
  v-app-bar(app dark color="primary")
    v-toolbar-title.headline.text-uppercase
      span.accent--text DB1 Group
      span.font-weight-light.ml-2 Vuejs Boilerplate
    v-spacer
    v-btn(
      text
      href="https://github.com/db1group/default-architecture-vue"
      target="_blank"
    )
      v-icon mdi-github-face
      span.mx-2 View source
      v-icon mdi-open-in-new
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class HeaderComponent extends Vue {}
</script>
