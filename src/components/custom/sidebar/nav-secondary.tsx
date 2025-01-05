// src/components/custom/sidebar/nav-secondary.tsx
'use client'

import { useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { type NavSecondaryItem } from '@/lib/types/navigation'
import { FeedbackForm } from '@/components/custom/feedback/feedback-form'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

interface NavSecondaryProps extends React.ComponentPropsWithoutRef<typeof SidebarGroup> {
  items: Array<NavSecondaryItem & { icon?: React.ElementType }>
}

export function NavSecondary({ items, ...props }: NavSecondaryProps) {
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)
  const [openDialog, setOpenDialog] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCloseAction = async () => {
    setOpenDialog(null)
  }

  const getDialogContent = (item: NavSecondaryItem) => {
    switch (item.title) {
      case 'Send Feedback':
        return session?.user?.id ? (
          <FeedbackForm
            userId={session.user.id}
            onSubmitAction={handleCloseAction}
          />
        ) : (
          <p className="text-muted-foreground">Please sign in to submit feedback.</p>
        )
      default:
        return <p className="text-muted-foreground">Content for {item.title}</p>
    }
  }

  if (!mounted || !items?.length) return null

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const ItemIcon = item.icon

            return (
              <SidebarMenuItem key={item.title}>
                <Dialog
                  open={openDialog === item.title}
                  onOpenChange={(open) => setOpenDialog(open ? item.title : null)}
                >
                  <DialogTrigger asChild>
                    <SidebarMenuButton
                      size="sm"
                      className={cn(
                        'w-full transition-colors',
                        openDialog === item.title && 'bg-primary/10 text-primary'
                      )}
                    >
                      {ItemIcon && <ItemIcon className="h-4 w-4" />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        {ItemIcon && <ItemIcon className="h-5 w-5 text-primary" />}
                        {item.title}
                      </DialogTitle>
                    </DialogHeader>
                    {getDialogContent(item)}
                  </DialogContent>
                </Dialog>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}