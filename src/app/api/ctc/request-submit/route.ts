import { NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const POST = async (req: Request) => {
  try {
    const body = await req.json()

    const {
      address,
      feesPaid,
      orNo,
      purpose,
      relationship,
      requesterName,
      signature,
      lcrNo,
      bookNo,
      pageNo,
      searchedBy,
      contactNo,
      datePaid,
      isRegisteredLate,
      whenRegistered,
      attachmentId,
    } = body

    // Check for required fields
    if (!address || !purpose || !relationship || !requesterName) {
      return NextResponse.json(
        {
          message:
            "Missing required fields. Please ensure address, purpose, relationship, and requesterName are provided.",
        },
        { status: 400 }
      )
    }

    const certifiedCopy = await prisma.certifiedCopy.create({
      data: {
        address,
        amountPaid: feesPaid ? parseFloat(feesPaid) : undefined,
        orNumber: orNo || undefined,
        purpose,
        relationshipToOwner: relationship,
        requesterName,
        signature: signature || undefined,
        lcrNo: lcrNo || undefined,
        bookNo: bookNo || undefined,
        pageNo: pageNo || undefined,
        searchedBy: searchedBy || undefined,
        contactNo: contactNo || undefined,
        datePaid: datePaid ? new Date(datePaid) : undefined,
        isRegistered: Boolean(isRegisteredLate),
        registeredDate: whenRegistered ? new Date(whenRegistered) : undefined,
        attachmentId: attachmentId,
      },
    })

    return NextResponse.json(
      {
        message: "Certified Copy request submitted successfully.",
        data: certifiedCopy,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Error submitting certified copy request:", error)
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 })
  }
}
