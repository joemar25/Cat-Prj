import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ConsentPerson, MarriageFormData, PersonName, Place, SolemnizingOfficer } from '@/types/marriage-certificate';

interface MarriageCertificatePreviewProps {
    data: Partial<MarriageFormData>;
}

// Update PreviewValue to handle string dates instead of Date objects
type PreviewValue = string | number | boolean | null | undefined | Place | PersonName | ConsentPerson | SolemnizingOfficer;

const PreviewSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="border rounded-lg p-4 space-y-2">
        <h3 className="font-semibold text-lg border-b pb-2">{title}</h3>
        {children}
    </div>
);

const PreviewField: React.FC<{ label: string; value: PreviewValue }> = ({ label, value }) => {
    let displayValue: string = 'N/A';

    if (value !== null && value !== undefined) {
        if (value instanceof Date) {
            displayValue = value.toISOString().split('T')[0];
        } else if (typeof value === 'object') {
            displayValue = JSON.stringify(value, null, 2);
        } else {
            displayValue = String(value);
        }
    }

    return (
        <div className="grid grid-cols-3 gap-2">
            <span className="text-muted-foreground">{label}:</span>
            <span className="col-span-2">
                {typeof value === 'object' && value !== null ? (
                    <pre className="text-sm whitespace-pre-wrap">{displayValue}</pre>
                ) : (
                    displayValue
                )}
            </span>
        </div>
    );
};

const formatName = (name: PersonName | null | undefined): string => {
    if (!name) return 'N/A';
    return `${name.first}${name.middle ? ` ${name.middle}` : ''} ${name.last}`;
};

const formatPlace = (place: Place | null | undefined): string => {
    if (!place) return 'N/A';
    const { cityMunicipality, province, country } = place;
    return [cityMunicipality, province, country].filter(Boolean).join(', ');
};

const MarriageCertificatePreview: React.FC<MarriageCertificatePreviewProps> = ({ data }) => {
    if (!Object.entries(data).length) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Preview</CardTitle>
                    <CardDescription>Real-time preview of the marriage certificate</CardDescription>
                </CardHeader>
                <CardContent className="h-[calc(100%-100px)] flex items-center justify-center">
                    <span className="text-muted-foreground">Preview will appear here as you type</span>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Real-time preview of the marriage certificate</CardDescription>
            </CardHeader>
            <CardContent className="h-[calc(100%-100px)]">
                <ScrollArea className="h-full">
                    <div className="space-y-6 pb-6">
                        <PreviewSection title="Husband's Information">
                            <PreviewField
                                label="Full Name"
                                value={[data.husbandFirstName, data.husbandMiddleName, data.husbandLastName]
                                    .filter(Boolean)
                                    .join(' ')}
                            />
                            <PreviewField label="Date of Birth" value={data.husbandDateOfBirth} />
                            <PreviewField label="Age" value={data.husbandAge} />
                            <PreviewField label="Place of Birth" value={formatPlace(data.husbandPlaceOfBirth)} />
                            <PreviewField label="Sex" value={data.husbandSex} />
                            <PreviewField label="Citizenship" value={data.husbandCitizenship} />
                            <PreviewField label="Residence" value={data.husbandResidence} />
                            <PreviewField label="Religion" value={data.husbandReligion} />
                            <PreviewField label="Civil Status" value={data.husbandCivilStatus} />
                        </PreviewSection>

                        <PreviewSection title="Husband's Family">
                            <PreviewField label="Father's Name" value={formatName(data.husbandFatherName)} />
                            <PreviewField label="Father's Citizenship" value={data.husbandFatherCitizenship} />
                            <PreviewField label="Mother's Maiden Name" value={formatName(data.husbandMotherMaidenName)} />
                            <PreviewField label="Mother's Citizenship" value={data.husbandMotherCitizenship} />
                        </PreviewSection>

                        <PreviewSection title="Wife's Information">
                            <PreviewField
                                label="Full Name"
                                value={[data.wifeFirstName, data.wifeMiddleName, data.wifeLastName]
                                    .filter(Boolean)
                                    .join(' ')}
                            />
                            <PreviewField label="Date of Birth" value={data.wifeDateOfBirth} />
                            <PreviewField label="Age" value={data.wifeAge} />
                            <PreviewField label="Place of Birth" value={formatPlace(data.wifePlaceOfBirth)} />
                            <PreviewField label="Sex" value={data.wifeSex} />
                            <PreviewField label="Citizenship" value={data.wifeCitizenship} />
                            <PreviewField label="Residence" value={data.wifeResidence} />
                            <PreviewField label="Religion" value={data.wifeReligion} />
                            <PreviewField label="Civil Status" value={data.wifeCivilStatus} />
                        </PreviewSection>

                        <PreviewSection title="Wife's Family">
                            <PreviewField label="Father's Name" value={formatName(data.wifeFatherName)} />
                            <PreviewField label="Father's Citizenship" value={data.wifeFatherCitizenship} />
                            <PreviewField label="Mother's Maiden Name" value={formatName(data.wifeMotherMaidenName)} />
                            <PreviewField label="Mother's Citizenship" value={data.wifeMotherCitizenship} />
                        </PreviewSection>

                        <PreviewSection title="Marriage Details">
                            {data.placeOfMarriage && (
                                <PreviewField
                                    label="Place of Marriage"
                                    value={`${data.placeOfMarriage.office}, ${formatPlace(data.placeOfMarriage)}`}
                                />
                            )}
                            <PreviewField label="Date of Marriage" value={data.dateOfMarriage} />
                            <PreviewField label="Time of Marriage" value={data.timeOfMarriage} />
                        </PreviewSection>

                        {data.solemnizingOfficer && (
                            <PreviewSection title="Solemnizing Officer">
                                <PreviewField label="Name" value={data.solemnizingOfficer.name} />
                                <PreviewField label="Position" value={data.solemnizingOfficer.position} />
                                <PreviewField label="Religion" value={data.solemnizingOfficer.religion} />
                                <PreviewField
                                    label="Registry Expiry Date"
                                    value={data.solemnizingOfficer.registryNoExpiryDate}
                                />
                            </PreviewSection>
                        )}

                        {(data.husbandConsentPerson || data.wifeConsentPerson) && (
                            <PreviewSection title="Consent Information">
                                {data.husbandConsentPerson && (
                                    <div className="space-y-2">
                                        <h4 className="font-medium">Husband&apos;s Consent Person</h4>
                                        <PreviewField label="Name" value={formatName(data.husbandConsentPerson.name)} />
                                        <PreviewField label="Relationship" value={data.husbandConsentPerson.relationship} />
                                        <PreviewField label="Residence" value={data.husbandConsentPerson.residence} />
                                    </div>
                                )}
                                {data.wifeConsentPerson && (
                                    <div className="space-y-2 mt-4">
                                        <h4 className="font-medium">Wife&apos;s Consent Person</h4>
                                        <PreviewField label="Name" value={formatName(data.wifeConsentPerson.name)} />
                                        <PreviewField label="Relationship" value={data.wifeConsentPerson.relationship} />
                                        <PreviewField label="Residence" value={data.wifeConsentPerson.residence} />
                                    </div>
                                )}
                            </PreviewSection>
                        )}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    );
};

export default MarriageCertificatePreview;