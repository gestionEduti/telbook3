<script setup lang="ts">
import { KeyRound } from 'lucide-vue-next'
const { usuario, perfil, establecimiento } = useAuthStore()

import { formatearRut } from '@/lib/formato' // utilidades para formatear
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
            <div class="telbook-label">Nombre</div>
            <p class="mb-3 capitalize">
              {{ perfil.nombre_usuario?.toLocaleLowerCase() }}
              {{ perfil.apellido_usuario?.toLocaleLowerCase() }}
            </p>
            <div class="telbook-label">Email</div>
            <p class="mb-3">
              {{ usuario.email?.toLocaleLowerCase() }}
            </p>
            <div class="telbook-label">Rut</div>
            <p class="mb-3">
              {{ formatearRut(perfil.rut_usuario?.toLocaleLowerCase()) }}
            </p>
            <div class="telbook-label">Telefono</div>
            <p class="mb-3">
              {{ perfil.telefono?.toLocaleLowerCase() }}
            </p>
            <div class="telbook-label">RBD</div>
            <p class="mb-3">
              {{ String(perfil.rbd_usuario).toLocaleLowerCase() }}
            </p>
            <!-- <RouterLink to="/reset-password" class="btn btn-primary">
              <Button class="mt-8">
                <KeyRound />
                <span>Reiniciar mi contraseña</span>
              </Button>
            </RouterLink> -->
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
            <div class="telbook-label">Nombre</div>
            <p class="mb-3 capitalize">
              {{ establecimiento?.razon_social?.toLocaleLowerCase() }}
            </p>
            <div class="telbook-label">Cursos</div>
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
