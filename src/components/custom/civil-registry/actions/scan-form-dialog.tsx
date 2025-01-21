import { Icons } from "@/components/ui/icons";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function ScanFormDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                    <Icons.post className="mr-2 h-4 w-4" />
                    Scan Form
                </div>
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
    );
}