// prisma/seed-data.ts

/**
 * Import necessary libraries and types
 */
import { REGIONS } from '@/lib/constants/locations'
import { fakerEN as faker } from '@faker-js/faker'
import {
  AttendantType,
  DocumentStatus,
  FormType,
  NotificationType,
  PrismaClient,
} from '@prisma/client'

// ======================================================================
// Helper Functions
// ======================================================================

/**
 * Generate a random date between two dates
 * @param start - Start date
 * @param end - End date
 * @returns Random date between start and end
 */
const randomDate = (start: Date, end: Date): Date => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  )
}

/**
 * Generate a person's name in JSON format
 * @returns Object containing first, middle, and last name
 */
const generatePersonName = () => ({
  first: faker.person.firstName(),
  middle: faker.person.lastName(),
  last: faker.person.lastName(),
})

/**
 * Generate a time string in "HH:mm AM/PM" format
 * @returns Time string
 */
const generateTimeString = (): string => {
  const hours = faker.number.int({ min: 1, max: 12 })
  const minutes = faker.number.int({ min: 0, max: 59 })
  const ampm = faker.helpers.arrayElement(['AM', 'PM'])
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')} ${ampm}`
}

/**
 * Generate a random Philippine location in the specified format
 * @returns Object containing city/municipality, province, and region
 */
const generatePhLocation = () => {
  // This follows this format: (House No., Street, Barangay, City/Municipality, Province, Country)
  const region = faker.helpers.arrayElement(REGIONS)
  let province, cityMunicipality, barangay
  if (region.provinces === null) {
    // Handle regions without provinces (e.g., NCR)
    cityMunicipality = faker.helpers.arrayElement(region.citiesMunicipalities)
    province = { name: 'N/A' } // No province for NCR
    barangay =
      cityMunicipality.barangays.length > 0
        ? faker.helpers.arrayElement(cityMunicipality.barangays)
        : 'N/A'
  } else {
    // Handle regions with provinces
    province = faker.helpers.arrayElement(region.provinces)
    cityMunicipality = faker.helpers.arrayElement(
      province.citiesMunicipalities
    )
    barangay =
      cityMunicipality.barangays && cityMunicipality.barangays.length > 0
        ? faker.helpers.arrayElement(cityMunicipality.barangays)
        : 'N/A'
  }
  const street = faker.location.streetAddress()
  const houseNo = faker.location.buildingNumber()
  return {
    cityMunicipality: cityMunicipality.name,
    province: province.name,
    region: region.name,
    barangay,
    street,
    houseNo,
  }
}
// ======================================================================
// Feedback Data Generation
// ======================================================================

/**
 * Generate feedback data
 * @param userIds - Array of user IDs
 * @returns Feedback object
 */
const generateFeedback = (userIds: string[]) => {
  const feedbackMessages = [
    'The system is very user-friendly and easy to navigate.',
    'I encountered some lag when submitting forms. Please optimize the performance.',
    'It would be great to have a dark mode option for the interface.',
    'I found a bug where the form submission fails when the internet connection is slow.',
    'The civil registry process is much faster now. Thank you!',
    'Can you add a feature to track the status of my submitted documents?',
    'The system is reliable, but the UI could use some modern design improvements.',
    'I appreciate the quick response from the support team.',
    'The search functionality for records could be improved.',
    'The system is excellent, but it would be helpful to have more detailed instructions.',
  ]

  // Randomly decide if the feedback is anonymous (50% chance)
  const isAnonymous = faker.datatype.boolean()

  return {
    feedback: faker.helpers.arrayElement(feedbackMessages),
    submittedBy: isAnonymous ? null : faker.helpers.arrayElement(userIds), // Null for anonymous users
    createdAt: faker.date.between({
      from: new Date(2023, 0, 1),
      to: new Date(),
    }),
    updatedAt: faker.date.between({
      from: new Date(2023, 0, 1),
      to: new Date(),
    }),
  }
}

/**
 * Seed feedback data into the database
 * @param prisma - Prisma client instance
 * @param userIds - Array of user IDs
 */
