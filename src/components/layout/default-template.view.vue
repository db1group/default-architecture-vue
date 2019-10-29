<template lang="pug">
  .default-template
    header-component
    v-content
      v-container
        v-row(justify="center")
          v-btn.mr-3(
            small
            exact
            to="/"
            color="secondary"
          ) Home
          v-btn(
            small
            exact
            to="/projects"
            color="secondary"
          ) Projects
        v-row.my-5(align="center" justify="center")
          img(src="/img/logo-db1-group.png" alt="")
      transition(name="slide-y-transition" mode="out-in")
        router-view
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Route } from '@/services/router-loader/router-loader.decorator';
import HeaderComponent from './header.component.vue';

@Route({
  path: '/',
  name: 'default-template',
})
@Component({
  components: { HeaderComponent },
})
export default class DefaultTemplate extends Vue {}
</script>
