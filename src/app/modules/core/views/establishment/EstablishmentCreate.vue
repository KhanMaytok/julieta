<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb"
import { Separator } from "@/shared/components/ui/separator"
import {
  SidebarTrigger,
} from "@/shared/components/ui/sidebar"


import { establishmentFormSchema, type Establishment, type EstablishmentCreate } from '@/app/modules/core/models/Establishment.types'
import { createFormRules } from '@/shared/utils/yupElementAdapter.ts'
import type { CascaderNode, CascaderOption, FormInstance } from 'element-plus'
import { onMounted, reactive, ref, watch } from 'vue'
import { useEnvironment } from '@/app/modules/common/composables/useEnvironment'
import { useEstablishment } from '@/app/modules/core/composables/useEstablishment'
import { ElMessage } from 'element-plus'


const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<Establishment>(establishmentFormSchema.getDefault())
const locations = ref<any[]>([])
const customFilterMethod = (node: CascaderNode, keyword: string) => {
  return node.label.toLowerCase().includes(keyword.toLowerCase());
}

const rules = createFormRules(establishmentFormSchema, ruleForm)

const { create } = useEstablishment()

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  try {
    const valid = await formEl.validate();
    if (valid) {
      const form: EstablishmentCreate = { ...ruleForm }
      form["department"] = ruleForm.location[0]
      form["province"] = ruleForm.location[1]
      form["district"] = ruleForm.location[2]
      create.mutate(form, {
        onSuccess: () => {
          ElMessage.success('Establecimiento creado correctamente');
          formEl.resetFields();
        },
        onError: (error: any) => {
          ElMessage.error(error?.message || 'Error al crear establecimiento');
        }
      })
    }
  } catch (error: any) {
    ElMessage.error(error?.message || 'Error de validación');
  }
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}

// Usar el composable useEnvironment para obtener locations
const getEnvironments = () => {
  console.log('Fetching environments...');
  const { data } = useEnvironment();
  watch(data, (val) => {
    if (val && val.locations) {      
      const mapLocations = (arr: any[]): CascaderOption[] => arr.map(lvl1 => ({
        label: lvl1.name,
        value: lvl1.id,
        children: lvl1.children ? mapLocations(lvl1.children) : undefined
      }))
      locations.value = mapLocations(val.locations)
    }
  })
}

onMounted(() => {
  getEnvironments();
})
</script>

<template>
  <header
    class="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
    <div class="flex items-center gap-2 px-4">
      <SidebarTrigger class="-ml-1" />
      <Separator orientation="vertical" class="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem class="hidden md:block">
            <BreadcrumbLink href="#">
              Building Your Application
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator class="hidden md:block" />
          <BreadcrumbItem>
            <BreadcrumbPage>Data Fetching</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  </header>

  <div class="flex-shrink-0 flex flex-col min-h-screen">
    <div class="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="auto" class="form theme-form">
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
                <el-cascader v-model="ruleForm.location" :options="locations" :clearable="true" filterable
                  :filter-method="customFilterMethod" class="w-100" />
              </el-form-item>
            </div>
            <div class="col-md-4">
              <el-form-item label="Ventas por internet" prop="has_internet_sales">
                <el-switch v-model="ruleForm.has_internet_sales" active-text="" inactive-text="" />
              </el-form-item>
            </div>
            <div class="col-md-4">
              <el-form-item label="Habilitar encomiendas" prop="has_courier">
                <el-switch v-model="ruleForm.has_courier" active-text="" inactive-text="" />
              </el-form-item>
            </div>
          </div>
        </div>
        <div class="card-footer text-end">
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            Crear
          </el-button>
          <el-button @click="resetForm(ruleFormRef)">Cancelar</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>