export const seedFeedbackData = async (
  prisma: PrismaClient,
  userIds: string[]
) => {
  console.log('Seeding Feedback data...')

  // Generate an array of feedback entries
  const feedbackData = Array(50)
    .fill(null)
    .map(() => generateFeedback(userIds))

  // Insert feedback data into the database
  await prisma.feedback.createMany({ data: feedbackData })

  console.log('Feedback data seeded successfully!')
}

// ======================================================================
// Notification Data Generation
// ======================================================================

/**
 * Generate notification data
 * @param userIds - Array of user IDs
 * @returns Notification object
 */
const generateNotification = (userIds: string[]) => {
  const notificationTitles = [
    'New Document Uploaded',
    'Form Submission Approved',
    'Form Submission Rejected',
    'Reminder: Update Your Profile',
    'System Maintenance Scheduled',
    'New Feedback Received',
    'Certified Copy Request Processed',
    'Payment Received',
    'Account Verification Required',
    'Welcome to the Civil Registry System',
  ]

  const notificationMessages = [
    'A new document has been uploaded to your account. Please review it.',
    'Your form submission has been approved. You can now proceed to the next step.',
    'Your form submission has been rejected. Please review the comments and resubmit.',
    'Please update your profile information to ensure accurate records.',
    'System maintenance is scheduled for tomorrow at 2:00 AM. Expect downtime for 1 hour.',
    'You have received new feedback. Please review it in the feedback section.',
    'Your certified copy request has been processed. You can download it now.',
    'Your payment has been received. Thank you for your transaction.',
    'Your account requires verification. Please upload the necessary documents.',
    'Welcome to the Civil Registry System! We are glad to have you here.',
  ]

  return {
    userId: faker.helpers.arrayElement(userIds), // Assign to a random user
    type: faker.helpers.arrayElement(Object.values(NotificationType)), // Random type (EMAIL, SYSTEM, SMS)
    title: faker.helpers.arrayElement(notificationTitles),
    message: faker.helpers.arrayElement(notificationMessages),
    read: faker.datatype.boolean(), // Randomly mark as read or unread
    readAt: faker.helpers.maybe(() => faker.date.recent(), {
      probability: 0.5,
    }), // Optional readAt timestamp
    createdAt: faker.date.between({
      from: new Date(2023, 0, 1),
      to: new Date(),
    }), // Random creation date
  }
}

/**
 * Seed notification data into the database
 * @param prisma - Prisma client instance
 * @param userIds - Array of user IDs
 */
export const seedNotificationData = async (
  prisma: PrismaClient,
  userIds: string[]
) => {
  console.log('Seeding Notification data...')

  // Generate an array of notification entries
  const notificationData = Array(100) // Generate 100 notifications
    .fill(null)
    .map(() => generateNotification(userIds))

  // Insert notification data into the database
  await prisma.notification.createMany({ data: notificationData })

  console.log('Notification data seeded successfully!')
}

// ======================================================================
// Base Registry Form Generation
// ======================================================================

/**
 * Generate a base registry form
 * @param formType - Type of form (BIRTH, MARRIAGE, DEATH)
 * @param userIds - Array of user IDs
 * @returns Base registry form object
 */
const generateBaseRegistryForm = (formType: FormType, userIds: string[]) => {
  if (userIds.length === 0) {
    throw new Error('No user IDs available for preparedById')
  }

  const registrationDate = randomDate(new Date(2023, 0, 1), new Date())
  const location = generatePhLocation()

  return {
    formNumber:
      formType === FormType.MARRIAGE
        ? '97'
        : formType === FormType.BIRTH
          ? '102'
          : '103',
    formType,
    registryNumber: faker.string.numeric(8),
    province: location.province,
    cityMunicipality: location.cityMunicipality,
    pageNumber: faker.string.numeric(3),
    bookNumber: faker.string.numeric(3),
    receivedBy: faker.person.fullName(),
    receivedByPosition: 'Civil Registry Officer',
    receivedDate: registrationDate,
    registeredBy: faker.person.fullName(),
    registeredByPosition: 'Civil Registrar',
    registrationDate,
    dateOfRegistration: registrationDate,
    isLateRegistered: faker.datatype.boolean(),
    remarks: faker.helpers.maybe(() => faker.lorem.sentence()),
    lcroNotations: faker.helpers.maybe(() => faker.string.alpha(10)),
    status: faker.helpers.arrayElement(Object.values(DocumentStatus)),
    preparedById: faker.helpers.arrayElement(userIds),
    verifiedById: faker.helpers.maybe(
      () => faker.helpers.arrayElement(userIds),
      { probability: 0.8 }
    ),
  }
}

