import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  Link,
  StyleSheet,
} from '@react-pdf/renderer';
import type { ResumeData } from '@resucraft/shared';

export interface AtsPdfProps {
  resume: ResumeData;
}

// Enterprise Design Tokens aligned with pgAdmin splash palette & ATS standards
const colors = {
  primary: '#2B5C8F', // Postgres Blue brand accent for section headers
  secondary: '#5E429A', // Amethyst Indigo
  accent: '#1C73A6', // Cyan Slate for active links
  textMain: '#0F172A', // Slate 900 for primary typography
  textMuted: '#334155', // Slate 700 for company/institution names
  textSubtle: '#64748B', // Slate 500 for dates and metadata
  border: '#CBD5E1', // Slate 300 for clean hairline dividers
  bgHighlight: '#F8FAFC',
};

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 40,
    paddingLeft: 36,
    paddingRight: 36,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: colors.textMain,
    lineHeight: 1.35,
  },
  // Header / Basics Section
  header: {
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    alignItems: 'center',
  },
  name: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 18,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    color: colors.textMain,
    marginBottom: 2,
    textAlign: 'center',
  },
  titleLabel: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 10,
    color: colors.primary,
    letterSpacing: 0.4,
    marginBottom: 4,
    textAlign: 'center',
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  contactItem: {
    fontSize: 8.5,
    color: colors.textSubtle,
    marginHorizontal: 3,
  },
  contactSeparator: {
    fontSize: 8,
    color: colors.border,
    marginHorizontal: 2,
  },
  contactLink: {
    fontSize: 8.5,
    color: colors.accent,
    textDecoration: 'none',
  },
  // Section Headings
  section: {
    marginBottom: 8,
  },
  sectionTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9.5,
    textTransform: 'uppercase',
    letterSpacing: 0.75,
    color: colors.primary,
    borderBottomWidth: 0.75,
    borderBottomColor: colors.border,
    paddingBottom: 2,
    marginBottom: 5,
  },
  // Entry Containers
  entryContainer: {
    marginBottom: 6,
  },
  entryHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 1.5,
  },
  entryTitleGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    paddingRight: 8,
  },
  entryTitleBold: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 9.5,
    color: colors.textMain,
  },
  entrySubtitle: {
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: colors.textMuted,
  },
  entryDate: {
    fontFamily: 'Helvetica',
    fontSize: 8.5,
    color: colors.textSubtle,
    textAlign: 'right',
  },
  entrySummary: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 8.5,
    color: colors.textMuted,
    marginTop: 1,
    marginBottom: 2,
  },
  // Bullet Highlights
  bulletRow: {
    flexDirection: 'row',
    marginTop: 1.5,
    paddingLeft: 6,
  },
  bulletDot: {
    width: 10,
    fontSize: 9,
    color: colors.textSubtle,
    lineHeight: 1.3,
  },
  bulletText: {
    flex: 1,
    fontSize: 8.5,
    color: colors.textMain,
    lineHeight: 1.3,
  },
  // Skills Section
  skillRow: {
    flexDirection: 'row',
    marginBottom: 2.5,
    lineHeight: 1.3,
  },
  skillCategory: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 8.5,
    color: colors.textMain,
    marginRight: 4,
  },
  skillKeywords: {
    flex: 1,
    fontSize: 8.5,
    color: colors.textMuted,
  },
  // Summary Paragraph
  summaryText: {
    fontSize: 9,
    color: colors.textMain,
    lineHeight: 1.4,
    textAlign: 'justify',
  },
  // Meta text (GPA, Coursework, URLs)
  metaText: {
    fontSize: 8,
    color: colors.textSubtle,
    marginTop: 1,
  },
  linkText: {
    fontSize: 8,
    color: colors.accent,
    textDecoration: 'none',
  },
});

/**
 * Enterprise Certified ATS Single-Column PDF Document.
 * Complies with strict Workday, Greenhouse, and Lever parsing heuristics:
 * - Direct vector text nodes (0% rasterization)
 * - Single-column vertical stream preserving linear reading order
 * - Wrap-safe entries to avoid mid-card pagination ruptures
 * - Fully accessible metadata tagging
 */
