// src/components/custom/civil-registry/components/marriage-details-card.tsx
import React from 'react'
import { useTranslation } from 'react-i18next'
import { BaseRegistryFormWithRelations } from '@/hooks/civil-registry-action'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { formatFullName, formatDate, formatLocation, renderName } from './utils'

/**
 * Interface for Contracting Parties Signature.
 */
interface ContractingPartiesSignature {
    husband: string
    wife: string
}

/**
 * Type guard for ContractingPartiesSignature.
 */
function isContractingPartiesSignature(value: unknown): value is ContractingPartiesSignature {
    return (
        typeof value === 'object' &&
        value !== null &&
        'husband' in value &&
        typeof (value as Record<string, unknown>).husband === 'string' &&
        'wife' in value &&
        typeof (value as Record<string, unknown>).wife === 'string'
    )
}

/**
 * Interface for Marriage License Details.
 */
interface MarriageLicenseDetails {
    number: string
    dateIssued: string | Date
    placeIssued: unknown // adjust this type based on your location data
}

/**
 * Type guard for MarriageLicenseDetails.
 */
function isMarriageLicenseDetails(value: unknown): value is MarriageLicenseDetails {
    return (
        typeof value === 'object' &&
        value !== null &&
        'number' in value &&
        typeof (value as Record<string, unknown>).number === 'string' &&
        'dateIssued' in value &&
        (
            typeof (value as Record<string, unknown>).dateIssued === 'string' ||
            (value as Record<string, unknown>).dateIssued instanceof Date
        ) &&
        'placeIssued' in value
    )
}

/**
 * Interface for Solemnizing Officer.
 */
interface SolemnizingOfficer {
    name: string
    position: string
    religion: string
    registryNoExpiryDate: string | Date
}

/**
 * Type guard for SolemnizingOfficer.
 */
function isSolemnizingOfficer(value: unknown): value is SolemnizingOfficer {
    return (
        typeof value === 'object' &&
        value !== null &&
        'name' in value &&
        typeof (value as Record<string, unknown>).name === 'string' &&
        'position' in value &&
        typeof (value as Record<string, unknown>).position === 'string' &&
        'religion' in value &&
        typeof (value as Record<string, unknown>).religion === 'string' &&
        'registryNoExpiryDate' in value &&
        (
            typeof (value as Record<string, unknown>).registryNoExpiryDate === 'string' ||
            (value as Record<string, unknown>).registryNoExpiryDate instanceof Date
        )
    )
}

interface MarriageDetailsCardProps {
    form: BaseRegistryFormWithRelations
}

