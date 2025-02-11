// src/components/custom/civil-registry/components/birth-details-card.tsx
import { useTranslation } from 'react-i18next'
import { Card, CardContent } from '@/components/ui/card'
import { renderName, formatDate, formatLocation } from './utils'
import { BaseRegistryFormWithRelations } from '@/hooks/civil-registry-action'

interface BirthDetailsCardProps {
    form: BaseRegistryFormWithRelations
}

/** Certificate Participant Interfaces & Type Guards **/

// Attendant: uses a title.
interface Attendant {
    name: string
    title: string
    date: string | Date
}
function isAttendant(value: unknown): value is Attendant {
    return (
        typeof value === 'object' &&
        value !== null &&
        'name' in value &&
        typeof (value as Record<string, unknown>).name === 'string' &&
        'title' in value &&
        typeof (value as Record<string, unknown>).title === 'string' &&
        'date' in value &&
        (typeof (value as Record<string, unknown>).date === 'string' ||
            (value as Record<string, unknown>).date instanceof Date)
    )
}

// Informant: uses a relationship.
interface Informant {
    name: string
    relationship: string
    date: string | Date
}
function isInformant(value: unknown): value is Informant {
    return (
        typeof value === 'object' &&
        value !== null &&
        'name' in value &&
        typeof (value as Record<string, unknown>).name === 'string' &&
        'relationship' in value &&
        typeof (value as Record<string, unknown>).relationship === 'string' &&
        'date' in value &&
        (typeof (value as Record<string, unknown>).date === 'string' ||
            (value as Record<string, unknown>).date instanceof Date)
    )
}

// Preparer: uses a title.
interface Preparer {
    name: string
    title: string
    date: string | Date
}
function isPreparer(value: unknown): value is Preparer {
    return (
        typeof value === 'object' &&
        value !== null &&
        'name' in value &&
        typeof (value as Record<string, unknown>).name === 'string' &&
        'title' in value &&
        typeof (value as Record<string, unknown>).title === 'string' &&
        'date' in value &&
        (typeof (value as Record<string, unknown>).date === 'string' ||
            (value as Record<string, unknown>).date instanceof Date)
    )
}

/** Parental Marriage Interface & Type Guard **/
interface ParentMarriage {
    date: string | Date
    place: unknown // Adjust type if you have a more specific location interface
}
function isParentMarriage(value: unknown): value is ParentMarriage {
    return (
        typeof value === 'object' &&
        value !== null &&
        'date' in value &&
        (typeof (value as Record<string, unknown>).date === 'string' ||
            (value as Record<string, unknown>).date instanceof Date) &&
        'place' in value
    )
}

export const BirthDetailsCard: React.FC<BirthDetailsCardProps> = ({ form }) => {
    const { t } = useTranslation()
    const b = form.birthCertificateForm!

    // Narrow certificate participants:
    const attendant = b.attendant && isAttendant(b.attendant) ? b.attendant : undefined
    const informant = b.informant && isInformant(b.informant) ? b.informant : undefined
    const preparer = b.preparer && isPreparer(b.preparer) ? b.preparer : undefined

    // Narrow parental marriage:
    const parentMarriage = b.parentMarriage && isParentMarriage(b.parentMarriage)
        ? b.parentMarriage
        : undefined

    return (
        <Card className="border rounded-lg shadow-sm">
            <CardContent className="overflow-auto max-h-[70vh] p-6 space-y-6">
                {/* Child Details */}
                <section className="p-4 rounded">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">{t('Child Details')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium">{t('Child Name')}</p>
                            <div>{renderName(b.childName)}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Date of Birth')}</p>
                            <div>{formatDate(b.dateOfBirth)}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Sex')}</p>
                            <div>{b.sex}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Type of Birth')}</p>
                            <div>{b.typeOfBirth}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Birth Order')}</p>
                            <div>{b.birthOrder}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Weight at Birth')}</p>
                            <div>{b.weightAtBirth} g</div>
                        </div>
                    </div>
                </section>

                {/* Mother Details */}
                <section className="p-4 rounded">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">{t('Mother Details')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium">{t('Maiden Name')}</p>
                            <div>{renderName(b.motherMaidenName)}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Citizenship')}</p>
                            <div>{b.motherCitizenship}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Religion')}</p>
                            <div>{b.motherReligion}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Occupation')}</p>
                            <div>{b.motherOccupation}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Age')}</p>
                            <div>{b.motherAge}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Residence')}</p>
                            <div>{formatLocation(b.motherResidence)}</div>
                        </div>
                    </div>
                </section>

                {/* Father Details */}
                <section className="p-4 rounded">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">{t('Father Details')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium">{t('Father Name')}</p>
                            <div>{renderName(b.fatherName)}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Citizenship')}</p>
                            <div>{b.fatherCitizenship}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Religion')}</p>
                            <div>{b.fatherReligion}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Occupation')}</p>
                            <div>{b.fatherOccupation}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Age')}</p>
                            <div>{b.fatherAge}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Residence')}</p>
                            <div>{formatLocation(b.fatherResidence)}</div>
                        </div>
                    </div>
                </section>

                {/* Parental Marriage */}
                <section className="p-4 rounded">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">{t('Parental Marriage')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium">{t('Marriage Date')}</p>
                            <div>{parentMarriage ? formatDate(parentMarriage.date) : ''}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Marriage Place')}</p>
                            <div>{parentMarriage ? formatLocation(parentMarriage.place) : ''}</div>
                        </div>
                    </div>
                </section>

                {/* Certificate Participants */}
                <section className="p-4 rounded">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">{t('Certificate Participants')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <p className="font-medium">{t('Attendant')}</p>
                            <div>
                                {attendant ? (
                                    <>
                                        {renderName(attendant.name)} ({attendant.title})
                                        <br />
                                        {formatDate(attendant.date)}
                                    </>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Informant')}</p>
                            <div>
                                {informant ? (
                                    <>
                                        {renderName(informant.name)} ({informant.relationship})
                                        <br />
                                        {formatDate(informant.date)}
                                    </>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Preparer')}</p>
                            <div>
                                {preparer ? (
                                    <>
                                        {renderName(preparer.name)} ({preparer.title})
                                        <br />
                                        {formatDate(preparer.date)}
                                    </>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    </div>
                </section>
            </CardContent>
        </Card>
    )
}