export const AtsSingleColumnPdf: React.FC<AtsPdfProps> = ({ resume }) => {
  const {
    basics,
    work = [],
    education = [],
    skills = [],
    projects = [],
    certificates = [],
    languages = [],
  } = resume;

  const authorName = basics.name || 'Candidate';
  const docTitle = `${authorName} - Resume`;

  return (
    <Document
      title={docTitle}
      author={authorName}
      subject="Professional Resume"
      keywords="Resume, CV, Workday ATS, Greenhouse ATS, Lever ATS"
      creator="ResuCraft AI"
      producer="ResuCraft AI Engine"
    >
      <Page size="LETTER" style={styles.page}>
        {/* 1. HEADER / BASICS */}
        <View style={styles.header}>
          <Text style={styles.name}>{basics.name || 'Your Full Name'}</Text>

          {basics.label ? (
            <Text style={styles.titleLabel}>{basics.label}</Text>
          ) : null}

          <View style={styles.contactRow}>
            {basics.location?.city ? (
              <Text style={styles.contactItem}>
                {basics.location.city}
                {basics.location.countryCode ? `, ${basics.location.countryCode}` : ''}
              </Text>
            ) : null}

            {basics.phone ? (
              <>
                <Text style={styles.contactSeparator}>•</Text>
                <Text style={styles.contactItem}>{basics.phone}</Text>
              </>
            ) : null}

            {basics.email ? (
              <>
                <Text style={styles.contactSeparator}>•</Text>
                <Link src={`mailto:${basics.email}`} style={styles.contactLink}>
                  {basics.email}
                </Link>
              </>
            ) : null}

            {basics.url ? (
              <>
                <Text style={styles.contactSeparator}>•</Text>
                <Link src={basics.url} style={styles.contactLink}>
                  {basics.url.replace(/^https?:\/\//, '')}
                </Link>
              </>
            ) : null}

            {basics.profiles?.map((prof, idx) => (
              <React.Fragment key={prof.network || idx}>
                <Text style={styles.contactSeparator}>•</Text>
                {prof.url ? (
                  <Link src={prof.url} style={styles.contactLink}>
                    {prof.username ? `${prof.network}: ${prof.username}` : prof.network}
                  </Link>
                ) : (
                  <Text style={styles.contactItem}>
                    {prof.network}: {prof.username}
                  </Text>
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* 2. EXECUTIVE SUMMARY */}
        {basics.summary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.summaryText}>{basics.summary}</Text>
          </View>
        ) : null}

        {/* 3. TECHNICAL SKILLS */}
        {skills && skills.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            {skills.map((s, idx) => (
              <View key={s.id || idx} style={styles.skillRow}>
                <Text style={styles.skillCategory}>{s.name}:</Text>
                <Text style={styles.skillKeywords}>
                  {s.keywords?.join(', ') || ''}
                </Text>
              </View>
            ))}
          </View>
        ) : null}

        {/* 4. WORK EXPERIENCE */}
        {work && work.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Experience</Text>
            {work.map((w, idx) => {
              const dateRange = [w.startDate, w.endDate || 'Present']
                .filter(Boolean)
                .join(' – ');

              return (
                <View key={w.id || idx} wrap={false} style={styles.entryContainer}>
                  <View style={styles.entryHeaderRow}>
                    <View style={styles.entryTitleGroup}>
                      <Text style={styles.entryTitleBold}>{w.position}</Text>
                      {w.name ? (
                        <Text style={styles.entrySubtitle}> — {w.name}</Text>
                      ) : null}
                    </View>
                    {dateRange ? (
                      <Text style={styles.entryDate}>{dateRange}</Text>
                    ) : null}
                  </View>

                  {w.summary ? (
                    <Text style={styles.entrySummary}>{w.summary}</Text>
                  ) : null}

                  {w.highlights?.map((h, hIdx) => (
                    <View key={hIdx} style={styles.bulletRow}>
                      <Text style={styles.bulletDot}>•</Text>
                      <Text style={styles.bulletText}>{h}</Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
        ) : null}

        {/* 5. KEY PROJECTS */}
        {projects && projects.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Engineering Projects</Text>
            {projects.map((p, idx) => (
              <View key={p.id || idx} wrap={false} style={styles.entryContainer}>
                <View style={styles.entryHeaderRow}>
                  <View style={styles.entryTitleGroup}>
                    <Text style={styles.entryTitleBold}>{p.name}</Text>
                    {p.keywords && p.keywords.length > 0 ? (
                      <Text style={styles.entrySubtitle}>
                        {' '}({p.keywords.join(', ')})
                      </Text>
                    ) : null}
                  </View>
                  {p.url ? (
                    <Link src={p.url} style={styles.linkText}>
                      {p.url.replace(/^https?:\/\//, '')}
                    </Link>
                  ) : null}
                </View>

                {p.description ? (
                  <Text style={styles.entrySummary}>{p.description}</Text>
                ) : null}

                {p.highlights?.map((h, hIdx) => (
                  <View key={hIdx} style={styles.bulletRow}>
                    <Text style={styles.bulletDot}>•</Text>
                    <Text style={styles.bulletText}>{h}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        ) : null}

        {/* 6. EDUCATION */}
        {education && education.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {education.map((e, idx) => {
              const degreeTitle = e.studyType
                ? `${e.studyType}${e.area ? ` in ${e.area}` : ''}`
                : e.area || 'Degree';
              const dateRange = [e.startDate, e.endDate].filter(Boolean).join(' – ');

              return (
                <View key={e.id || idx} wrap={false} style={styles.entryContainer}>
                  <View style={styles.entryHeaderRow}>
                    <View style={styles.entryTitleGroup}>
                      <Text style={styles.entryTitleBold}>{degreeTitle}</Text>
                      {e.institution ? (
                        <Text style={styles.entrySubtitle}> — {e.institution}</Text>
                      ) : null}
                    </View>
                    {dateRange ? (
                      <Text style={styles.entryDate}>{dateRange}</Text>
                    ) : null}
                  </View>

                  {e.score ? (
                    <Text style={styles.metaText}>
                      GPA / Score: {e.score}
                    </Text>
                  ) : null}

                  {e.courses && e.courses.length > 0 ? (
                    <Text style={styles.metaText}>
                      Relevant Coursework: {e.courses.join(', ')}
                    </Text>
                  ) : null}
                </View>
              );
            })}
          </View>
        ) : null}

        {/* 7. CERTIFICATIONS */}
        {certificates && certificates.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Certifications</Text>
            {certificates.map((c, idx) => (
              <View key={c.id || idx} wrap={false} style={styles.entryContainer}>
                <View style={styles.entryHeaderRow}>
                  <Text style={styles.entryTitleBold}>{c.name}</Text>
                  {c.date ? <Text style={styles.entryDate}>{c.date}</Text> : null}
                </View>
                {c.issuer ? (
                  <Text style={styles.metaText}>Issuer: {c.issuer}</Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* 8. LANGUAGES */}
        {languages && languages.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Languages</Text>
            <Text style={styles.summaryText}>
              {languages
                .map((l) => (l.fluency ? `${l.language} (${l.fluency})` : l.language))
                .join(' • ')}
            </Text>
          </View>
        ) : null}
      </Page>
    </Document>
  );
};