// ======================================================================
// Certificate Data Generation (Marriage, Birth, Death)
// ======================================================================

/**
 * Generate marriage certificate data
 * @param userIds - Array of user IDs
 * @returns Marriage certificate object
 */
const generateMarriageCertificate = (userIds: string[]) => {
  const marriageDate = randomDate(new Date(2020, 0, 1), new Date())
  const husbandBirthDate = randomDate(
    new Date(1970, 0, 1),
    new Date(2000, 0, 1)
  )
  const wifeBirthDate = randomDate(new Date(1970, 0, 1), new Date(2000, 0, 1))

  const husbandResidenceLocation = generatePhLocation()
  const wifeResidenceLocation = generatePhLocation()

  return {
    baseForm: generateBaseRegistryForm(FormType.MARRIAGE, userIds),
    marriageCertificateForm: {
      husbandFirstName: faker.person.firstName('male'),
      husbandMiddleName: faker.person.lastName(),
      husbandLastName: faker.person.lastName(),
      husbandDateOfBirth: husbandBirthDate,
      husbandAge: Math.floor(
        (marriageDate.getTime() - husbandBirthDate.getTime()) / 31557600000
      ),
      husbandPlaceOfBirth: generatePhLocation(),
      husbandSex: 'Male',
      husbandCitizenship: 'Filipino',
      husbandResidence: `${husbandResidenceLocation.houseNo}, ${husbandResidenceLocation.street}, ${husbandResidenceLocation.barangay}, ${husbandResidenceLocation.cityMunicipality}, ${husbandResidenceLocation.province}, Philippines`,
      husbandReligion: faker.helpers.arrayElement([
        'Catholic',
        'Protestant',
        'Islam',
        'Buddhism',
      ]),
      husbandCivilStatus: faker.helpers.arrayElement([
        'Single',
        'Widowed',
        'Divorced',
      ]),
      husbandFatherName: generatePersonName(),
      husbandFatherCitizenship: 'Filipino',
      husbandMotherMaidenName: generatePersonName(),
      husbandMotherCitizenship: 'Filipino',

      wifeFirstName: faker.person.firstName('female'),
      wifeMiddleName: faker.person.lastName(),
      wifeLastName: faker.person.lastName(),
      wifeDateOfBirth: wifeBirthDate,
      wifeAge: Math.floor(
        (marriageDate.getTime() - wifeBirthDate.getTime()) / 31557600000
      ),
      wifePlaceOfBirth: generatePhLocation(),
      wifeSex: 'Female',
      wifeCitizenship: 'Filipino',
      wifeResidence: `${wifeResidenceLocation.houseNo}, ${wifeResidenceLocation.street}, ${wifeResidenceLocation.barangay}, ${wifeResidenceLocation.cityMunicipality}, ${wifeResidenceLocation.province}, Philippines`,
      wifeReligion: faker.helpers.arrayElement([
        'Catholic',
        'Protestant',
        'Islam',
        'Buddhism',
      ]),
      wifeCivilStatus: faker.helpers.arrayElement([
        'Single',
        'Widowed',
        'Divorced',
      ]),
      wifeFatherName: generatePersonName(),
      wifeFatherCitizenship: 'Filipino',
      wifeMotherMaidenName: generatePersonName(),
      wifeMotherCitizenship: 'Filipino',

      placeOfMarriage: {
        office: faker.helpers.arrayElement([
          'Church',
          'City Hall',
          'Garden',
          'Beach Resort',
        ]),
        ...generatePhLocation(),
      },
      dateOfMarriage: marriageDate,
      timeOfMarriage: generateTimeString(),

      marriageSettlement: faker.datatype.boolean(),
      contractingPartiesSignature: {
        husband: faker.person.fullName(),
        wife: faker.person.fullName(),
      },

      marriageLicenseDetails: {
        number: faker.string.numeric(8),
        dateIssued: randomDate(new Date(2020, 0, 1), marriageDate),
        placeIssued: generatePhLocation(),
      },

      solemnizingOfficer: {
        name: faker.person.fullName(),
        position: faker.helpers.arrayElement([
          'Priest',
          'Judge',
          'Mayor',
          'Minister',
        ]),
        religion: faker.helpers.arrayElement([
          'Catholic',
          'Protestant',
          'Islam',
        ]),
        registryNoExpiryDate: faker.date.future().toISOString(),
      },

      witnesses: Array(2)
        .fill(null)
        .map(() => ({
          name: faker.person.fullName(),
          signature: faker.person.fullName(),
        })),
    },
  }
}

