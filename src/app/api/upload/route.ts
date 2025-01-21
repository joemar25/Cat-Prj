import path from 'path'
import { writeFile, mkdir } from 'fs/promises'
import { NextResponse } from 'next/server'

export const POST = async (req: Request) => {
    try {
        const formData = await req.formData()
        const file = formData.get('file')
        const referenceNumber = formData.get('referenceNumber')

        if (!file) {
            return NextResponse.json({ error: 'No files received.' }, { status: 400 })
        }

        // Log file details for debugging
        console.log('File received:', {
            name: (file as File).name,
            size: (file as File).size,
            type: (file as File).type,
            referenceNumber
        })

        const buffer = Buffer.from(await (file as File).arrayBuffer())

        // Use reference number for filename if available, otherwise use original filename
        const filename = referenceNumber
            ? `${referenceNumber}${path.extname((file as File).name)}`
            : (file as File).name.replaceAll(' ', '_')

        // Create assets directory path
        const assetsDir = path.join(process.cwd(), 'public/assets')

        // Create the assets directory if it doesn't exist
        try {
            await mkdir(assetsDir, { recursive: true })
            console.log('Assets directory created or already exists at:', assetsDir)
        } catch (mkdirError) {
            console.error('Error creating assets directory:', mkdirError)
            throw mkdirError
        }

        const filepath = path.join(assetsDir, filename)
        console.log('Writing file to:', filepath)

        await writeFile(filepath, buffer)

        return NextResponse.json({
            Message: 'Success',
            status: 201,
            filepath: `/assets/${filename}`
        })
    } catch (error) {
        console.error('Detailed error:', error)
        return NextResponse.json({
            Message: 'Failed',
            error: error instanceof Error ? error.message : 'Unknown error',
            status: 500
        })
    }
}