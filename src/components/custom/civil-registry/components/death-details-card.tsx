// src/components/custom/civil-registry/components/death-details-card.tsx
import React from 'react'
import { useTranslation } from 'react-i18next'
import { renderName, formatDate, formatLocation } from './utils'
import { BaseRegistryFormWithRelations } from '@/hooks/civil-registry-action'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface DeathDetailsCardProps {
    form: BaseRegistryFormWithRelations
}

/** 
 * Interfaces and type guards for nested objects within deathCertificateForm 
 */

/** Causes of Death **/
interface CausesOfDeath {
    immediate: string
    antecedent: string
    underlying: string
    otherSignificant?: string
}

function isCausesOfDeath(value: unknown): value is CausesOfDeath {
    return (
        typeof value === 'object' &&
        value !== null &&
        'immediate' in value &&
        typeof (value as Record<string, unknown>).immediate === 'string' &&
        'antecedent' in value &&
        typeof (value as Record<string, unknown>).antecedent === 'string' &&
        'underlying' in value &&
        typeof (value as Record<string, unknown>).underlying === 'string'
        // otherSignificant is optional
    )
}

/** Certifier **/
interface Certifier {
    name: string
    title: string
    date: string | Date
}

function isCertifier(value: unknown): value is Certifier {
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

/** Disposal Details **/
interface DisposalDetails {
    method: string
    place: string
    date: string | Date
}

function isDisposalDetails(value: unknown): value is DisposalDetails {
    return (
        typeof value === 'object' &&
        value !== null &&
        'method' in value &&
        typeof (value as Record<string, unknown>).method === 'string' &&
        'place' in value &&
        typeof (value as Record<string, unknown>).place === 'string' &&
        'date' in value &&
        (typeof (value as Record<string, unknown>).date === 'string' ||
            (value as Record<string, unknown>).date instanceof Date)
    )
}

/** Informant **/
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

/** Preparer **/
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

/** Burial Permit **/
interface BurialPermit {
    number: string
    date: string | Date
    cemetery: string
}

export function isBurialPermit(value: unknown): value is BurialPermit {
    return (
        typeof value === 'object' &&
        value !== null &&
        'number' in value &&
        typeof (value as Record<string, unknown>).number === 'string' &&
        'date' in value &&
        (typeof (value as Record<string, unknown>).date === 'string' ||
            (value as Record<string, unknown>).date instanceof Date) &&
        'cemetery' in value &&
        typeof (value as Record<string, unknown>).cemetery === 'string'
    )
}

export const DeathDetailsCard: React.FC<DeathDetailsCardProps> = ({ form }) => {
    const { t } = useTranslation()
    const d = form.deathCertificateForm!

    // Narrow nested objects using our type guards:
    const causesOfDeath = d.causesOfDeath && isCausesOfDeath(d.causesOfDeath)
        ? d.causesOfDeath
        : undefined

    const certifier = d.certifier && isCertifier(d.certifier)
        ? d.certifier
        : undefined

    const disposalDetails = d.disposalDetails && isDisposalDetails(d.disposalDetails)
        ? d.disposalDetails
        : undefined

    const informant = d.informant && isInformant(d.informant)
        ? d.informant
        : undefined

    const preparer = d.preparer && isPreparer(d.preparer)
        ? d.preparer
        : undefined

    const burialPermit = d.burialPermit && isBurialPermit(d.burialPermit)
        ? d.burialPermit
        : undefined

    return (
        <Card className="border rounded-lg shadow-sm">
            <CardContent className="overflow-auto max-h-[70vh] p-6 space-y-6">
                {/* Deceased Details */}
                <section className="p-4 rounded">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">{t('Deceased Details')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium">{t('Name')}</p>
                            <div>{renderName(d.deceasedName)}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Sex')}</p>
                            <div>{d.sex}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Date of Death')}</p>
                            <div>{formatDate(d.dateOfDeath)}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Date of Birth')}</p>
                            <div>{formatDate(d.dateOfBirth)}</div>
                        </div>
                    </div>
                </section>

                {/* Location Details */}
                <section className="p-4 rounded">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">{t('Location Details')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium">{t('Place of Death')}</p>
                            <div>{formatLocation(d.placeOfDeath)}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Place of Birth')}</p>
                            <div>{formatLocation(d.placeOfBirth)}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Residence')}</p>
                            <div>{formatLocation(d.residence)}</div>
                        </div>
                    </div>
                </section>

                {/* Additional Details */}
                <section className="p-4 rounded">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">{t('Additional Details')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <p className="font-medium">{t('Civil Status')}</p>
                            <div>{d.civilStatus}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Religion')}</p>
                            <div>{d.religion}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Citizenship')}</p>
                            <div>{d.citizenship}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Occupation')}</p>
                            <div>{d.occupation}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t("Father's Name")}</p>
                            <div>{renderName(d.nameOfFather)}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t("Mother's Name")}</p>
                            <div>{renderName(d.nameOfMother)}</div>
                        </div>
                    </div>
                </section>

                {/* Cause of Death */}
                <section className="p-4 rounded">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">{t('Cause of Death')}</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <p className="font-medium">{t('Immediate')}</p>
                            <div>{causesOfDeath ? causesOfDeath.immediate : ''}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Antecedent')}</p>
                            <div>{causesOfDeath ? causesOfDeath.antecedent : ''}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Underlying')}</p>
                            <div>{causesOfDeath ? causesOfDeath.underlying : ''}</div>
                        </div>
                        {causesOfDeath && causesOfDeath.otherSignificant && (
                            <div>
                                <p className="font-medium">{t('Other Significant')}</p>
                                <div>{causesOfDeath.otherSignificant}</div>
                            </div>
                        )}
                    </div>
                </section>

                {/* Medical Details */}
                <section className="p-4 rounded">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">{t('Medical Details')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                            <p className="font-medium">{t('Attended by Physician')}</p>
                            <div>{d.attendedByPhysician ? t('Yes') : t('No')}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Autopsy Performed')}</p>
                            <div>{d.autopsyPerformed ? t('Yes') : t('No')}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Manner of Death')}</p>
                            <div>{d.mannerOfDeath}</div>
                        </div>
                    </div>
                </section>

                {/* Certificate & Disposal Details */}
                <section className="p-4 rounded">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">{t('Certificate & Disposal Details')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium">{t('Certifier')}</p>
                            <div>
                                {certifier ? (
                                    <>
                                        {renderName(certifier.name)} ({certifier.title})
                                        <br />
                                        {formatDate(certifier.date)}
                                    </>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Disposal Details')}</p>
                            <div>
                                {disposalDetails ? (
                                    <>
                                        <strong>{t('Method')}:</strong> {disposalDetails.method}
                                        <br />
                                        <strong>{t('Place')}:</strong> {disposalDetails.place}
                                        <br />
                                        <strong>{t('Date')}:</strong> {formatDate(disposalDetails.date)}
                                    </>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Informant & Preparer */}
                <section className="p-4 rounded">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">{t('Informant & Preparer')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                {/* Burial Permit */}
                <section className="p-4 rounded">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">{t('Burial Permit')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium">{t('Permit Number')}</p>
                            <div>{burialPermit ? burialPermit.number : ''}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Date')}</p>
                            <div>{burialPermit ? formatDate(burialPermit.date) : ''}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Cemetery')}</p>
                            <div>{burialPermit ? burialPermit.cemetery : ''}</div>
                        </div>
                    </div>
                </section>
            </CardContent>
        </Card>
    )
}
