import { NextResponse } from "next/server"
import puppeteer from "puppeteer"

export async function POST(req: Request) {
    try {
        const { chartHtml } = await req.json()

        if (!chartHtml) {
            console.error("API Error: No chart HTML received.")
            return NextResponse.json({ error: "No chart HTML provided" }, { status: 400 })
        }

        console.log("Received chart HTML for export:", chartHtml.slice(0, 100))

        // Launch Puppeteer
        const browser = await puppeteer.launch({ headless: true })
        const page = await browser.newPage()

        // Set content and wait for render
        await page.setContent(chartHtml, { waitUntil: "networkidle0" })

        // Capture chart as an image
        const screenshot = await page.screenshot({ type: "png" })
        await browser.close()

        console.log("Export successful, returning image.")

        return new NextResponse(screenshot, {
            status: 200,
            headers: {
                "Content-Type": "image/png",
                "Content-Disposition": `attachment; filename=chart_${Date.now()}.png`,
            },
        })
    } catch (error) {
        console.error("Export API Failed:", error)

        return NextResponse.json({
            error: error instanceof Error ? error.message : "Error generating chart export"
        }, { status: 500 })
    }
}
