"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, Calendar, MapPin, Heart, Shield, AlertTriangle, FileText, CheckCircle2, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/atoms/StatusBadge";
import { mockADTPatients, mockAdmissions, mockConsents } from "@/features/frontdesk/data/mock-data";

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const patient = mockADTPatients.find((p) => p.id === id);

    if (!patient) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center space-y-2">
                    <p className="text-lg font-semibold">Patient not found</p>
                    <Link href="/frontdesk/patients"><Button variant="outline">Back to search</Button></Link>
                </div>
            </div>
        );
    }

    const age = new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear();
    const admissions = mockAdmissions.filter((a) => a.patientId === patient.id);
    const consents = mockConsents.filter((c) => c.patientId === patient.id);

    return (
        <div className="space-y-6 max-w-5xl">
            {/* Header */}
            <div className="flex items-start gap-4">
                <Link href="/frontdesk/patients">
                    <Button variant="ghost" size="icon" className="h-8 w-8 mt-1"><ArrowLeft className="h-4 w-4" /></Button>
                </Link>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary text-lg font-bold">
                            {patient.firstName[0]}{patient.lastName[0]}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold tracking-tight">{patient.firstName} {patient.lastName}</h1>
                                <StatusBadge status={patient.status} />
                                {!patient.consentSigned && (
                                    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-600 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full">
                                        <AlertTriangle className="h-2.5 w-2.5" /> Consent pending
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground font-mono">{patient.mrn}</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href="/frontdesk/checkin"><Button variant="outline" size="sm">Check In</Button></Link>
                    <Button size="sm">Admit Patient</Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left — Demographics */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <User className="h-4 w-4 text-primary" /> Demographics
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6 text-sm">
                                <div><span className="text-muted-foreground text-xs block">Date of Birth</span><span className="font-medium flex items-center gap-1"><Calendar className="h-3 w-3 text-muted-foreground" />{patient.dateOfBirth} ({age}y)</span></div>
                                <div><span className="text-muted-foreground text-xs block">Gender</span><span className="font-medium capitalize">{patient.gender}</span></div>
                                <div><span className="text-muted-foreground text-xs block">Blood Type</span><span className="font-medium">{patient.bloodType || "Unknown"}</span></div>
                                <div><span className="text-muted-foreground text-xs block">Phone</span><span className="font-medium flex items-center gap-1"><Phone className="h-3 w-3 text-muted-foreground" />{patient.phone}</span></div>
                                <div><span className="text-muted-foreground text-xs block">Email</span><span className="font-medium flex items-center gap-1"><Mail className="h-3 w-3 text-muted-foreground" />{patient.email}</span></div>
                                <div><span className="text-muted-foreground text-xs block">Language</span><span className="font-medium">{patient.preferredLanguage || "English"}</span></div>
                                <div className="col-span-2 sm:col-span-3"><span className="text-muted-foreground text-xs block">Address</span><span className="font-medium flex items-center gap-1"><MapPin className="h-3 w-3 text-muted-foreground" />{patient.address}</span></div>
                            </div>
                            {patient.allergies && patient.allergies.length > 0 && (
                                <>
                                    <Separator />
                                    <div>
                                        <span className="text-muted-foreground text-xs block mb-1.5">Allergies</span>
                                        <div className="flex flex-wrap gap-1">
                                            {patient.allergies.map((a) => (
                                                <Badge key={a} variant="destructive" className="text-xs">{a}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {/* Admissions History */}
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <Heart className="h-4 w-4 text-primary" /> Admission History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {admissions.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-4 text-center">No admission records</p>
                            ) : (
                                <div className="space-y-3">
                                    {admissions.map((adm) => (
                                        <div key={adm.id} className="flex items-center gap-4 p-3 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors">
                                            <div className="text-center min-w-[54px]">
                                                <p className="text-xs text-muted-foreground">{new Date(adm.admittedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</p>
                                            </div>
                                            <div className="h-8 w-px bg-border/60" />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium">{adm.reasonForAdmission}</p>
                                                <p className="text-xs text-muted-foreground">{adm.admittingDoctor} · {adm.department}{adm.ward ? ` · ${adm.ward}` : ""}</p>
                                            </div>
                                            <StatusBadge status={adm.status} />
                                            <Badge variant="outline" className="text-[10px] capitalize">{adm.type}</Badge>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right sidebar */}
                <div className="space-y-6">
                    {/* Emergency Contact */}
                    {patient.emergencyContact && (
                        <Card className="border-border/50 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-primary" /> Emergency Contact
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1 text-sm">
                                <p className="font-medium">{patient.emergencyContact.name}</p>
                                <p className="text-muted-foreground text-xs">{patient.emergencyContact.relationship}</p>
                                <p className="flex items-center gap-1 text-xs"><Phone className="h-3 w-3" />{patient.emergencyContact.phone}</p>
                            </CardContent>
                        </Card>
                    )}

                    {/* Insurance */}
                    {patient.insurance && (
                        <Card className="border-border/50 shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base font-semibold flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-primary" /> Insurance
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div><span className="text-muted-foreground text-xs block">Provider</span><span className="font-medium">{patient.insurance.provider}</span></div>
                                <div><span className="text-muted-foreground text-xs block">Policy</span><span className="font-mono text-xs">{patient.insurance.policyNumber}</span></div>
                                <div className="flex gap-4">
                                    <div><span className="text-muted-foreground text-xs block">Copay</span><span className="font-medium">${patient.insurance.copay ?? "N/A"}</span></div>
                                    <div><span className="text-muted-foreground text-xs block">Coverage</span><StatusBadge status={patient.insurance.coverageType} /></div>
                                </div>
                                <div><span className="text-muted-foreground text-xs block">Valid</span><span className="text-xs">{patient.insurance.validFrom} → {patient.insurance.validTo}</span></div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Consent Documents */}
                    <Card className="border-border/50 shadow-sm">
                        <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold flex items-center gap-2">
                                <FileText className="h-4 w-4 text-primary" /> Consent Documents
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {consents.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-2">No consents on file</p>
                            ) : (
                                <div className="space-y-2">
                                    {consents.map((c) => (
                                        <div key={c.id} className="flex items-center justify-between p-2 rounded-lg border border-border/40">
                                            <div className="flex items-center gap-2">
                                                {c.status === "signed" ? (
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                ) : (
                                                    <Clock className="h-4 w-4 text-amber-500" />
                                                )}
                                                <span className="text-xs font-medium capitalize">{c.type}</span>
                                            </div>
                                            <StatusBadge status={c.status} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
