<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
const { usuario, perfil, establecimiento } = useAuthStore()

// utils
import { formatearRut } from '@/lib/formato'

// shadcn
import Card from '@/components/ui/card/Card.vue'
import CardContent from '@/components/ui/card/CardContent.vue'
import CardHeader from '@/components/ui/card/CardHeader.vue'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import Separator from '@/components/ui/separator/Separator.vue'
</script>

<template>
  <div class="flex-1 space-y-3 px-4 py-8 pt-3">
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Transition name="fade" mode="out-in">
        <Card v-if="usuario && perfil" class="shadow-xl">
          <CardHeader>
            <CardTitle>Perfil</CardTitle>
            <Separator />
          </CardHeader>
          <CardContent>
            <div class="text-sm font-semibold tracking-tighter text-gray-400">Nombre</div>
            <p class="mb-3 capitalize">
              {{ perfil.nombre_usuario?.toLocaleLowerCase() }}
              {{ perfil.apellido_usuario?.toLocaleLowerCase() }}
            </p>
            <div class="text-sm font-semibold tracking-tighter text-gray-400">Email</div>
            <p class="mb-3">
              {{ usuario.email?.toLocaleLowerCase() }}
            </p>
            <div class="text-sm font-semibold tracking-tighter text-gray-400">Rut</div>
            <p class="mb-3">
              {{ formatearRut(perfil.rut_usuario?.toLocaleLowerCase()) }}
            </p>
            <div class="text-sm font-semibold tracking-tighter text-gray-400">Telefono</div>
            <p class="mb-3">
              {{ perfil.telefono?.toLocaleLowerCase() }}
            </p>
            <div class="text-sm font-semibold tracking-tighter text-gray-400">RBD</div>
            <p class="mb-3">
              {{ String(perfil.rbd_usuario).toLocaleLowerCase() }}
            </p>
          </CardContent>
        </Card>
      </Transition>

      <Transition name="fade" mode="out-in">
        <Card v-if="establecimiento" class="shadow-xl">
          <CardHeader>
            <CardTitle>Establecimiento</CardTitle>
            <Separator />
          </CardHeader>
          <CardContent>
            <div class="text-sm font-semibold tracking-tighter text-gray-400">Nombre</div>
            <p class="mb-3 capitalize">
              {{ establecimiento?.razon_social?.toLocaleLowerCase() }}
            </p>
            <div class="text-sm font-semibold tracking-tighter text-gray-400">Cursos</div>
            <p class="mb-3 capitalize">No tienes cursos asignados</p>
          </CardContent>
        </Card>
      </Transition>

      <Transition name="fade" mode="out-in">
        <Card v-if="establecimiento" class="shadow-xl sm:col-span-2">
          <CardHeader>
            <CardTitle>Ultimas actividades</CardTitle>
            <Separator />
          </CardHeader>
          <CardContent> No se registran actividades recientemente. </CardContent>
        </Card>
      </Transition>
    </div>
  </div>
</template>

<style></style>
