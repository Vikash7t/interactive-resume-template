import { describe, it, expect } from 'vitest';
import { PDFParse } from 'pdf-parse';
import type { ResumeData } from '@resucraft/shared';
import { generatePdfBuffer, formatPdfFilename } from '../../../lib/pdf/generate-pdf';

describe('ResuCraft ATS PDF Generation & Machine Extraction Suite', () => {
  it('formats enterprise-grade PDF filenames correctly', () => {
    expect(formatPdfFilename('Vikash Singh')).toBe('Vikash_Singh_Resume.pdf');
    expect(formatPdfFilename('  Jane Doe  ')).toBe('Jane_Doe_Resume.pdf');
    expect(formatPdfFilename('')).toBe('Resume.pdf');
    expect(formatPdfFilename(undefined)).toBe('Resume.pdf');
    expect(formatPdfFilename('Alex O\'Connor #1')).toBe('Alex_OConnor_1_Resume.pdf');
  });

  it('generates a 1-page compact resume with 100% extractable text and correct reading order', async () => {
    const compactResume: ResumeData = {
      basics: {
        name: 'Vikash Singh',
        label: 'Principal Systems Architect',
        email: 'vikash@example.com',
        phone: '+1 (555) 019-2834',
        url: 'https://vikashsingh.dev',
        summary:
          'Mission-critical systems architect specialized in distributed event streams and zero-latency pipelines.',
        location: {
          city: 'San Francisco',
          countryCode: 'US',
        },
        profiles: [
          { network: 'GitHub', username: 'vikash7t', url: 'https://github.com/vikash7t' },
        ],
      },
      work: [
        {
          id: 'w1',
          name: 'CloudScale Technologies',
          position: 'Staff Infrastructure Engineer',
          startDate: '2022-01',
          endDate: 'Present',
          summary: 'Led distributed database modernization.',
          highlights: [
            'Architected PostgreSQL multi-region replication handling 45,000 queries per second.',
            'Reduced p99 tail latency by 42% through connection pooling optimization.',
          ],
        },
      ],
      education: [
        {
          id: 'e1',
          institution: 'University of California, Berkeley',
          area: 'Computer Science',
          studyType: 'B.S.',
          startDate: '2016',
          endDate: '2020',
          score: '3.92',
          courses: ['Distributed Systems', 'Database Internals'],
        },
      ],
      skills: [
        {
          id: 's1',
          name: 'Backend & Distributed Systems',
          keywords: ['Go', 'TypeScript', 'PostgreSQL', 'Docker', 'Kubernetes'],
        },
      ],
      projects: [],
      certificates: [],
      languages: [
        { language: 'English', fluency: 'Native' },
      ],
    };

    const pdfBuffer = await generatePdfBuffer(compactResume);
    expect(pdfBuffer).toBeInstanceOf(Buffer);
    expect(pdfBuffer.length).toBeGreaterThan(1000);

    // Parse with PDFParse engine
    const parser = new PDFParse({ data: pdfBuffer });
    const parsed = await parser.getText();

    // 1. Pagination check: must fit comfortably on 1 page
    expect(parsed.total).toBe(1);

    const fullText = parsed.text;

    // 2. Text Selection & Extraction Verification
    expect(fullText).toContain('VIKASH SINGH');
    expect(fullText).toContain('Principal Systems Architect');
    expect(fullText).toContain('vikash@example.com');
    expect(fullText).toContain('+1 (555) 019-2834');
    expect(fullText).toContain('San Francisco, US');
    expect(fullText).toContain('CloudScale Technologies');
    expect(fullText).toContain('Staff Infrastructure Engineer');
    expect(fullText).toContain('45,000 queries per second');
    expect(fullText).toContain('University of California, Berkeley');
    expect(fullText).toContain('B.S. in Computer Science');
    expect(fullText).toContain('PostgreSQL');

    // 3. Natural Single-Column Reading Order Verification (linear stream)
    const nameIdx = fullText.indexOf('VIKASH SINGH');
    const summaryIdx = fullText.indexOf('PROFESSIONAL SUMMARY');
    const skillsIdx = fullText.indexOf('TECHNICAL SKILLS');
    const workIdx = fullText.indexOf('PROFESSIONAL EXPERIENCE');
    const eduIdx = fullText.indexOf('EDUCATION');

    expect(nameIdx).toBeGreaterThanOrEqual(0);
    expect(summaryIdx).toBeGreaterThan(nameIdx);
    expect(skillsIdx).toBeGreaterThan(summaryIdx);
    expect(workIdx).toBeGreaterThan(skillsIdx);
    expect(eduIdx).toBeGreaterThan(workIdx);
  });

  it('paginates a multi-page extensive resume without missing entries or clipped text', async () => {
    const extensiveResume: ResumeData = {
      basics: {
        name: 'Dr. Elena Rostova',
        label: 'Director of Machine Learning & Platform Engineering',
        email: 'elena.rostova@enterprise-ai.io',
        phone: '+1 415 800 9922',
        url: 'https://rostova-research.ai',
        summary:
          'Over 14 years architecting enterprise machine learning infrastructure, GPU clusters, and fault-tolerant data pipelines processing billions of daily transactions.',
        location: {
          city: 'Seattle',
          countryCode: 'US',
        },
      },
      work: [
        {
          id: 'w1',
          name: 'Apex AI Laboratories',
          position: 'VP of Platform Engineering',
          startDate: '2023-01',
          endDate: 'Present',
          summary: 'Overseeing global infrastructure across 12 datacenters.',
          highlights: [
            'Orchestrated migration of 1,200 GPU nodes to private cloud architecture saving $3.4M annually.',
            'Authored corporate safety guidelines for real-time generative inference serving 80M MAU.',
            'Standardized SLIs/SLOs maintaining 99.995% uptime across all Tier-1 model inference APIs.',
          ],
        },
        {
          id: 'w2',
          name: 'HyperScale Systems',
          position: 'Principal Distributed Systems Engineer',
          startDate: '2019-03',
          endDate: '2022-12',
          summary: 'Led the Core Storage and Indexing Group.',
          highlights: [
            'Engineered custom vector search indexing library in Rust outperforming Faiss by 2.4x on billion-scale embeddings.',
            'Mentored 18 senior and staff engineers across North America and Europe.',
            'Co-designed distributed consensus protocol with zero data loss over partitioned wide-area networks.',
          ],
        },
        {
          id: 'w3',
          name: 'NextGen Data Technologies',
          position: 'Senior Data Infrastructure Architect',
          startDate: '2015-06',
          endDate: '2019-02',
          summary: 'Built real-time streaming analytics backbone.',
          highlights: [
            'Scaled Apache Flink and Kafka cluster to ingest 4.2 million events per second.',
            'Pioneered automatic schema evolution gateway for backward and forward compatibility.',
          ],
        },
        {
          id: 'w4',
          name: 'Pioneer Research Labs',
          position: 'Software Systems Engineer',
          startDate: '2011-08',
          endDate: '2015-05',
          summary: 'Foundational systems and algorithmic research.',
          highlights: [
            'Implemented high-throughput network packet parser reducing CPU utilization by 35%.',
          ],
        },
      ],
      projects: [
        {
          id: 'p1',
          name: 'OpenVectorDB',
          description: 'High-performance open-source vector database built for low-latency similarity search.',
          url: 'https://github.com/apex-ai/open-vectordb',
          keywords: ['Rust', 'SIMD', 'gRPC', 'Distributed Systems'],
          highlights: [
            'Achieved 12,000 GitHub stars and 1.8M container downloads worldwide.',
            'Adopted by 4 Fortune 50 enterprises for mission-critical recommendation pipelines.',
          ],
        },
        {
          id: 'p2',
          name: 'EventMesh-Kube',
          description: 'Kubernetes operator for declarative stream topology provisioning and automated scaling.',
          url: 'https://github.com/apex-ai/eventmesh',
          keywords: ['Go', 'Kubernetes Operator', 'Prometheus'],
          highlights: [
            'Zero downtime dynamic autoscaling based on consumer lag metrics.',
          ],
        },
      ],
      education: [
        {
          id: 'e1',
          institution: 'Stanford University',
          area: 'Computer Systems Architecture',
          studyType: 'Ph.D.',
          startDate: '2007',
          endDate: '2011',
          score: '4.00',
        },
        {
          id: 'e2',
          institution: 'Carnegie Mellon University',
          area: 'Electrical & Computer Engineering',
          studyType: 'B.S.',
          startDate: '2003',
          endDate: '2007',
        },
      ],
      skills: [
        {
          id: 's1',
          name: 'Distributed Systems & Languages',
          keywords: ['Rust', 'Go', 'C++', 'Python', 'TypeScript', 'SQL', 'eBPF'],
        },
        {
          id: 's2',
          name: 'Data & Infrastructure',
          keywords: ['PostgreSQL', 'Kafka', 'Flink', 'Kubernetes', 'Docker', 'Terraform', 'Prometheus'],
        },
      ],
      certificates: [
        {
          id: 'c1',
          name: 'AWS Certified Solutions Architect – Professional',
          issuer: 'Amazon Web Services',
          date: '2023',
        },
      ],
      languages: [
        { language: 'English', fluency: 'Bilingual' },
        { language: 'German', fluency: 'Professional Working' },
      ],
    };

    const pdfBuffer = await generatePdfBuffer(extensiveResume);
    const parser = new PDFParse({ data: pdfBuffer });
    const parsed = await parser.getText();

    // 1. Must paginate cleanly into multiple pages
    expect(parsed.total).toBeGreaterThanOrEqual(2);

    const fullText = parsed.text;

    // 2. All section headers and entry titles must be completely present
    expect(fullText).toContain('DR. ELENA ROSTOVA');
    expect(fullText).toContain('Apex AI Laboratories');
    expect(fullText).toContain('VP of Platform Engineering');
    expect(fullText).toContain('HyperScale Systems');
    expect(fullText).toContain('NextGen Data Technologies');
    expect(fullText).toContain('Pioneer Research Labs');
    expect(fullText).toContain('OpenVectorDB');
    expect(fullText).toContain('EventMesh-Kube');
    expect(fullText).toContain('Stanford University');
    expect(fullText).toContain('AWS Certified Solutions Architect');
    expect(fullText).toContain('German');

    // 3. Multi-page pagination distribution: Page 1 holds senior leadership roles, Page 2 holds continuing certifications
    expect(parsed.pages[0].text).toContain('VP of Platform Engineering');
    expect(parsed.pages[1].text).toContain('AWS Certified Solutions Architect');
  });

  it('renders special characters, ampersands, long URLs, and technical symbols without corruption', async () => {
    const specialResume: ResumeData = {
      basics: {
        name: 'Renée François-Müller & Associates',
        label: 'C++ & R&D Embedded Specialist (Linux/RTOS)',
        email: 'renee+ats-test@domain-sub.org',
        phone: '+44 (0) 20 7946 0919',
        url: 'https://engineering.research-portfolio.org/special-projects/sub-system/v2.0-rc1',
        summary:
          'Pioneering ultra-low-latency C++20 algorithms for high-frequency trading (HFT) and aerospace telemetry. Experience with I/O multiplexing, SIMD vectorization (AVX-512), lock-free queues, & zero-copy network buffers. Successfully handled 100GbE NICs with < 450ns wire-to-wire response.',
      },
      work: [
        {
          id: 'w1',
          name: 'AT&T Labs / R&D Division',
          position: 'Lead C++20/C# Systems Engineer',
          startDate: '2021-03',
          endDate: 'Present',
          highlights: [
            'Engineered multi-threaded ring-buffers using std::atomic & memory_order_acquire/release semantics.',
            'Optimized data cache lines reducing L3 cache misses by 67.4% on Intel® Xeon® & AMD EPYC™ architectures.',
          ],
        },
      ],
      education: [],
      skills: [
        {
          id: 's1',
          name: 'Core Tooling & Standards',
          keywords: ['C++', 'C#', 'POSIX', 'ARM & x86_64 Assembly', 'GDB / LLDB', 'CMake & Ninja'],
        },
      ],
      projects: [
        {
          id: 'p1',
          name: 'libfast-io & telemetry',
          description: 'A header-only C++20 library for zero-copy deserialization of binary packet formats.',
          url: 'https://github.com/renee-fm/libfast-io-telemetry-suite-for-network-acceleration',
          keywords: ['C++20', 'SIMD', 'Networking'],
          highlights: [
            'Benchmarked against protobuf: 8.5x higher throughput with zero heap allocations.',
          ],
        },
      ],
      certificates: [],
      languages: [],
    };

    const pdfBuffer = await generatePdfBuffer(specialResume);
    const parser = new PDFParse({ data: pdfBuffer });
    const parsed = await parser.getText();
    const fullText = parsed.text;

    // Check exact retention of technical symbols and ampersands
    expect(fullText).toContain('RENÉE FRANÇOIS-MÜLLER & ASSOCIATES');
    expect(fullText).toContain('C++ & R&D Embedded Specialist');
    expect(fullText).toContain('AT&T Labs / R&D Division');
    expect(fullText).toContain('Lead C++20/C# Systems Engineer');
    expect(fullText).toContain('C++');
    expect(fullText).toContain('C#');
    expect(fullText).toContain('ARM & x86_64 Assembly');
    expect(fullText).toContain('CMake & Ninja');
    expect(fullText).toContain('libfast-io & telemetry');
    expect(fullText).toContain('github.com/renee-fm/libfast-io-telemetry-suite-for-network-acceleration');
  });

  it('renders gracefully with missing optional sections without throwing or leaving empty gaps', async () => {
    const minimalResume: ResumeData = {
      basics: {
        name: 'Jordan Lee',
        email: 'jordan.lee@example.com',
      },
      work: [],
      education: [],
      skills: [],
      projects: [],
      certificates: [],
      languages: [],
    };

    const pdfBuffer = await generatePdfBuffer(minimalResume);
    const parser = new PDFParse({ data: pdfBuffer });
    const parsed = await parser.getText();

    expect(parsed.total).toBe(1);
    expect(parsed.text).toContain('JORDAN LEE');
    expect(parsed.text).toContain('jordan.lee@example.com');

    // Unpopulated sections should NOT appear as empty orphaned headers
    expect(parsed.text).not.toContain('Professional Experience');
    expect(parsed.text).not.toContain('Technical Skills');
    expect(parsed.text).not.toContain('Engineering Projects');
    expect(parsed.text).not.toContain('Education');
    expect(parsed.text).not.toContain('Certifications');
    expect(parsed.text).not.toContain('Languages');
  });
});
