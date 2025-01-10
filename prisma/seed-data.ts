// prisma\seed-data.ts
import { fakerEN as faker } from '@faker-js/faker';
import {
  AttendantType,
  DocumentStatus,
  FormType,
  PrismaClient,
} from '@prisma/client';

// Helper function to generate random date between two dates
const randomDate = (start: Date, end: Date) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

// Helper to generate time string in "HH:mm AM/PM" format
const generateTimeString = () => {
  const hours = faker.number.int({ min: 1, max: 12 });
  const minutes = faker.number.int({ min: 0, max: 59 });
  const ampm = faker.helpers.arrayElement(['AM', 'PM']);
  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')} ${ampm}`;
};

// Helper to generate Philippine locations
const generatePhLocation = () => ({
  cityMunicipality: faker.location.city(),
  province: faker.helpers.arrayElement([
    'Metro Manila',
    'Cebu',
    'Davao',
    'Rizal',
    'Cavite',
    'Laguna',
    'Pampanga',
    'Bulacan',
    'Batangas',
    'Iloilo',
  ]),
});

// Generate person name in JSON format
const generatePersonName = () => ({
  first: faker.person.firstName(),
  middle: faker.person.lastName(),
  last: faker.person.lastName(),
});

// Generate a base registry form
const generateBaseRegistryForm = (formType: FormType) => {
  const registrationDate = randomDate(new Date(2023, 0, 1), new Date());

  return {
    formNumber:
      formType === FormType.MARRIAGE
        ? '97'
        : formType === FormType.BIRTH
        ? '102'
        : '103',
    formType,
    registryNumber: faker.string.numeric(8),
    province: faker.helpers.arrayElement([
      'Metro Manila',
      'Cebu',
      'Davao',
      'Rizal',
      'Cavite',
    ]),
    cityMunicipality: faker.location.city(),
    pageNumber: faker.string.numeric(3),
    bookNumber: faker.string.numeric(3),
    receivedBy: faker.person.fullName(),
    receivedByPosition: 'Civil Registry Officer',
    receivedDate: registrationDate,
    registeredBy: faker.person.fullName(),
    registeredByPosition: 'Civil Registrar',
    registrationDate,
    dateOfRegistration: registrationDate,
    remarks: faker.helpers.maybe(() => faker.lorem.sentence()),
    lcroNotations: faker.helpers.maybe(() => faker.string.alpha(10)),
    status: faker.helpers.arrayElement(Object.values(DocumentStatus)),
  };
};

// Generate marriage certificate data
export const generateMarriageCertificate = () => {
  const marriageDate = randomDate(new Date(2020, 0, 1), new Date());
  const husbandBirthDate = randomDate(
    new Date(1970, 0, 1),
    new Date(2000, 0, 1)
  );
  const wifeBirthDate = randomDate(new Date(1970, 0, 1), new Date(2000, 0, 1));

  return {
    baseForm: generateBaseRegistryForm(FormType.MARRIAGE),
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
      husbandResidence: faker.location.streetAddress(),
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
      wifeResidence: faker.location.streetAddress(),
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
  };
};

// Generate birth certificate data
export const generateBirthCertificate = () => {
  const birthDate = randomDate(new Date(2020, 0, 1), new Date());
  const motherAge = faker.number.int({ min: 18, max: 45 });
  const fatherAge = faker.number.int({ min: 20, max: 50 });

  return {
    baseForm: generateBaseRegistryForm(FormType.BIRTH),
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
        houseNo: faker.location.streetAddress(),
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
      motherResidence: {
        houseNo: faker.location.streetAddress(),
        ...generatePhLocation(),
        country: 'Philippines',
      },

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
      fatherResidence: {
        houseNo: faker.location.streetAddress(),
        ...generatePhLocation(),
        country: 'Philippines',
      },

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
  };
};

