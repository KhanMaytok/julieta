<script setup lang="ts">
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/shared/components/ui/breadcrumb";
import { Separator } from "@/shared/components/ui/separator";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";
import { Pagination, PaginationContent, PaginationPrevious, PaginationItem, PaginationEllipsis, PaginationNext } from "@/shared/components/ui/pagination";

import { ref, computed } from "vue";
import { useEstablishment } from "@/app/modules/core/composables/useEstablishment";
import SatMain from "@/shared/components/SatMain.vue";
import type { Establishment } from "@/app/modules/core/models/Establishment.types";

const pageNumber = ref(1)
const pageSize = ref(10)
const { list } = useEstablishment()

const query = list({ page: pageNumber, page_size: pageSize });
const establishments = computed<Establishment[]>(() => query.data.value?.results || [])
const total = computed<number>(() => query.data.value?.count || 0)

function handlePageChange(newPage: number) {
    console.log("Changing to page:", newPage);
    pageNumber.value = newPage
}
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
                        <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
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

            <div class="flex flex-col space-y-4 overflow-hidden">
                <div v-if="query.isLoading.value" class="text-center text-gray-500 py-6">
                    Cargando establecimientos...
                </div>
                <div v-else-if="query.isError.value" class="text-center text-red-500 py-6">
                    Error: {{ query.error.value?.message || 'No se pudo cargar.' }}
                </div>

                <el-table v-else :data="establishments" border stripe class="w-full rounded-md shadow-sm">
                    <el-table-column prop="name" label="Nombre" />
                    <el-table-column prop="address" label="Dirección" />
                </el-table>

                <div class="flex justify-end pt-2">
                    <Pagination v-slot="{ page }" :items-per-page="10" :total="total" :default-page="pageNumber">
                        <PaginationContent v-slot="{ items }">
                            <PaginationPrevious @click="handlePageChange(page - 1)" />
                            <template v-for="(item, index) in items" :key="index">
                                <PaginationItem v-if="item.type === 'page'" :value="item.value" @click="handlePageChange(item.value)"
                                    :is-active="item.value === page">
                                    {{ item.value }}
                                </PaginationItem>
                            </template>
                            <PaginationEllipsis :index="4" />
                            <PaginationNext @click="handlePageChange(page + 1)" />
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </div>
    </SatMain>
</template>
