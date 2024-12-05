<script setup lang="ts">
// shadcn
import { DropdownMenu } from '@/components/ui/dropdown-menu'
import DropdownMenuTrigger from '@/components/ui/dropdown-menu/DropdownMenuTrigger.vue'
import Button from '@/components/ui/button/Button.vue'
import Avatar from '@/components/ui/avatar/Avatar.vue'
import AvatarImage from '@/components/ui/avatar/AvatarImage.vue'
import AvatarFallback from '@/components/ui/avatar/AvatarFallback.vue'
import DropdownMenuContent from '@/components/ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuLabel from '@/components/ui/dropdown-menu/DropdownMenuLabel.vue'
import DropdownMenuSeparator from '@/components/ui/dropdown-menu/DropdownMenuSeparator.vue'
import DropdownMenuGroup from '@/components/ui/dropdown-menu/DropdownMenuGroup.vue'
import DropdownMenuItem from '@/components/ui/dropdown-menu/DropdownMenuItem.vue'
import DropdownMenuShortcut from '@/components/ui/dropdown-menu/DropdownMenuShortcut.vue'
// icons
import { CircleHelp, Contact, LogOut } from 'lucide-vue-next'

// data
const navLinks = [
  { routeName: 'cursos', text: 'Cursos' },
  { routeName: 'matriculas', text: 'Matriculas' },
]
</script>

<template>
  <div class="flex flex-col">
    <!-- Header -->
    <div class="bg-white">
      <header class="contenedor border-b">
        <div class="flex h-16 items-center px-8">
          <nav class="flex items-baseline space-x-4 lg:space-x-6">
            <RouterLink to="/dashboard" class="transition-colors hover:text-primary">
              <p class="font-sans text-sm font-black">TEL<span class="text-red-500">BOOK</span></p>
            </RouterLink>
            <RouterLink
              v-for="{ routeName, text } in navLinks"
              :key="routeName"
              :to="{ name: routeName }"
              class="text-sm font-medium transition-colors hover:text-primary"
            >
              {{ text }}
            </RouterLink>
          </nav>
          <div class="ml-auto flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger as-child>
                <Button variant="ghost" class="relative h-8 w-8 rounded-full">
                  <Avatar class="h-8 w-8">
                    <AvatarImage src="https://picsum.photos/seed/sergio/200" alt="@shadcn" />
                    <AvatarFallback>SR</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent class="w-56" align="end">
                <DropdownMenuLabel class="flex font-normal">
                  <div class="flex flex-col space-y-1">
                    <p class="text-sm font-medium leading-none">Sergio Rodriguez</p>
                    <p class="text-xs leading-none text-muted-foreground">sergio@eduti.cl</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Contact class="h-4 w-4" />
                    <span class="ml-2 hidden md:block">Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <CircleHelp class="h-4 w-4" />
                    <span class="ml-2 hidden md:block">Soporte</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut class="h-4 w-4" />
                  <span class="ml-2 hidden md:block">Salir</span>
                  <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </div>

    <!-- Contenido -->
    <main class="contenedor">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" class="" />
        </Transition>
      </RouterView>
    </main>

    <!-- Footer -->
    <footer></footer>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