export const MarriageDetailsCard: React.FC<MarriageDetailsCardProps> = ({ form }) => {
    const { t } = useTranslation()
    const m = form.marriageCertificateForm!

    // Narrow the type of each property using our type guards.
    const contractingPartiesSignature = isContractingPartiesSignature(m.contractingPartiesSignature)
        ? m.contractingPartiesSignature
        : undefined

    const marriageLicenseDetails = isMarriageLicenseDetails(m.marriageLicenseDetails)
        ? m.marriageLicenseDetails
        : undefined

    const solemnizingOfficer = isSolemnizingOfficer(m.solemnizingOfficer)
        ? m.solemnizingOfficer
        : undefined

    return (
        <Card className="border rounded-lg shadow-sm">
            {/* Wrap the content in an overflow-auto container with a max-height */}
            <CardContent className="overflow-auto max-h-[70vh] p-6 space-y-6">
                {/* Husband Details */}
                <section className="p-4 rounded">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">{t('Husband Details')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium">{t('Name')}</p>
                            <div>
                                {formatFullName(
                                    m.husbandFirstName ?? undefined,
                                    m.husbandMiddleName ?? undefined,
                                    m.husbandLastName ?? undefined
                                )}
                            </div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Date of Birth')}</p>
                            <div>{formatDate(m.husbandDateOfBirth ?? undefined)}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Age')}</p>
                            <div>{m.husbandAge}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Place of Birth')}</p>
                            <div>{formatLocation(m.husbandPlaceOfBirth)}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Residence')}</p>
                            <div>{formatLocation(m.husbandResidence)}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Religion')}</p>
                            <div>{m.husbandReligion}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Civil Status')}</p>
                            <div>{m.husbandCivilStatus}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t("Father's Name")}</p>
                            <div>{renderName(m.husbandFatherName)}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t("Mother's Maiden Name")}</p>
                            <div>{renderName(m.husbandMotherMaidenName)}</div>
                        </div>
                    </div>
                </section>

                {/* Wife Details */}
                <section className="p-4 rounded">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">{t('Wife Details')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium">{t('Name')}</p>
                            <div>
                                {formatFullName(
                                    m.wifeFirstName ?? undefined,
                                    m.wifeMiddleName ?? undefined,
                                    m.wifeLastName ?? undefined
                                )}
                            </div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Date of Birth')}</p>
                            <div>{formatDate(m.wifeDateOfBirth ?? undefined)}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Age')}</p>
                            <div>{m.wifeAge}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Place of Birth')}</p>
                            <div>{formatLocation(m.wifePlaceOfBirth)}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Residence')}</p>
                            <div>{formatLocation(m.wifeResidence)}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Religion')}</p>
                            <div>{m.wifeReligion}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Civil Status')}</p>
                            <div>{m.wifeCivilStatus}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t("Father's Name")}</p>
                            <div>{renderName(m.wifeFatherName)}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t("Mother's Maiden Name")}</p>
                            <div>{renderName(m.wifeMotherMaidenName)}</div>
                        </div>
                    </div>
                </section>

                {/* Marriage Details */}
                <section className="p-4 rounded">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">{t('Marriage Details')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium">{t('Place of Marriage')}</p>
                            <div>{formatLocation(m.placeOfMarriage)}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Date of Marriage')}</p>
                            <div>{formatDate(m.dateOfMarriage ?? undefined)}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Time of Marriage')}</p>
                            <div>{m.timeOfMarriage || ''}</div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Marriage Settlement')}</p>
                            <div>{m.marriageSettlement ? t('Yes') : t('No')}</div>
                        </div>
                    </div>
                </section>

                {/* Additional Details */}
                <section className="p-4 rounded">
                    <h3 className="font-bold text-lg mb-4 border-b pb-2">{t('Additional Details')}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium">{t('Contracting Parties Signature')}</p>
                            <div>
                                <strong>{t('Husband')}:</strong> {contractingPartiesSignature?.husband || ''}
                                <br />
                                <strong>{t('Wife')}:</strong> {contractingPartiesSignature?.wife || ''}
                            </div>
                        </div>
                        <div>
                            <p className="font-medium">{t('Marriage License Details')}</p>
                            <div>
                                <strong>{t('Number')}:</strong> {marriageLicenseDetails?.number || ''}
                                <br />
                                <strong>{t('Date Issued')}:</strong>{' '}
                                {formatDate(marriageLicenseDetails?.dateIssued ?? undefined)}
                                <br />
                                <strong>{t('Place Issued')}:</strong> {formatLocation(marriageLicenseDetails?.placeIssued)}
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <p className="font-medium">{t('Solemnizing Officer')}</p>
                            <div>
                                <strong>{t('Name')}:</strong> {solemnizingOfficer?.name || ''}
                                <br />
                                <strong>{t('Position')}:</strong> {solemnizingOfficer?.position || ''}
                                <br />
                                <strong>{t('Religion')}:</strong> {solemnizingOfficer?.religion || ''}
                                <br />
                                <strong>{t('Registry No Expiry')}:</strong>{' '}
                                {formatDate(solemnizingOfficer?.registryNoExpiryDate ?? undefined)}
                            </div>
                        </div>
                    </div>
                </section>
            </CardContent>
        </Card>
    )
}