/**
 * Generate birth certificate data
 * @param userIds - Array of user IDs
 * @returns Birth certificate object
 */
const generateBirthCertificate = (userIds: string[]) => {
  const birthDate = randomDate(new Date(2020, 0, 1), new Date())
  const motherAge = faker.number.int({ min: 18, max: 45 })
  const fatherAge = faker.number.int({ min: 20, max: 50 })

  const motherResidenceLocation = generatePhLocation()
  const fatherResidenceLocation = generatePhLocation()

  return {
    baseForm: generateBaseRegistryForm(FormType.BIRTH, userIds),
    birthCertificateForm: {
      childName: generatePersonName(),
      sex: faker.helpers.arrayElement(['Male', 'Female']),
      dateOfBirth: birthDate,
      placeOfBirth: {
        hospital: faker.helpers.arrayElement([
          "St. Luke's Medical Center",
          'Makati Medical Center',
          'Philippine General Hospital',
          'Asian Hospital',
        ]),
        ...generatePhLocation(),
      },
      typeOfBirth: faker.helpers.arrayElement(['Single', 'Twin', 'Triplet']),
      birthOrder: faker.number.int({ min: 1, max: 5 }).toString(),
      weightAtBirth:
        faker.number.float({ min: 2.5, max: 4.5, fractionDigits: 2 }) * 1000,

      motherMaidenName: generatePersonName(),
      motherCitizenship: 'Filipino',
      motherReligion: faker.helpers.arrayElement([
        'Catholic',
        'Protestant',
        'Islam',
      ]),
      motherOccupation: faker.person.jobTitle(),
      motherAge,
      motherResidence: `${motherResidenceLocation.houseNo}, ${motherResidenceLocation.street}, ${motherResidenceLocation.barangay}, ${motherResidenceLocation.cityMunicipality}, ${motherResidenceLocation.province}, Philippines`,

      totalChildrenBornAlive: faker.number.int({ min: 1, max: 5 }),
      childrenStillLiving: faker.number.int({ min: 1, max: 5 }),
      childrenNowDead: faker.number.int({ min: 0, max: 2 }),

      fatherName: generatePersonName(),
      fatherCitizenship: 'Filipino',
      fatherReligion: faker.helpers.arrayElement([
        'Catholic',
        'Protestant',
        'Islam',
      ]),
      fatherOccupation: faker.person.jobTitle(),
      fatherAge,
      fatherResidence: `${fatherResidenceLocation.houseNo}, ${fatherResidenceLocation.street}, ${fatherResidenceLocation.barangay}, ${fatherResidenceLocation.cityMunicipality}, ${fatherResidenceLocation.province}, Philippines`,

      parentMarriage: {
        date: randomDate(new Date(2015, 0, 1), birthDate),
        place: {
          ...generatePhLocation(),
          country: 'Philippines',
        },
      },

      attendant: {
        type: faker.helpers.arrayElement(Object.values(AttendantType)),
        name: faker.person.fullName(),
        title: 'MD',
        address: faker.location.streetAddress(),
        signature: faker.person.fullName(),
        date: birthDate,
      },

      informant: {
        name: faker.person.fullName(),
        signature: faker.person.fullName(),
        relationship: faker.helpers.arrayElement([
          'Mother',
          'Father',
          'Grandmother',
        ]),
        address: faker.location.streetAddress(),
        date: birthDate,
      },

      preparer: {
        name: faker.person.fullName(),
        signature: faker.person.fullName(),
        title: 'Civil Registry Staff',
        date: birthDate,
      },
    },
  }
}

