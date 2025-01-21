<script setup lang="ts">
const router = useRouter()

import { CircleHelp, Contact, FileSliders, LogOut } from 'lucide-vue-next' // iconos

const { perfil } = storeToRefs(useAuthStore())

const logout = async () => await router.push({ name: 'logout' })

const esEduti = computed(() => perfil.value?.email?.endsWith('@eduti.cl') ?? false)
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        data-test="dashboard-avatar-button"
        variant="ghost"
        class="relative h-8 w-8 rounded-full"
      >
        <Avatar class="h-8 w-8">
          <AvatarImage src="https://picsum.photos/seed/sergio/200" alt="@shadcn" />
          <AvatarFallback>SR</AvatarFallback>
        </Avatar>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56" align="end">
      <DropdownMenuLabel class="flex font-normal">
        <div class="flex flex-col space-y-1">
          <p data-test="dashboard-avatar-nombre" class="text-sm font-medium leading-none">
            {{ perfil?.nombre_usuario }} {{ perfil?.apellido_usuario }}
          </p>
          <p data-test="dashboard-avatar-email" class="text-xs leading-none text-muted-foreground">
            {{ perfil?.email }}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem @click="$router.push({ name: 'perfil' })">
          <Contact class="h-4 w-4" />
          <span class="ml-2">Mi perfil</span>
        </DropdownMenuItem>
        <DropdownMenuItem @click="$router.push({ name: 'panel-admin' })" v-if="esEduti">
          <FileSliders class="h-4 w-4" />
          <span class="ml-2">Panel administracion</span>
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          <CircleHelp class="h-4 w-4" />
          <span class="ml-2">Soporte</span>
        </DropdownMenuItem>
      </DropdownMenuGroup>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click.stop="logout">
        <LogOut class="h-4 w-4" />
        <span class="ml-2">Salir</span>
        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
