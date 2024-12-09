<script setup lang="ts">
// props
const props = defineProps<{ siglaCurso: string }>()

// shadcn
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

// data
const menuPlanificaciones: { title: string; href: string; description: string }[] = [
  {
    title: 'Corto plazo',
    href: '#',
    description:
      'A modal dialog that interrupts the user with important content and expects a response.',
  },
  {
    title: 'Mediano plazo',
    href: '#',
    description: 'For sighted users to preview content available behind a link.',
  },
  {
    title: 'Largo plazo',
    href: '#',
    description:
      'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
  },
  {
    title: 'Leccionario ',
    href: '#',
    description: 'Visually or semantically separates content.',
  },
]

const menuEvaluaciones: { title: string; href: string; description: string }[] = [
  {
    title: 'Por formato',
    href: '#',
    description:
      'A modal dialog that interrupts the user with important content and expects a response.',
  },
  {
    title: 'Personalizada',
    href: '#',
    description: 'For sighted users to preview content available behind a link.',
  },
]
</script>

<template>
  <div class="flex items-center space-x-2">
    <NavigationMenu>
      <NavigationMenuList>
        <!-- menu alumnos -->
        <NavigationMenuItem>
          <!-- <NavigationMenuLink href="#" :class="navigationMenuTriggerStyle()"> -->
          <NavigationMenuLink as-child>
            <!-- <RouterLink :to=""> Alumnos </RouterLink> -->
          </NavigationMenuLink>
        </NavigationMenuItem>

        <!-- menu Modulo TEL -->
        <NavigationMenuItem>
          <NavigationMenuLink href="#" :class="navigationMenuTriggerStyle()">
            <RouterLink :to="{ name: 'alumnos', params: { siglaCurso: props.siglaCurso } }">
              Alumnos
            </RouterLink>
          </NavigationMenuLink>
        </NavigationMenuItem>

        <!-- menu asistencia -->
        <NavigationMenuItem>
          <NavigationMenuTrigger>Asistencia</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-1">
              <li>
                <NavigationMenuLink as-child>
                  <a
                    href="/docs/introduction"
                    class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div class="text-sm font-medium leading-none">Diaria</div>
                    <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Realiza la asistencia del dia actual.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink as-child>
                  <a
                    href="/docs/installation"
                    class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div class="text-sm font-medium leading-none">Mensual</div>
                    <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Visualiza ó edita la asistencia de un mes completo.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <!-- menu planificaciones -->
        <NavigationMenuItem>
          <NavigationMenuTrigger>Planificaciones</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li v-for="menu in menuPlanificaciones" :key="menu.title">
                <NavigationMenuLink as-child>
                  <a
                    :href="menu.href"
                    class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div class="text-sm font-medium leading-none">{{ menu.title }}</div>
                    <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      {{ menu.description }}
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <!-- menu Evaluaciones -->
        <NavigationMenuItem>
          <NavigationMenuTrigger>Evaluaciones</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul class="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
              <li v-for="menu in menuEvaluaciones" :key="menu.title">
                <NavigationMenuLink as-child>
                  <a
                    :href="menu.href"
                    class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div class="text-sm font-medium leading-none">{{ menu.title }}</div>
                    <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      {{ menu.description }}
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <!-- menu Modulo TEL -->
        <NavigationMenuItem>
          <NavigationMenuLink href="#" :class="navigationMenuTriggerStyle()">
            Modulo TEL
          </NavigationMenuLink>
        </NavigationMenuItem>

        <!-- ejemplo -->
        <!-- <NavigationMenuItem>
          <NavigationMenuTrigger>Menu ejemplo</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul
              class="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[minmax(0,.75fr)_minmax(0,1fr)]"
            >
              <li class="row-span-3">
                <NavigationMenuLink as-child>
                  <a
                    class="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                    href="/"
                  >
                    <img src="https://www.radix-vue.com/logo.svg" class="h-6 w-6" />
                    <div class="mb-2 mt-4 text-lg font-medium">shadcn/ui</div>
                    <p class="text-sm leading-tight text-muted-foreground">
                      Beautifully designed components built with Radix UI and Tailwind CSS.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>

              <li>
                <NavigationMenuLink as-child>
                  <a
                    href="/docs/introduction"
                    class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div class="text-sm font-medium leading-none">Introduction</div>
                    <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Re-usable components built using Radix UI and Tailwind CSS.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink as-child>
                  <a
                    href="/docs/installation"
                    class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div class="text-sm font-medium leading-none">Installation</div>
                    <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      How to install dependencies and structure your app.
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <li>
                <NavigationMenuLink as-child>
                  <a
                    href="/docs/typography"
                    class="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <div class="text-sm font-medium leading-none">Typography</div>
                    <p class="line-clamp-2 text-sm leading-snug text-muted-foreground">
                      Styles for headings, paragraphs, lists...etc
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem> -->
      </NavigationMenuList>
    </NavigationMenu>
  </div>
</template>
