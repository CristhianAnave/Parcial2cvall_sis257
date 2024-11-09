<script setup lang="ts">
  import type { Serie } from '@/models/Serie'
  import http from '@/plugins/axios'
  import Button from 'primevue/button'
  import Dialog from 'primevue/dialog'
  import InputText from 'primevue/inputtext'
  import Select from 'primevue/select'
  import { computed, ref, watch } from 'vue'

  const ENDPOINT = 'series'
  const props = defineProps({
    mostrar: Boolean,
    serie: {
      type: Object as () => Serie,
      default: () => ({}) as Serie,
    },
    modoEdicion: Boolean,
  })
  const emit = defineEmits(['guardar', 'close'])

  const dialogVisible = computed({
    get: () => props.mostrar,
    set: value => {
      if (!value) emit('close')
    },
  })

  const temporadaString = computed({
    get: () => serie.value.temporadas?.toString() || '',
    set: (value) => {
      serie.value.temporadas = parseInt(value) || 0;
    },
  })

  const serie = ref<Serie>({ ...props.serie })
  watch(
    () => props.serie,
    (newVal) => {
      serie.value = { ...newVal }
    },
  )

  const tiposgeneros = [
    { label: 'Acción', value: 'acción' },
    { label: 'Comedia', value: 'comedia' },
    { label: 'Terror', value: 'terror' },
    { label: 'Drama', value: 'drama' },
  ]

  async function handleSave() {
    try {
      const body = {
        titulo: serie.value.titulo,
        sinopsis: serie.value.sinopsis,
        director: serie.value.director,
        tipoGenero: serie.value.tipoGenero,
        temporadas: serie.value.temporadas,
        fechaEstreno: serie.value.fechaEstreno,
      }
      if (props.modoEdicion) {
        await http.patch(`${ENDPOINT}/${serie.value.id}`, body)
      } else {
        await http.post(ENDPOINT, body)
      }
      emit('guardar')
      serie.value = {} as Serie
      dialogVisible.value = false
    } catch (error: any) {
      alert(error?.response?.data?.message)
    }
  }
</script>

<template>
  <div class="card flex justify-center">
    <Dialog v-model:visible="dialogVisible" :header="props.modoEdicion ? 'Editar' : 'Crear'" style="width: 25rem">
      <div class="flex items-center gap-4 mb-4">
        <label for="titulo" class="font-semibold w-4">TITULO</label>
        <InputText id="titulo" v-model="serie.titulo" class="flex-auto" autocomplete="off" autofocus />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="sinopsis" class="font-semibold w-4">SINOPSIS</label>
        <InputText id="sinopsis" v-model="serie.sinopsis" class="flex-auto" autocomplete="off" autofocus />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="director" class="font-semibold w-4">DIRECTOR</label>
        <InputText id="director" v-model="serie.director" class="flex-auto" autocomplete="off" autofocus />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="tipogenero" class="font-semibold w-4">TIPOGENERO</label>
        <Select id="tipogenero" v-model="serie.tipoGenero" :options="tiposgeneros" optionLabel="label"
          optionValue="value" class="flex-auto" autofocus />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="temporadas" class="font-semibold w-4">TEMPORADAS</label>
        <InputText id="temporadas" v-model="temporadaString" type="number" class="flex-auto" autocomplete="off"
          autofocus />
      </div>
      <div class="flex items-center gap-4 mb-4">
        <label for="fechaEstreno" class="font-semibold w-4">FECHA DE ESTRENO</label>
        <InputText id="fechaEstreno" v-model="serie.fechaEstreno" class="flex-auto" type="date" autocomplete="off"
          autofocus />
      </div>
      <div class="flex justify-end gap-2">
        <Button type="button" label="Cancelar" icon="pi pi-times" severity="secondary"
          @click="dialogVisible = false"></Button>
        <Button type="button" label="Guardar" icon="pi pi-save" @click="handleSave"></Button>
      </div>
    </Dialog>
  </div>
</template>

<style scoped></style>
