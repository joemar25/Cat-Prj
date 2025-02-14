// 'use client'

// import { LucideIcon } from 'lucide-react'
// // import { Icons } from '@/components/ui/icons'
// // import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
// import { SidebarGroup, SidebarGroupLabel, SidebarMenu,/* SidebarMenuAction, */ SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar'

// export function NavProjects({
//   items,
// }: {
//   items: {
//     title: string;
//     url: string;
//     icon: LucideIcon | null;
//   }[]
// }) {
//   // const { isMobile } = useSidebar()

//   return (
//     <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
//       <SidebarGroupLabel>Extra</SidebarGroupLabel>
//       <SidebarMenu>
//         {items.map((item) => (
//           <SidebarMenuItem key={item.title}>
//             <SidebarMenuButton asChild className={`hover:bg-chart-1/30 duration-150 ease-in-out transition-all`}>
//               <a href={item.url}>
//                 {item.icon && <item.icon className="w-5 h-5 text-muted-foreground" />}
//                 <span>{item.title}</span>
//               </a>
//             </SidebarMenuButton>
//             {/* <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <SidebarMenuAction showOnHover>
//                   <Icons.moreHorizontal />
//                   <span className='sr-only'>More</span>
//                 </SidebarMenuAction>
//               </DropdownMenuTrigger>
//               <DropdownMenuContent
//                 className='w-48'
//                 side={isMobile ? 'bottom' : 'right'}
//                 align={isMobile ? 'end' : 'start'}
//               >
//                 <DropdownMenuItem>
//                   <Icons.folder className='text-muted-foreground' />
//                   <span>View Project</span>
//                 </DropdownMenuItem>
//                 <DropdownMenuItem>
//                   <Icons.share className='text-muted-foreground' />
//                   <span>Share Project</span>
//                 </DropdownMenuItem>
//                 <DropdownMenuSeparator />
//                 <DropdownMenuItem>
//                   <Icons.trash2 className='text-muted-foreground' />
//                   <span>Delete Project</span>
//                 </DropdownMenuItem>
//               </DropdownMenuContent>
//             </DropdownMenu> */}
//           </SidebarMenuItem>
//         ))}
//         {/* <SidebarMenuItem>
//           <SidebarMenuButton>
//             <Icons.moreHorizontal />
//             <span>More</span>
//           </SidebarMenuButton>
//         </SidebarMenuItem> */}
//       </SidebarMenu>
//     </SidebarGroup>
//   )
// }


'use client'

import { LucideIcon } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

export function NavProjects({
  items,
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon | null
  }[]
}) {
  const pathname = usePathname()

  return (
    <SidebarGroup className='group-data-[collapsible=icon]:hidden'>
      <SidebarGroupLabel>Extra</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = pathname === item.url
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                className={`hover:bg-chart-1/30 duration-150 ease-in-out transition-all ${
                  isActive ? 'bg-chart-1 text-accent dark:text-accent-foreground hover:text-muted-foreground dark:hover:text-accent-foreground' : 'text-muted-foreground'
                }`}
              >
                <a href={item.url} className="flex items-center gap-2 px-3 py-2 rounded-md">
                  {item.icon && <item.icon className="w-5 h-5 " />}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
