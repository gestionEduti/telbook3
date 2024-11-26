<script setup lang="ts">
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

const navLinks = [
  { to: '/dashboard', text: 'Home' },
  { to: '/dashboard/matriculas', text: 'Matriculas' },
]
</script>

<template>
  <div class="flex flex-col">
    <header class="border-b">
      <div class="flex h-16 items-center px-4">
        <nav class="flex items-center space-x-4 lg:space-x-6">
          <RouterLink
            v-for="{ to, text } in navLinks"
            :key="to"
            :to
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
                  <p class="text-sm font-medium leading-none">Sergio</p>
                  <p class="text-xs leading-none text-muted-foreground">sergio@eduti.cl</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem> Perfil </DropdownMenuItem>
                <DropdownMenuItem> Soporte </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                Salir
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
    <main>
      <RouterView />
    </main>
    <footer></footer>
  </div>
</template>

<style></style>
