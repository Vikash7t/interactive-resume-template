import React from 'react';
import { useResumeStore } from '../../store/resume-store';
import { SectionHeader } from './SectionHeader';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';

export function BasicsEditor() {
  const { resume, updateBasics } = useResumeStore();
  const basics = resume.basics;

  return (
    <div className="space-y-4">
      <SectionHeader
        title="Personal Information & Contact"
        description="Core identity details that recruiters and ATS engines index first."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <Input
          label="Full Name *"
          placeholder="e.g. Vikash Singh"
          value={basics.name}
          onChange={(e) => updateBasics({ name: e.target.value })}
          required
        />

        <Input
          label="Professional Title"
          placeholder="e.g. Full-Stack Software Developer"
          value={basics.label || ''}
          onChange={(e) => updateBasics({ label: e.target.value })}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="e.g. vikashsingh7490@gmail.com"
          value={basics.email || ''}
          onChange={(e) => updateBasics({ email: e.target.value })}
        />

        <Input
          label="Phone Number"
          type="tel"
          placeholder="e.g. +91 9876543210"
          value={basics.phone || ''}
          onChange={(e) => updateBasics({ phone: e.target.value })}
        />

        <Input
          label="City / Location"
          placeholder="e.g. Bengaluru"
          value={basics.location?.city || ''}
          onChange={(e) =>
            updateBasics({
              location: { ...basics.location, city: e.target.value },
            })
          }
        />

        <Input
          label="Country / Region"
          placeholder="e.g. India (IN)"
          value={basics.location?.countryCode || ''}
          onChange={(e) =>
            updateBasics({
              location: { ...basics.location, countryCode: e.target.value },
            })
          }
        />

        <div className="sm:col-span-2">
          <Input
            label="Website or Portfolio URL"
            type="url"
            placeholder="e.g. https://github.com/Vikash7t"
            value={basics.url || ''}
            onChange={(e) => updateBasics({ url: e.target.value })}
          />
        </div>
      </div>

      <div className="pt-2">
        <Textarea
          label="Executive Professional Summary"
          placeholder="Brief 2-3 sentence technical overview highlighting your stack, core impact, and engineering focus..."
          rows={4}
          value={basics.summary || ''}
          onChange={(e) => updateBasics({ summary: e.target.value })}
          helperText={`${(basics.summary || '').length} characters • 40-70 words recommended for ATS parsers`}
        />
      </div>
    </div>
  );
}
