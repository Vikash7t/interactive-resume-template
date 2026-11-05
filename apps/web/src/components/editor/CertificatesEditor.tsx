import React from 'react';
import { Award, Trash2 } from 'lucide-react';
import { useResumeStore } from '../../store/resume-store';
import { SectionHeader } from './SectionHeader';
import { EmptyState } from './EmptyState';
import { Card, CardHeader, CardContent } from '../ui/Card';
import { Input } from '../ui/Input';

export function CertificatesEditor() {
  const { resume, addCertificate, updateCertificate, removeCertificate } = useResumeStore();
  const certList = resume.certificates || [];

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Certifications & Accreditations"
        description="Professional certifications from AWS, Google Cloud, Meta, etc."
        actionLabel="Add Certificate"
        onAction={() => addCertificate()}
      />

      {certList.length === 0 ? (
        <EmptyState
          icon={<Award className="w-5 h-5" />}
          title="No certifications added yet"
          description="Add cloud credentials, online specializations, or verified certificates."
          actionLabel="Add First Certificate"
          onAction={() => addCertificate()}
        />
      ) : (
        <div className="space-y-4">
          {certList.map((c, idx) => (
            <Card key={c.id || idx}>
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                    <Award className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">
                      {c.name || 'Certificate Name'}
                    </h3>
                    <p className="text-[11px] text-slate-500">{c.issuer}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => c.id && removeCertificate(c.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                  title="Remove this certificate"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </CardHeader>

              <CardContent className="space-y-3 pt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input
                    label="Certificate Title *"
                    placeholder="e.g. AWS Certified Solutions Architect"
                    value={c.name}
                    onChange={(e) =>
                      c.id && updateCertificate(c.id, { name: e.target.value })
                    }
                    required
                  />

                  <Input
                    label="Issuer / Organization"
                    placeholder="e.g. Amazon Web Services"
                    value={c.issuer || ''}
                    onChange={(e) =>
                      c.id && updateCertificate(c.id, { issuer: e.target.value })
                    }
                  />

                  <Input
                    label="Date Earned"
                    placeholder="e.g. 2024"
                    value={c.date || ''}
                    onChange={(e) =>
                      c.id && updateCertificate(c.id, { date: e.target.value })
                    }
                  />

                  <Input
                    label="Credential Verification URL"
                    type="url"
                    placeholder="e.g. https://credly.com/..."
                    value={c.url || ''}
                    onChange={(e) =>
                      c.id && updateCertificate(c.id, { url: e.target.value })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