/**
 * Generate death certificate data
 * @param userIds - Array of user IDs
 * @returns Death certificate object
 */
const generateDeathCertificate = (userIds: string[]) => {
  const deathDate = randomDate(new Date(2020, 0, 1), new Date())
  const birthDate = randomDate(new Date(1940, 0, 1), new Date(2000, 0, 1))

  const residenceLocation = generatePhLocation()

  return {
    baseForm: generateBaseRegistryForm(FormType.DEATH, userIds),
    deathCertificateForm: {
      certificationType: faker.helpers.arrayElement(['ORIGINAL', 'COPY']),
      deceasedName: generatePersonName(),
      sex: faker.helpers.arrayElement(['Male', 'Female']),
      dateOfDeath: deathDate,
      placeOfDeath: {
        ...generatePhLocation(),
      },
      dateOfBirth: birthDate,
      placeOfBirth: generatePhLocation(),
      civilStatus: faker.helpers.arrayElement([
        'Single',
        'Married',
        'Widowed',
        'Divorced',
      ]),
      religion: faker.helpers.arrayElement(['Catholic', 'Protestant', 'Islam']),
      citizenship: 'Filipino',
      residence: `${residenceLocation.houseNo}, ${residenceLocation.street}, ${residenceLocation.barangay}, ${residenceLocation.cityMunicipality}, ${residenceLocation.province}, Philippines`,
      occupation: faker.person.jobTitle(),
      nameOfFather: generatePersonName(),
      nameOfMother: generatePersonName(),

      causesOfDeath: {
        immediate: faker.helpers.arrayElement([
          'Cardiac Arrest',
          'Respiratory Failure',
          'Multiple Organ Failure',
        ]),
        antecedent: faker.helpers.arrayElement([
          'Pneumonia',
          'Sepsis',
          'Acute Renal Failure',
        ]),
        underlying: faker.helpers.arrayElement([
          'Hypertension',
          'Diabetes Mellitus',
          'Cancer',
        ]),
        otherSignificant: faker.helpers.maybe(() =>
          faker.helpers.arrayElement([
            'Chronic Kidney Disease',
            'Coronary Artery Disease',
            'COPD',
          ])
        ),
      },

      deathInterval: {
        immediate: 'Hours',
        antecedent: 'Days',
        underlying: 'Years',
      },

      pregnancy: faker.datatype.boolean(),
      attendedByPhysician: faker.datatype.boolean(),
      mannerOfDeath: faker.helpers.arrayElement(['Natural', 'Accident']),
      autopsyPerformed: faker.datatype.boolean(),

      certifier: {
        name: faker.person.fullName(),
        title: 'MD',
        address: faker.location.streetAddress(),
        signature: faker.person.fullName(),
        date: deathDate,
      },

      disposalDetails: {
        method: faker.helpers.arrayElement(['Burial', 'Cremation']),
        place: faker.location.streetAddress(),
        date: randomDate(
          deathDate,
          new Date(deathDate.getTime() + 7 * 24 * 60 * 60 * 1000)
        ),
      },

      informant: {
        name: faker.person.fullName(),
        signature: faker.person.fullName(),
        relationship: faker.helpers.arrayElement([
          'Spouse',
          'Child',
          'Sibling',
        ]),
        address: faker.location.streetAddress(),
        date: deathDate,
      },

      preparer: {
        name: faker.person.fullName(),
        signature: faker.person.fullName(),
        title: 'Civil Registry Staff',
        date: deathDate,
      },

      burialPermit: {
        number: faker.string.numeric(8),
        date: randomDate(
          deathDate,
          new Date(deathDate.getTime() + 7 * 24 * 60 * 60 * 1000)
        ),
        cemetery: faker.location.streetAddress(),
      },
    },
  }
}

