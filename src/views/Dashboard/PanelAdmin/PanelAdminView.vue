<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'

import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import Separator from '@/components/ui/separator/Separator.vue'
import Sidebar from '@/components/ui/sidebar/Sidebar.vue'
import SidebarProvider from '@/components/ui/sidebar/SidebarProvider.vue'
import SidebarInset from '@/components/ui/sidebar/SidebarInset.vue'
import SidebarRail from '@/components/ui/sidebar/SidebarRail.vue'
import SidebarContent from '@/components/ui/sidebar/SidebarContent.vue'
import SidebarGroup from '@/components/ui/sidebar/SidebarGroup.vue'
import SidebarGroupLabel from '@/components/ui/sidebar/SidebarGroupLabel.vue'
import SidebarGroupContent from '@/components/ui/sidebar/SidebarGroupContent.vue'
import SidebarMenu from '@/components/ui/sidebar/SidebarMenu.vue'
import SidebarMenuItem from '@/components/ui/sidebar/SidebarMenuItem.vue'
import SidebarMenuButton from '@/components/ui/sidebar/SidebarMenuButton.vue'
import SidebarTrigger from '@/components/ui/sidebar/SidebarTrigger.vue'

const componenteActivo = shallowRef(null)

const cargarComponente = async (componentName: string) => {
  componenteActivo.value = (await import(`./paneles/${componentName}.vue`)).default
}

onMounted(async () => {
  await cargarComponente('PanelUsuariosNuevo')
})
</script>

<template>
  <div class="flex-1 space-y-3 px-4 py-8 pt-3">
    <Transition name="fade" mode="out-in">
      <Card>
        <CardHeader>
          <CardTitle class="flex items-center justify-between">
            <span> Panel administracion</span>
          </CardTitle>
          <CardDescription>
            Aca puedes administrar colegios, cursos, profesores, etc...
          </CardDescription>
          <Separator />
        </CardHeader>
        <CardContent>
          <div class="relative flex w-full overflow-hidden rounded-lg border">
            <SidebarProvider class="relative w-full transform-gpu">
              <div class="flex h-full w-full">
                <Sidebar class="h-full w-48">
                  <SidebarRail />
                  <SidebarContent>
                    <SidebarGroup>
                      <SidebarGroupLabel>Usuarios</SidebarGroupLabel>
                      <SidebarGroupContent>
                        <SidebarMenu>
                          <SidebarMenuItem>
                            <SidebarMenuButton @click.stop="cargarComponente('PanelUsuariosLista')">
                              Todos
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton @click.stop="cargarComponente('PanelUsuariosNuevo')">
                              Agregar
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </SidebarGroup>
                    <SidebarGroup>
                      <SidebarGroupLabel>Establecimientos</SidebarGroupLabel>
                      <SidebarGroupContent>
                        <SidebarMenu>
                          <SidebarMenuItem>
                            <SidebarMenuButton
                              @click.stop="cargarComponente('PanelEstablecimientosLista')"
                            >
                              Todos
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                          <SidebarMenuItem>
                            <SidebarMenuButton
                              @click.stop="cargarComponente('PanelEstablecimientosLista')"
                            >
                              Agregar
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        </SidebarMenu>
                      </SidebarGroupContent>
                    </SidebarGroup>
                  </SidebarContent>
                </Sidebar>

                <!-- contenido del sidebar -->
                <SidebarInset>
                  <SidebarTrigger class="mx-4 my-4" />
                  <Separator orientation="horizontal" class="" />
                  <div class="p-4">
                    <component :is="componenteActivo" />
                  </div>
                </SidebarInset>
              </div>
            </SidebarProvider>
          </div>
        </CardContent>
      </Card>
    </Transition>
  </div>
</template>

<style></style>
