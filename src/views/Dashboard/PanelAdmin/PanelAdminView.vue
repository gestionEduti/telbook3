<script setup lang="ts">
import { shallowRef } from 'vue'

import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import CardDescription from '@/components/ui/card/CardDescription.vue'
import CardFooter from '@/components/ui/card/CardFooter.vue'
import Button from '@/components/ui/button/Button.vue'
import Separator from '@/components/ui/separator/Separator.vue'

import PanelUsuarios from '@/views/Dashboard/PanelAdmin/PanelUsuarios.vue'
import PanelEstablecimientos from '@/views/Dashboard/PanelAdmin/PanelEstablecimientos.vue'

const componenteActivo = shallowRef(PanelUsuarios)

interface Item {
  nombre: string
  componente: typeof PanelUsuarios
}

const botones: Item[] = [
  {
    nombre: 'Usuarios',
    componente: PanelUsuarios,
  },
  {
    nombre: 'Establecimientos',
    componente: PanelEstablecimientos,
  },
]
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
          <div class="flex space-x-4 divide-x">
            <!-- menu izquierda -->
            <aside>
              <nav class="flex flex-col space-y-1">
                <Button
                  v-for="boton in botones"
                  :key="boton.nombre"
                  variant="ghost"
                  @click.stop="componenteActivo = boton.componente"
                >
                  {{ boton.nombre }}
                </Button>
              </nav>
            </aside>

            <!-- panel derecha -->
            <div class="flex-1 pl-8">
              <component :is="componenteActivo" />
            </div>
          </div>
        </CardContent>
        <CardFooter> </CardFooter>
      </Card>
    </Transition>
  </div>
</template>

<style></style>