// ======================================================================
// Certified Copy Data Generation
// ======================================================================

/**
 * Generate certified copy data
 * @param formIds - Array of form IDs
 * @param documentIds - Array of document IDs
 * @returns Certified copy object
 */
const generateCertifiedCopy = (formIds: string[], documentIds: string[]) => {
  const createdAt = randomDate(new Date(2021, 0, 1), new Date())
  const registeredDate = faker.helpers.maybe(() =>
    randomDate(createdAt, new Date())
  )

  return {
    formId: faker.helpers.arrayElement(formIds), // Ensure this is a valid formId
    lcrNo: faker.helpers.maybe(() => faker.string.numeric(8)),
    bookNo: faker.helpers.maybe(() => faker.string.numeric(3)),
    pageNo: faker.helpers.maybe(() => faker.string.numeric(3)),
    searchedBy: faker.person.fullName(),
    contactNo: faker.phone.number(),
    date: randomDate(new Date(2023, 0, 1), new Date()),
    address: faker.location.streetAddress(),
    amountPaid: faker.number.float({ min: 100, max: 500, fractionDigits: 2 }),
    createdAt,
    datePaid: faker.helpers.maybe(() => randomDate(createdAt, new Date())),
    isRegistered: faker.datatype.boolean(),
    orNumber: faker.helpers.maybe(() => faker.string.numeric(7)),
    purpose: faker.helpers.arrayElement([
      'School Requirement',
      'Employment',
      'Passport Application',
      'Marriage License',
      'Legal Purposes',
      'Travel',
      'Insurance',
    ]),
    registeredDate,
    relationshipToOwner: faker.helpers.arrayElement([
      'Self',
      'Parent',
      'Child',
      'Spouse',
      'Sibling',
      'Legal Representative',
    ]),
    remarks: faker.helpers.maybe(() => faker.lorem.sentence()),
    requesterName: faker.person.fullName(),
    signature: faker.helpers.maybe(() => faker.person.fullName()),
    updatedAt: new Date(),
    attachmentId: faker.helpers.arrayElement(documentIds),
  }
}

/**
 * Seed certified copy data into the database
 * @param prisma - Prisma client instance
 */
