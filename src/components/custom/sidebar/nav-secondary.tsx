'use client'

import { useEffect, useState } from 'react'
import { LucideIcon, Mail, Phone, Clock, MessageSquare, ExternalLink, Send, Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { type NavSecondaryItem } from '@/lib/types/navigation'
import { useUserFeedback } from '@/lib/services/user-feedbacks'

interface NavSecondaryProps extends React.ComponentPropsWithoutRef<typeof SidebarGroup> {
  items: Array<NavSecondaryItem & { icon?: LucideIcon }>
}

const ContactInfo = () => {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Our support team is ready to assist you 24/7.
      </p>
      <Card className="transition-all hover:shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Contact Options
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex items-start space-x-4">
            <Mail className="h-5 w-5 text-primary mt-1" />
            <div className="space-y-1">
              <Label className="text-base font-medium">Email</Label>
              <a
                href="mailto:support@example.com"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                support@example.com
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Phone className="h-5 w-5 text-primary mt-1" />
            <div className="space-y-1">
              <Label className="text-base font-medium">Phone</Label>
              <a
                href="tel:1-800-SUPPORT"
                className="text-sm text-primary hover:underline flex items-center gap-1"
              >
                1-800-SUPPORT
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Clock className="h-5 w-5 text-primary mt-1" />
            <div className="space-y-1">
              <Label className="text-base font-medium">Hours</Label>
              <p className="text-sm text-muted-foreground">Available 24/7</p>
            </div>
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            Start Live Chat
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

const FeedbackForm = ({ onSubmit }: { onSubmit: () => void }) => {
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  // const { createUserFeedback } = useUserFeedback();

  // const handleSubmit = async () => {
  //   if (!feedback.trim()) {
  //     toast.error('Please enter your feedback')
  //     return
  //   }

  //   setIsSubmitting(true)
  //   try {
  //     await createUserFeedback({
  //       feedback_text: feedback.trim(),
  //     })
  //     toast.success('Feedback submitted successfully')
  //     onSubmit()
  //     setFeedback('')
  //   } catch (error) {
  //     toast.error('Failed to submit feedback', {
  //       description: error instanceof Error ? error.message : String(error),
  //     })
  //   } finally {
  //     setIsSubmitting(false)
  //   }
  // }

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
          // onClick={handleSubmit}
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

  const handleCustomerSupportClick = () => {
    // Redirect to the specified link
    window.location.href = "https://ipophil.freshdesk.com/support/home"
  }

  const handleClose = () => {
    setOpenDialog(null);
  }

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

            if (item.title === 'Customer Support') {
              // Directly return the menu item for "Customer Support" with redirection
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    size="sm"
                    className="w-full transition-colors"
                    onClick={handleCustomerSupportClick}
                  >
                    {ItemIcon && <ItemIcon className="h-4 w-4" />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            }

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
                        "w-full transition-colors",
                        openDialog === item.title && "bg-primary/10 text-primary"
                      )}
                    >
                      {ItemIcon && <ItemIcon className="h-4 w-4" />}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]" aria-describedby=''>
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
