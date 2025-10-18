<script setup lang="ts">
import { Separator } from '@/shared/components/ui/separator'
import { establishmentFormSchema, type Establishment } from '@/app/modules/core/models/Establishment.types'
import { createFormRules } from '@/shared/utils/yupElementAdapter'
import type { CascaderNode, CascaderOption, FormInstance } from 'element-plus'
import { reactive, ref, watchEffect, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEnvironment } from '@/app/modules/common/composables/useEnvironment'
import { useEstablishment } from '@/app/modules/core/composables/useEstablishment'
import { ElMessage } from 'element-plus'
import SatMain from '@/shared/components/SatMain.vue'
import { klona } from 'klona';
import AppHeader from '@/shared/components/AppHeader.vue'

/* -------------------------------------------------
   Router
-------------------------------------------------- */
const route = useRoute()
const router = useRouter()
const id = computed(() => (route.params.id as string) || '')

/* -------------------------------------------------
   Composables (SIEMPRE en el root)
-------------------------------------------------- */
const { get, create, update } = useEstablishment()
const { data: envData } = useEnvironment()

/* -------------------------------------------------
   Modo edición ?
-------------------------------------------------- */
const isEdit = computed(() => !!id.value)

/* -------------------------------------------------
   Carga de datos (solo en edición)
-------------------------------------------------- */
const { data: establishment, isLoading } = get(id.value)

/* -------------------------------------------------
   Estado del formulario
-------------------------------------------------- */
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<Establishment>(establishmentFormSchema.getDefault())

/* Rellenar cuando se resuelva la query */
watchEffect(() => {
  if (isEdit.value && establishment.value) {
    Object.assign(ruleForm, klona(establishment.value))
  }
})

// Watcher para convertir location a string (último valor)
// Variable auxiliar para el cascader
const cascaderLocation = ref<any>()

// Watcher para sincronizar el modelo principal
watchEffect(() => {
  if (Array.isArray(cascaderLocation.value)) {
     ruleForm.location = cascaderLocation.value.length > 0 && cascaderLocation.value[cascaderLocation.value.length - 1] !== undefined
      ? String(cascaderLocation.value[cascaderLocation.value.length - 1])
      : ''
  }
})

// Inicializa cascaderLocation en edición
watchEffect(() => {
  if (isEdit.value && establishment.value && establishment.value.location) {
    cascaderLocation.value = String(establishment.value.location)
  }
})

/* -------------------------------------------------
   Locations (ubigeo)
-------------------------------------------------- */
const locations = ref<CascaderOption[]>([])

watchEffect(() => {
  if (envData.value?.locations) {
    const map = (arr: any[]): CascaderOption[] =>
      arr.map(l => ({
        label: l.name,
        value: l.id,
        children: l.children ? map(l.children) : undefined,
      }))
    locations.value = map(envData.value.locations)
  }
})

const customFilterMethod = (node: CascaderNode, keyword: string) =>
  node.label.toLowerCase().includes(keyword.toLowerCase())

/* -------------------------------------------------
   Reglas de validación
-------------------------------------------------- */
const rules = createFormRules(establishmentFormSchema, ruleForm)

/* -------------------------------------------------
   Submit
-------------------------------------------------- */
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async valid => {
    if (!valid) return
    try {
      if (isEdit.value) {
        await update.mutateAsync({ id: Number(id.value ?? 0), payload: { ...ruleForm} })
      } else {
        await create.mutateAsync({ ...ruleForm })
      }
      router.push({ name: 'establishments_list' })
      ElMessage.success(`Establecimiento ${isEdit.value ? 'actualizado' : 'creado'} correctamente`)
    } catch (e: any) {
      ElMessage.error(e?.message || 'Error al guardar')
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields();
  router.push({ name: 'establishments_list' })
}
</script>

<template>
  <AppHeader />
  <SatMain fixed>
    <div class="space-y-0.5">
      <h1 class="text-2xl font-bold tracking-tight md:text-3xl">
        {{ isEdit ? 'Editar' : 'Nuevo' }} establecimiento
      </h1>
      <p v-if="isLoading">Cargando...</p>
    </div>
    <Separator class="my-4 lg:my-6" />
    <div class="flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        class="form theme-form"
        v-loading="isLoading"
      >
        <div class="card-body">
          <div class="row g-1">
            <div class="col-md-4">
              <el-form-item label="Nombre" prop="name">
                <el-input v-model="ruleForm.name" />
              </el-form-item>
            </div>
            <div class="col-md-4">
              <el-form-item label="Dirección" prop="address">
                <el-input v-model="ruleForm.address" />
              </el-form-item>
            </div>
            <div class="col-md-4">
              <el-form-item label="Email" prop="email">
                <el-input v-model="ruleForm.email" />
              </el-form-item>
            </div>
            <div class="col-md-4">
              <el-form-item label="Teléfono" prop="telephone">
                <el-input v-model="ruleForm.telephone" />
              </el-form-item>
            </div>
            <div class="col-md-4">
              <el-form-item label="Ubigeo" prop="location">
                  <el-cascader
                    v-model="cascaderLocation"
                    :options="locations"
                    clearable
                    filterable
                    :filter-method="customFilterMethod"
                    class="w-100"
                  />
              </el-form-item>
            </div>
            <div class="col-md-4">
              <el-form-item label="Ventas por internet" prop="has_internet_sales">
                <el-switch v-model="ruleForm.has_internet_sales" />
              </el-form-item>
            </div>
            <div class="col-md-4">
              <el-form-item label="Habilitar encomiendas" prop="has_courier">
                <el-switch v-model="ruleForm.has_courier" />
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="card-footer text-end">
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            {{ isEdit ? 'Actualizar' : 'Crear' }}
          </el-button>
          <el-button @click="resetForm(ruleFormRef)">Cancelar</el-button>
        </div>
      </el-form>
    </div>
  </SatMain>
</template>
