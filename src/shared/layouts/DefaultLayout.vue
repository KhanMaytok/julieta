<script setup lang="ts">
import AppSidebar from "@/shared/components/AppSidebar.vue"
import {
  SidebarInset,
  SidebarProvider,
} from "@/shared/components/ui/sidebar"
import { cn } from '@/shared/lib/utils'
</script>


<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset
    :class="cn(
              // Set content container, so we can use container queries
              '@container/content',
              // If layout is fixed, set the height
              // to 100svh to prevent overflow
              'has-[[data-layout=fixed]]:h-svh',
              // If layout is fixed and sidebar is inset,
              // set the height to 100svh - spacing (total margins) to prevent overflow
              'peer-data-[variant=inset]:has-[[data-layout=fixed]]:h-[calc(100svh-(var(--spacing)*4))]'
            )"
            
    >
      <RouterView />
    </SidebarInset>
  </SidebarProvider>
</template>
