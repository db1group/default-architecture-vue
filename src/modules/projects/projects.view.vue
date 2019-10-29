<template lang="pug">
  v-container
    v-list.transparent
      template(v-for="(repository, index) in repositories")
        v-list-item(
          :href="repository.url"
          target="_BLANK"
        )
          v-list-item-content
            v-list-item-title {{ repository.name }}
        v-divider
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { Route } from '@/services/router-loader/router-loader.decorator';
import DefaultTemplate from '@/components/layout/default-template.view.vue';
import ProjectsService from './projects.service';
import { Repository } from './projects.entity';

@Route({
  path: '/projects',
  name: 'projects',
  parent: DefaultTemplate,
})
@Component
export default class ProjectsView extends Vue {
  private repositories: Repository[] = [];

  private created() {
    ProjectsService
      .getReposFromUser()
      .then((repositories: Repository[]) => {
        this.repositories = repositories;
      });
  }
}
</script>