// Generate death certificate data
export const generateDeathCertificate = () => {
  const deathDate = randomDate(new Date(2020, 0, 1), new Date());
  const birthDate = randomDate(new Date(1940, 0, 1), new Date(2000, 0, 1));

  return {
    baseForm: generateBaseRegistryForm(FormType.DEATH),
    deathCertificateForm: {
      deceasedName: generatePersonName(),
      sex: faker.helpers.arrayElement(['Male', 'Female']),
      dateOfDeath: deathDate,
      placeOfDeath: {
        houseNo: faker.location.streetAddress(),
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
      residence: {
        houseNo: faker.location.streetAddress(),
        ...generatePhLocation(),
      },
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
  };
};

export const generateBulkData = async (
  prisma: PrismaClient,
  count = 1000
): Promise<void> => {
  const records = {
    marriages: Math.floor(count * 0.4), // 40% marriages
    births: Math.floor(count * 0.4) + 1500, // 40% births + 1500
    deaths: Math.floor(count * 0.2) + 1500, // 20% deaths + 1500
  };

  console.log('Generating bulk data...');

  // Generate Marriage Certificates
  console.log(`Generating ${records.marriages} marriage certificates...`);
  for (let i = 0; i < records.marriages; i++) {
    const marriageDate = randomDate(new Date(2020, 0, 1), new Date());
    const husbandBirthDate = randomDate(
      new Date(1970, 0, 1),
      new Date(2000, 0, 1)
    );
    const wifeBirthDate = randomDate(
      new Date(1970, 0, 1),
      new Date(2000, 0, 1)
    );

    await prisma.baseRegistryForm.create({
      data: {
        ...generateBaseRegistryForm(FormType.MARRIAGE),
        marriageCertificateForm: {
          create: {
            husbandFirstName: faker.person.firstName('male'),
            husbandMiddleName: faker.person.lastName(),
            husbandLastName: faker.person.lastName(),
            husbandDateOfBirth: husbandBirthDate,
            husbandAge: Math.floor(
              (marriageDate.getTime() - husbandBirthDate.getTime()) /
                31557600000
            ),
            husbandPlaceOfBirth: generatePhLocation(),
            husbandSex: 'Male',
            husbandCitizenship: 'Filipino',
            husbandResidence: faker.location.streetAddress(),
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
            wifeResidence: faker.location.streetAddress(),
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
        },
      },
    });

    if (i % 100 === 0) console.log(`Generated ${i} marriage certificates...`);
  }

  // Generate Birth Certificates
  console.log(`Generating ${records.births} birth certificates...`);
  for (let i = 0; i < records.births; i++) {
    const birthDate = randomDate(new Date(2020, 0, 1), new Date());
    const motherAge = faker.number.int({ min: 18, max: 45 });
    const fatherAge = faker.number.int({ min: 20, max: 50 });

    await prisma.baseRegistryForm.create({
      data: {
        ...generateBaseRegistryForm(FormType.BIRTH),
        birthCertificateForm: {
          create: {
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
              houseNo: faker.location.streetAddress(),
              ...generatePhLocation(),
            },
            typeOfBirth: faker.helpers.arrayElement([
              'Single',
              'Twin',
              'Triplet',
            ]),
            birthOrder: faker.number.int({ min: 1, max: 5 }).toString(),
            weightAtBirth:
              faker.number.float({ min: 2.5, max: 4.5, fractionDigits: 2 }) *
              1000,

            motherMaidenName: generatePersonName(),
            motherCitizenship: 'Filipino',
            motherReligion: faker.helpers.arrayElement([
              'Catholic',
              'Protestant',
              'Islam',
            ]),
            motherOccupation: faker.person.jobTitle(),
            motherAge,
            motherResidence: {
              houseNo: faker.location.streetAddress(),
              ...generatePhLocation(),
              country: 'Philippines',
            },

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
            fatherResidence: {
              houseNo: faker.location.streetAddress(),
              ...generatePhLocation(),
              country: 'Philippines',
            },

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
        },
      },
    });

    if (i % 100 === 0) console.log(`Generated ${i} birth certificates...`);
  }

  // Generate Death Certificates
  console.log(`Generating ${records.deaths} death certificates...`);
  for (let i = 0; i < records.deaths; i++) {
    const deathDate = randomDate(new Date(2020, 0, 1), new Date());
    const birthDate = randomDate(new Date(1940, 0, 1), new Date(2000, 0, 1));

    await prisma.baseRegistryForm.create({
      data: {
        ...generateBaseRegistryForm(FormType.DEATH),
        deathCertificateForm: {
          create: {
            certificationType: faker.helpers.arrayElement(['ORIGINAL', 'COPY']), // Add this line
            deceasedName: generatePersonName(),
            sex: faker.helpers.arrayElement(['Male', 'Female']),
            dateOfDeath: deathDate,
            placeOfDeath: {
              houseNo: faker.location.streetAddress(),
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
            religion: faker.helpers.arrayElement([
              'Catholic',
              'Protestant',
              'Islam',
            ]),
            citizenship: 'Filipino',
            residence: {
              houseNo: faker.location.streetAddress(),
              ...generatePhLocation(),
            },
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
        },
      },
    });

    if (i % 100 === 0) console.log(`Generated ${i} death certificates...`);
  }

  console.log('Bulk data generation completed!');
  console.log(`Generated ${records.marriages} marriage certificates`);
};
// Generate additional test data for other models
export const generateAdditionalData = async (
  prisma: PrismaClient,
  userIds: string[]
) => {
  console.log('Generating additional test data...');

  // Generate Documents First
  console.log('Generating documents...');
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
          },
        })
      )
  );
  const documentIds = documents.map((doc) => doc.id);

  // Generate Queues
  const queueCount = 50;
  console.log(`Generating ${queueCount} queue entries...`);
  const queueData = Array(queueCount)
    .fill(null)
    .map(() => ({
      kioskNumber: faker.number.int({ min: 1, max: 5 }),
      status: faker.helpers.arrayElement([
        'WAITING',
        'PROCESSING',
        'COMPLETED',
        'CANCELLED',
      ]),
      serviceType: faker.helpers.arrayElement([
        'TRUE_COPY',
        'VERIFY',
        'CERTIFICATION',
        'AUTHENTICATION',
      ]),
      userId: faker.helpers.arrayElement(userIds),
      email: faker.internet.email(),
      documents: [faker.system.fileName(), faker.system.fileName()],
      processingNotes: faker.helpers.maybe(() => faker.lorem.sentence()),
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
      completedAt: faker.helpers.maybe(() => faker.date.recent()),
    }));
  await prisma.queue.createMany({ data: queueData });

  // Generate Notifications
  const notificationCount = 100;
  console.log(`Generating ${notificationCount} notifications...`);
  const notificationData = Array(notificationCount)
    .fill(null)
    .map(() => ({
      userId: faker.helpers.arrayElement(userIds),
      type: faker.helpers.arrayElement(['EMAIL', 'SYSTEM', 'SMS']),
      title: faker.lorem.sentence(),
      message: faker.lorem.paragraph(),
      read: faker.datatype.boolean(),
      createdAt: faker.date.recent(),
      readAt: faker.helpers.maybe(() => faker.date.recent()),
    }));
  await prisma.notification.createMany({ data: notificationData });

  // Generate Feedback
  const feedbackCount = 20;
  console.log(`Generating ${feedbackCount} feedback entries...`);
  const feedbackData = Array(feedbackCount)
    .fill(null)
    .map(() => ({
      feedback: faker.lorem.paragraph(),
      submittedBy: faker.helpers.arrayElement([...userIds, null]),
      createdAt: faker.date.recent(),
      updatedAt: faker.date.recent(),
    }));
  await prisma.feedback.createMany({ data: feedbackData });

  // Generate Workflows
  const workflowCount = 5;
  console.log(`Generating ${workflowCount} workflows...`);
  for (let i = 0; i < workflowCount; i++) {
    await prisma.workflow.create({
      data: {
        name: faker.helpers.arrayElement([
          'Marriage Certificate Processing',
          'Birth Certificate Processing',
          'Death Certificate Processing',
          'Document Authentication',
          'Certificate Verification',
        ]),
        description: faker.lorem.sentence(),
        isActive: faker.datatype.boolean(),
        createdBy: faker.helpers.arrayElement(userIds),
        steps: {
          create: Array(4)
            .fill(null)
            .map((_, index) => ({
              name: faker.helpers.arrayElement([
                'Document Review',
                'Data Verification',
                'Quality Check',
                'Final Approval',
              ]),
              order: index + 1,
              isRequired: faker.datatype.boolean(),
              deadline: faker.date.future(),
              status: faker.helpers.arrayElement([
                'PENDING',
                'IN_PROGRESS',
                'COMPLETED',
              ]),
              documentId: faker.helpers.arrayElement(documentIds), // Using actual document IDs
            })),
        },
      },
    });
  }

  console.log('Additional test data generation completed!');
};

// Final combined export for easy importing
export const generateTestData = async (
  prisma: PrismaClient,
  userIds: string[]
) => {
  await generateBulkData(prisma);
  await generateAdditionalData(prisma, userIds);
};
