<template>
  <AbstractConfigEditor v-bind="{ ...$attrs, ...$props }" @submit="apply">
    <v-container class="py-0 px-1">
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="url" required> URL </VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="url"
            v-model.trim="localConfig.url"
            clearable
            :rules="[isRequired]"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="maxLocations">{{
            $t('searchEsri.configEditor.params.maxLocations')
          }}</VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="maxLocations"
            v-model.number="localConfig.maxLocations"
            clearable
            type="number"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="zoomDistance">{{
            $t('searchEsri.configEditor.params.zoomDistance')
          }}</VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="zoomDistance"
            v-model.number="localConfig.zoomDistance"
            clearable
            type="number"
          />
        </v-col>
      </v-row>
    </v-container>
    <VcsFormSection
      :expandable="true"
      heading="searchEsri.configEditor.addressMapping"
    >
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="addressName">addressName</VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="addressName"
            v-model.trim="localConfig.addressMapping.addressName"
            clearable
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="street">street</VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="street"
            v-model.trim="localConfig.addressMapping.street"
            clearable
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="number">number</VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="number"
            v-model.trim="localConfig.addressMapping.number"
            clearable
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="city">city</VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="city"
            v-model.trim="localConfig.addressMapping.city"
            clearable
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="zip">zip</VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="zip"
            v-model.trim="localConfig.addressMapping.zip"
            clearable
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="country">country</VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="country"
            v-model.trim="localConfig.addressMapping.country"
            clearable
          />
        </v-col>
      </v-row>
    </VcsFormSection>
  </AbstractConfigEditor>
</template>

<script lang="ts">
  import { VContainer, VRow, VCol } from 'vuetify/components';
  import {
    VcsLabel,
    VcsTextField,
    AbstractConfigEditor,
    VcsFormSection,
  } from '@vcmap/ui';
  import type { PropType } from 'vue';
  import { ref, defineComponent } from 'vue';
  import type { PluginConfig } from './esriSearch.js';
  import getDefaultOptions from './defaultOptions.js';

  function isRequired(value: string): boolean | string {
    return value !== '' || 'searchEsri.configEditor.params.isRequired';
  }

  export default defineComponent({
    name: 'EsriSearchEditor',
    components: {
      VcsFormSection,
      VContainer,
      VRow,
      VCol,
      AbstractConfigEditor,
      VcsLabel,
      VcsTextField,
    },
    props: {
      getConfig: {
        type: Function as PropType<() => PluginConfig>,
        required: true,
      },
      setConfig: {
        type: Function as PropType<(config: object | undefined) => void>,
        required: true,
      },
    },
    setup(props) {
      const localConfig = ref(getDefaultOptions());
      const config = props.getConfig();

      for (const [key, value] of Object.entries(config)) {
        if (value) {
          if (typeof value === 'object') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            Object.assign(localConfig.value[key], value);
          } else {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            localConfig.value[key] = value;
          }
        }
      }

      const apply = (): void => {
        props.setConfig(localConfig.value);
      };

      return {
        apply,
        isRequired,
        localConfig,
      };
    },
  });
</script>
<style scoped></style>