export const seedCertifiedCopyData = async (prisma: PrismaClient) => {
  console.log('Seeding Certified Copy data...')

  // Create CivilRegistryFormBase entries with linked specific forms
  const civilRegistryForms = await Promise.all(
    Array(20)
      .fill(null)
      .map(async () => {
        const formType = faker.helpers.arrayElement([
          'FORM_1A',
          'FORM_2A',
          'FORM_3A',
        ])
        const baseFormData = {
          formType,
          pageNumber: faker.string.numeric(3),
          bookNumber: faker.string.numeric(3),
          registryNumber: faker.string.numeric(8),
          dateOfRegistration: randomDate(new Date(2020, 0, 1), new Date()),
          issuedTo: faker.person.fullName(),
          purpose: faker.helpers.arrayElement([
            'School Requirement',
            'Employment',
            'Legal Purposes',
          ]),
          remarks: faker.helpers.maybe(() => faker.lorem.sentence()),
          civilRegistrar: faker.person.fullName(),
          civilRegistrarPosition: 'Registrar',
          preparedByName: faker.person.fullName(),
          preparedByPosition: 'Civil Registry Officer',
          verifiedByName: faker.person.fullName(),
          verifiedByPosition: 'Civil Registrar',
          amountPaid: faker.number.float({
            min: 100,
            max: 500,
            fractionDigits: 2,
          }),
          orNumber: faker.string.numeric(7),
          datePaid: faker.date.recent(),
        }

        // Create the base form
        const baseForm = await prisma.civilRegistryFormBase.create({
          data: baseFormData,
        })

        // Create the specific form based on the formType
        if (formType === 'FORM_1A') {
          await prisma.civilRegistryForm1A.create({
            data: {
              baseFormId: baseForm.id,
              nameOfChild: faker.person.fullName(),
              sex: faker.helpers.arrayElement(['Male', 'Female']),
              dateOfBirth: randomDate(new Date(2020, 0, 1), new Date()),
              placeOfBirth: faker.location.city(),
              nameOfMother: faker.person.fullName(),
              citizenshipMother: 'Filipino',
              nameOfFather: faker.person.fullName(),
              citizenshipFather: 'Filipino',
              dateMarriageParents: faker.date.past(),
              placeMarriageParents: faker.location.city(),
            },
          })
        } else if (formType === 'FORM_2A') {
          await prisma.civilRegistryForm2A.create({
            data: {
              baseFormId: baseForm.id,
              nameOfDeceased: faker.person.fullName(),
              sex: faker.helpers.arrayElement(['Male', 'Female']),
              age: faker.number.int({ min: 1, max: 100 }),
              civilStatus: faker.helpers.arrayElement([
                'Single',
                'Married',
                'Widowed',
                'Divorced',
              ]),
              citizenship: 'Filipino',
              dateOfDeath: randomDate(new Date(2020, 0, 1), new Date()),
              placeOfDeath: faker.location.city(),
              causeOfDeath: faker.helpers.arrayElement([
                'Cardiac Arrest',
                'Respiratory Failure',
                'Multiple Organ Failure',
              ]),
            },
          })
        } else if (formType === 'FORM_3A') {
          await prisma.civilRegistryForm3A.create({
            data: {
              baseFormId: baseForm.id,
              husbandName: faker.person.fullName(),
              husbandDateOfBirthAge: `${randomDate(
                new Date(1970, 0, 1),
                new Date(2000, 0, 1)
              ).toISOString()} (${faker.number.int({ min: 20, max: 50 })})`,
              husbandCitizenship: 'Filipino',
              husbandCivilStatus: faker.helpers.arrayElement([
                'Single',
                'Married',
                'Widowed',
                'Divorced',
              ]),
              husbandMother: faker.person.fullName(),
              husbandFather: faker.person.fullName(),
              wifeName: faker.person.fullName(),
              wifeDateOfBirthAge: `${randomDate(
                new Date(1970, 0, 1),
                new Date(2000, 0, 1)
              ).toISOString()} (${faker.number.int({ min: 20, max: 50 })})`,
              wifeCitizenship: 'Filipino',
              wifeCivilStatus: faker.helpers.arrayElement([
                'Single',
                'Married',
                'Widowed',
                'Divorced',
              ]),
              wifeMother: faker.person.fullName(),
              wifeFather: faker.person.fullName(),
              dateOfMarriage: randomDate(new Date(2020, 0, 1), new Date()),
              placeOfMarriage: faker.location.city(),
            },
          })
        }

        return baseForm
      })
  )
  const formIds = civilRegistryForms.map((form) => form.id)

  // Create Document entries
  const documents = await Promise.all(
    Array(20)
      .fill(null)
      .map(() =>
        prisma.document.create({
          data: {
            type: faker.helpers.arrayElement([
              'BIRTH_CERTIFICATE',
              'DEATH_CERTIFICATE',
              'MARRIAGE_CERTIFICATE',
            ]),
            title: faker.lorem.sentence(),
            description: faker.lorem.paragraph(),
            metadata: {},
            version: 1,
            isLatest: true,
            createdAt: randomDate(new Date(2021, 0, 1), new Date()),
          },
        })
      )
  )
  const documentIds = documents.map((doc) => doc.id)

  // Generate Certified Copy Requests
  const certifiedCopyData = Array(50)
    .fill(null)
    .map(() => generateCertifiedCopy(formIds, documentIds))

  await prisma.certifiedCopy.createMany({ data: certifiedCopyData })

  console.log('Certified Copy data seeded successfully!')
}

// ======================================================================
// Bulk Data Generation
// ======================================================================

/**
 * Generate bulk data for marriage, birth, and death certificates
 * @param prisma - Prisma client instance
 * @param userIds - Array of user IDs
 * @param count - Number of records to generate (default: 1000)
 */
