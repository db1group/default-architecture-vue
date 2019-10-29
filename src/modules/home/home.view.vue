<template lang="pug">
  v-container
    p.text-center Vuejs typescript boilerplate
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Route } from '@/services/router-loader/router-loader.decorator';
import DefaultTemplate from '@/components/layout/default-template.view.vue';

@Route({
  path: '/',
  name: 'home',
  parent: DefaultTemplate,
})
@Component
export default class HomeView extends Vue {}
</script>
