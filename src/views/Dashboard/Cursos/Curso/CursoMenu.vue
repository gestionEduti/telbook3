<script setup lang="ts">
import { navigationMenuTriggerStyle } from '@/components/ui/navigation-menu'

const props = defineProps<{
  nivel: string
  letra: string
}>()

// data
const menuPlanificaciones: { title: string; to: string; description: string }[] = [
  {
    title: 'Corto plazo',
    to: 'planificacionesCortoPlazo',
    description: 'Realiza las planificaciones a corto plazo',
  },
  {
    title: 'Mediano plazo',
    to: 'planificacionesMedianoPlazo',
    description: 'Realiza las planificaciones a mediano plazo',
  },
  {
    title: 'Largo plazo',
    to: 'planificacionesLargoPlazo',
    description: 'Realiza las planificaciones a largo plazo',
  },
  {
    title: 'Leccionario ',
    to: 'leccionario',
    description: 'Realiza las planificaciones de acuerdo al leccionario',
  },
]

const menuEvaluaciones: { title: string; to: string; description: string }[] = [
  {
    title: 'Por formato',
    to: 'evaluacionesPorFormato',
    description: 'Realiza las evaluaciones por formato',
  },
  {
    title: 'Personalizada',
    to: 'evaluacionesPersonalizadas',
    description: 'Realiza las evaluaciones de manera personalizada',
  },
]
</script>

<template>
  <div class="flex items-center space-x-2">
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink :class="navigationMenuTriggerStyle()">
            <RouterLink
              :to="{
                name: 'alumnos',
                params: {
                  nivel: props.nivel,
                  letra: props.letra,
                },
              }"
            >
              Alumnos
            </RouterLink>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Asistencia</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-1">
              <li>
                <NavigationMenuLink as-child>
                  <RouterLink :to="{ name: 'asistenciaDiaria' }">
                    <div
                      class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div class="text-sm font-medium leading-none">Diaria</div>
                      <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Realiza la asistencia del dia actual.
                      </p>
                    </div>
                  </RouterLink>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink as-child>
                  <RouterLink :to="{ name: 'asistenciaMensual' }">
                    <div
                      class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div class="text-sm font-medium leading-none">Mensual</div>
                      <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Visualiza ó edita la asistencia de un mes completo.
                      </p>
                    </div>
                  </RouterLink>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Planificaciones</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li v-for="menu in menuPlanificaciones" :key="menu.title">
                <NavigationMenuLink as-child>
                  <RouterLink :to="{ name: menu.to }">
                    <div
                      class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div class="text-sm font-medium leading-none">{{ menu.title }}</div>
                      <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {{ menu.description }}
                      </p>
                    </div>
                  </RouterLink>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>Evaluaciones</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li v-for="menu in menuEvaluaciones" :key="menu.title">
                <NavigationMenuLink as-child>
                  <RouterLink :to="{ name: menu.to }">
                    <div
                      class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                    >
                      <div class="text-sm font-medium leading-none">{{ menu.title }}</div>
                      <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {{ menu.description }}
                      </p>
                    </div>
                  </RouterLink>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuLink :class="navigationMenuTriggerStyle()">
            <RouterLink :to="{ name: 'moduloTel' }"> Modulo TEL </RouterLink>
          </NavigationMenuLink>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  </div>
</template>
