import { Icons } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function ScanFormDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="default" className="h-10">
                    <Icons.post className="mr-2 h-4 w-4" />
                    Scan Form
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Scan Form</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="flex items-center justify-center h-40 border-2 border-dashed rounded-lg">
                        <p className="text-sm text-muted-foreground">Scanner functionality to be implemented</p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}