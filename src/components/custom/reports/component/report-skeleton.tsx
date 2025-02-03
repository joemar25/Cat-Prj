import { Card, CardContent } from "@/components/ui/card"

export const ReportSkeleton = () => {
    return (
        <div className="w-full my-2 space-y-4">
            <Card className="p-2.5">
                <CardContent className="py-2 px-1 bg-muted/10 rounded-md w-full justify-start items-start flex flex-row gap-6">
                    <div className="w-fit flex flex-col gap-2">
                        <div className="w-56 h-4 rounded-md bg-muted animate-pulse"></div>
                        <div className="w-full min-w-[420px] h-10 rounded-md bg-muted animate-pulse"></div>
                    </div>
                    <div className="w-fit flex flex-col gap-2">
                        <div className="w-56 h-4 rounded-md bg-muted animate-pulse"></div>
                        <div className="min-w-[420px] h-10 rounded-md bg-muted animate-pulse"></div>
                    </div>
                </CardContent>

                <CardContent className="w-full rounded-md pt-6">
                    <div className="flex flex-col w-full gap-2">
                        <div className="bg-muted w-72 h-10 mb-6 animate-pulse rounded-md"></div>
                        
                        {/* Table Header */}
                        <div className="w-full grid grid-cols-6 gap-4 mb-4">
                            {[...Array(6)].map((_, index) => (
                                <div 
                                    key={`header-${index}`} 
                                    className="bg-muted w-full h-6 animate-pulse rounded-md"
                                ></div>
                            ))}
                        </div>

                        {/* Table Rows */}
                        {[...Array(5)].map((_, rowIndex) => (
                            <div 
                                key={`row-${rowIndex}`} 
                                className="w-full grid grid-cols-6 gap-4 mb-2"
                            >
                                {[...Array(6)].map((_, colIndex) => (
                                    <div 
                                        key={`cell-${rowIndex}-${colIndex}`} 
                                        className="bg-muted w-full max-w-sm h-4 animate-pulse rounded-md"
                                    ></div>
                                ))}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}