export const generateBulkData = async (
  prisma: PrismaClient,
  userIds: string[],
  count = 1000
): Promise<void> => {
  if (userIds.length === 0) {
    throw new Error('No user IDs available for preparedById')
  }

  console.log('Generating bulk data...')

  // Generate a completely random sequence of record types
  const recordTypes = Array(count)
    .fill(null)
    .map(() => faker.helpers.arrayElement(['marriage', 'birth', 'death']))

  for (let i = 0; i < recordTypes.length; i++) {
    const recordType = recordTypes[i]
    const createdAt = randomDate(new Date(2021, 0, 1), new Date())

    if (recordType === 'marriage') {
      await prisma.baseRegistryForm.create({
        data: {
          ...generateBaseRegistryForm(FormType.MARRIAGE, userIds),
          createdAt,
          marriageCertificateForm: {
            create:
              generateMarriageCertificate(userIds).marriageCertificateForm,
          },
        },
      })
    } else if (recordType === 'birth') {
      await prisma.baseRegistryForm.create({
        data: {
          ...generateBaseRegistryForm(FormType.BIRTH, userIds),
          createdAt,
          birthCertificateForm: {
            create: generateBirthCertificate(userIds).birthCertificateForm,
          },
        },
      })
    } else if (recordType === 'death') {
      await prisma.baseRegistryForm.create({
        data: {
          ...generateBaseRegistryForm(FormType.DEATH, userIds),
          createdAt,
          deathCertificateForm: {
            create: generateDeathCertificate(userIds).deathCertificateForm,
          },
        },
      })
    }

    if (i % 100 === 0) console.log(`Generated ${i} records...`)
  }

  console.log('Bulk data generation completed!')
}

// ======================================================================
// Additional Test Data Generation
// ======================================================================

/**
 * Generate additional test data for other models
 * @param prisma - Prisma client instance
 */
export const generateAdditionalData = async (prisma: PrismaClient) => {
  console.log('Generating additional test data...')

  // Generate Documents First
  console.log('Generating documents...')
  const documents = await Promise.all(
    Array(10)
      .fill(null)
      .map(() =>
        prisma.document.create({
          data: {
            type: faker.helpers.arrayElement([
              'BIRTH_CERTIFICATE',
              'DEATH_CERTIFICATE',
              'MARRIAGE_CERTIFICATE',
            ]),
            title: faker.lorem.sentence(),
            description: faker.lorem.paragraph(),
            metadata: {},
            version: 1,
            isLatest: true,
            createdAt: randomDate(new Date(2021, 0, 1), new Date()),
          },
        })
      )
  )
  const documentIds = documents.map((doc) => doc.id)

  // Fetch existing CivilRegistryFormBase IDs
  const civilRegistryForms = await prisma.civilRegistryFormBase.findMany({
    select: { id: true },
  })
  const formIds = civilRegistryForms.map((form) => form.id)

  // Check if formIds or documentIds are empty
  if (formIds.length === 0 || documentIds.length === 0) {
    console.error(
      'Cannot generate CertifiedCopy records: formIds or documentIds is empty.'
    )
    return
  }

  // Generate CertifiedCopy
  const certifiedCopyCount = 50
  console.log(`Generating ${certifiedCopyCount} certified copy requests...`)

  const certifiedCopyData = Array(certifiedCopyCount)
    .fill(null)
    .map(() => ({
      ...generateCertifiedCopy(formIds, documentIds),
      attachmentId: faker.helpers.arrayElement(documentIds),
    }))

  await prisma.certifiedCopy.createMany({ data: certifiedCopyData })

  console.log('Additional test data generation completed!')
}

// ======================================================================
// Final Combined Export
// ======================================================================

/**
 * Generate all test data (bulk data, additional data, feedback, and notifications)
 * @param prisma - Prisma client instance
 * @param userIds - Array of user IDs
 */
export const generateTestData = async (
  prisma: PrismaClient,
  userIds: string[]
) => {
  await generateBulkData(prisma, userIds)
  await generateAdditionalData(prisma)
  await seedFeedbackData(prisma, userIds)
  await seedNotificationData(prisma, userIds)
}

// commands:
// pnpm prisma db push
// npx prisma db push --force-reset
// pnpm prisma:seed
// pnpm prisma studio
