<template>
  <AbstractConfigEditor @submit="apply" v-bind="{ ...$attrs, ...$props }">
    <v-container class="py-0 px-1">
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="url" dense required> url </VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="url"
            clearable
            dense
            v-model.trim="localConfig.url"
            :rules="[isRequired]"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="maxLocations" dense>{{
            $t('searchEsri.configEditor.params.maxLocations')
          }}</VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="maxLocations"
            clearable
            dense
            type="number"
            v-model.number="localConfig.maxLocations"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="zoomDistance" dense>{{
            $t('searchEsri.configEditor.params.zoomDistance')
          }}</VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="zoomDistance"
            clearable
            dense
            type="number"
            v-model.number="localConfig.zoomDistance"
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
          <VcsLabel html-for="addressName" dense>addressName</VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="addressName"
            clearable
            dense
            v-model.trim="localConfig.addressMapping.addressName"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="street" dense>street</VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="street"
            clearable
            dense
            v-model.trim="localConfig.addressMapping.street"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="number" dense>number</VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="number"
            clearable
            dense
            v-model.trim="localConfig.addressMapping.number"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="city" dense>city</VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="city"
            clearable
            dense
            v-model.trim="localConfig.addressMapping.city"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="zip" dense>zip</VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="zip"
            clearable
            dense
            v-model.trim="localConfig.addressMapping.zip"
          />
        </v-col>
      </v-row>
      <v-row no-gutters>
        <v-col>
          <VcsLabel html-for="country" dense>country</VcsLabel>
        </v-col>
        <v-col>
          <VcsTextField
            id="country"
            clearable
            dense
            v-model.trim="localConfig.addressMapping.country"
          />
        </v-col>
      </v-row>
    </VcsFormSection>
  </AbstractConfigEditor>
</template>

<script lang="ts">
  import { VContainer, VRow, VCol } from 'vuetify/lib';
  import {
    VcsLabel,
    VcsTextField,
    AbstractConfigEditor,
    VcsFormSection,
  } from '@vcmap/ui';
  import { ref, defineComponent, PropType } from 'vue';
  import { PluginConfig } from './esriSearch.js';
  import getDefaultOptions from './defaultOptions.js';

  function isRequired(value: string): boolean | string {
    return value !== '' || 'searchEsri.configEditor.params.isRequired';
  }

  export default defineComponent({
    name: 'EsriSearchEditor',
    title: 'Esri Search Editor',
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
        type: Function as PropType<() => Promise<PluginConfig>>,
        required: true,
      },
      setConfig: {
        type: Function,
        required: true,
      },
    },
    setup(props) {
      const localConfig = ref(getDefaultOptions());
      props
        .getConfig()
        .then((config: PluginConfig) => {
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
        }) // eslint-disable-next-line no-console
        .catch((err) => console.error(err));

      const apply = async (): Promise<void> => {
        await props.setConfig(localConfig.value);
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
