// src\components\custom\sidebar\nav-secondary.tsx
'use client'

import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { handleSubmitFeedback } from '@/hooks/feedback'
import { type NavSecondaryItem } from '@/lib/types/navigation'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'

interface NavSecondaryProps extends React.ComponentPropsWithoutRef<typeof SidebarGroup> {
  items: Array<NavSecondaryItem & { icon?: React.ElementType }>
}

const FeedbackForm = ({ onSubmit }: { onSubmit: () => void }) => {
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!feedback.trim()) {
      toast.error('Feedback cannot be empty.')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await handleSubmitFeedback({ feedback })

      if (result.success) {
        toast.success(result.message)
        setFeedback('')
        onSubmit()
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      console.error('Failed to submit feedback:', error)
      toast.error('An unexpected error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Help us improve by sharing your thoughts and suggestions.
      </p>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="feedback" className="text-base font-medium">
            Your Feedback
          </Label>
          <Textarea
            id="feedback"
            placeholder="What's on your mind?"
            className="min-h-[120px] resize-none focus:ring-2 focus:ring-primary"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Submit Feedback
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export function NavSecondary({ items, ...props }: NavSecondaryProps) {
  const [mounted, setMounted] = useState(false)
  const [openDialog, setOpenDialog] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleClose = () => setOpenDialog(null)

  const getDialogContent = (item: NavSecondaryItem) => {
    switch (item.title) {
      case 'Send Feedback':
        return <FeedbackForm onSubmit={handleClose} />
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
