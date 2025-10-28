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



import { ref, computed, watch } from 'vue'
import { useEstablishment } from '@/app/modules/core/composables/useEstablishment'
import SatMain from "@/shared/components/SatMain.vue"
import type { Establishment } from '@/app/modules/core/models/Establishment.types'
const page = ref(1)
const pageSize = ref(10)
const { list } = useEstablishment()

const query = list({ page: page, page_size: pageSize });
const establishments = computed<Establishment[]>(() => query.data.value?.results || [])
const total = computed<number>(() => query.data.value?.count || 0)

function handlePageChange(val: number) {
    console.log('Cambiando página a:', val);
    page.value = val
}
function handleSizeChange(val: number) {
    console.log('Cambiando tamaño de página a:', val);
    pageSize.value = val
    page.value = 1
}

watch([page, pageSize], () => {
    console.log('Fetching data for page:', page.value, 'with page size:', pageSize.value);
    query.refetch()
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

    <SatMain fixed>
        <div class="p-6">
            <div class="mb-4">
                <h1 class="text-2xl font-bold tracking-tight md:text-3xl">
                    Establecimientos
                </h1>
                <Separator class="my-4" />
            </div>

            <!-- 🔹 Contenido principal -->
            <div class="flex flex-col space-y-4 overflow-hidden">
                <!-- Tabla -->
                <el-table :data="establishments" border stripe class="w-full rounded-md shadow-sm">
                    <el-table-column prop="name" label="Nombre" />
                    <el-table-column prop="address" label="Dirección" />
                </el-table>

                <!-- Paginación -->
                <div class="flex justify-end pt-2">
                    <el-pagination background layout="prev, pager, next" :current-page="page"
                        :page-size="pageSize" :total="total" :page-sizes="[10, 20, 50]" @current-change="handlePageChange"
                        @size-change="handleSizeChange" />
                </div>
            </div>
        </div>
    </SatMain>
</template>
