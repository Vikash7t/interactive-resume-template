/**
 * Enterprise Technical Skill Dictionary & Synonym / Alias Map.
 * Used for deterministic phrase matching and controlled semantic equivalence without false positives.
 */

export interface SkillDefinition {
  canonical: string;
  name: string;
  category: 'languages' | 'frontend' | 'backend' | 'databases' | 'cloud_devops' | 'architecture' | 'data_ml' | 'practices';
  aliases: string[];
}

export const SKILL_DEFINITIONS: SkillDefinition[] = [
  // --- Programming Languages ---
  {
    canonical: 'typescript',
    name: 'TypeScript',
    category: 'languages',
    aliases: ['ts'],
  },
  {
    canonical: 'javascript',
    name: 'JavaScript',
    category: 'languages',
    aliases: ['js', 'ecmascript'],
  },
  {
    canonical: 'python',
    name: 'Python',
    category: 'languages',
    aliases: ['python3'],
  },
  {
    canonical: 'go',
    name: 'Go',
    category: 'languages',
    aliases: ['golang'],
  },
  {
    canonical: 'rust',
    name: 'Rust',
    category: 'languages',
    aliases: ['rustlang'],
  },
  {
    canonical: 'java',
    name: 'Java',
    category: 'languages',
    aliases: ['java 17', 'java 21', 'core java'],
  },
  {
    canonical: 'cplusplus',
    name: 'C++',
    category: 'languages',
    aliases: ['cpp', 'c++17', 'c++20'],
  },
  {
    canonical: 'csharp',
    name: 'C#',
    category: 'languages',
    aliases: ['c-sharp', '.net c#'],
  },
  {
    canonical: 'sql',
    name: 'SQL',
    category: 'languages',
    aliases: ['structured query language', 'ansi sql'],
  },
  {
    canonical: 'bash',
    name: 'Bash',
    category: 'languages',
    aliases: ['shell script', 'shell scripting', 'sh'],
  },

  // --- Frontend Technologies ---
  {
    canonical: 'react',
    name: 'React',
    category: 'frontend',
    aliases: ['reactjs', 'react.js'],
  },
  {
    canonical: 'nextjs',
    name: 'Next.js',
    category: 'frontend',
    aliases: ['next.js', 'next js'],
  },
  {
    canonical: 'vue',
    name: 'Vue.js',
    category: 'frontend',
    aliases: ['vuejs', 'vue.js', 'vue 3'],
  },
  {
    canonical: 'angular',
    name: 'Angular',
    category: 'frontend',
    aliases: ['angularjs', 'angular 2+'],
  },
  {
    canonical: 'tailwind',
    name: 'Tailwind CSS',
    category: 'frontend',
    aliases: ['tailwind', 'tailwindcss'],
  },
  {
    canonical: 'redux',
    name: 'Redux',
    category: 'frontend',
    aliases: ['redux toolkit', 'rtk'],
  },
  {
    canonical: 'zustand',
    name: 'Zustand',
    category: 'frontend',
    aliases: [],
  },
  {
    canonical: 'html',
    name: 'HTML5',
    category: 'frontend',
    aliases: ['html', 'semantic html'],
  },
  {
    canonical: 'css',
    name: 'CSS3',
    category: 'frontend',
    aliases: ['css'],
  },

  // --- Backend Technologies ---
  {
    canonical: 'nodejs',
    name: 'Node.js',
    category: 'backend',
    aliases: ['nodejs', 'node.js', 'node'],
  },
  {
    canonical: 'nestjs',
    name: 'NestJS',
    category: 'backend',
    aliases: ['nest.js', 'nest js'],
  },
  {
    canonical: 'express',
    name: 'Express.js',
    category: 'backend',
    aliases: ['expressjs', 'express'],
  },
  {
    canonical: 'fastapi',
    name: 'FastAPI',
    category: 'backend',
    aliases: ['fast api'],
  },
  {
    canonical: 'django',
    name: 'Django',
    category: 'backend',
    aliases: ['django rest framework', 'drf'],
  },
  {
    canonical: 'springboot',
    name: 'Spring Boot',
    category: 'backend',
    aliases: ['spring-boot', 'spring framework'],
  },
  {
    canonical: 'graphql',
    name: 'GraphQL',
    category: 'backend',
    aliases: ['gql', 'apollo graphql'],
  },
  {
    canonical: 'rest',
    name: 'REST APIs',
    category: 'backend',
    aliases: ['restful', 'rest api', 'restful apis', 'rest services'],
  },
  {
    canonical: 'grpc',
    name: 'gRPC',
    category: 'backend',
    aliases: ['protocol buffers', 'protobuf'],
  },
  {
    canonical: 'websockets',
    name: 'WebSockets',
    category: 'backend',
    aliases: ['socket.io', 'websocket'],
  },

  // --- Databases & Persistence ---
  {
    canonical: 'postgresql',
    name: 'PostgreSQL',
    category: 'databases',
    aliases: ['postgres', 'pgsql'],
  },
  {
    canonical: 'mysql',
    name: 'MySQL',
    category: 'databases',
    aliases: ['mariadb'],
  },
  {
    canonical: 'mongodb',
    name: 'MongoDB',
    category: 'databases',
    aliases: ['mongo'],
  },
  {
    canonical: 'redis',
    name: 'Redis',
    category: 'databases',
    aliases: ['redis cache'],
  },
  {
    canonical: 'elasticsearch',
    name: 'Elasticsearch',
    category: 'databases',
    aliases: ['elastic search', 'opensearch'],
  },
  {
    canonical: 'prisma',
    name: 'Prisma',
    category: 'databases',
    aliases: ['prisma orm'],
  },
  {
    canonical: 'dynamodb',
    name: 'DynamoDB',
    category: 'databases',
    aliases: ['amazon dynamodb'],
  },

  // --- Cloud & DevOps ---
  {
    canonical: 'aws',
    name: 'AWS',
    category: 'cloud_devops',
    aliases: ['amazon web services', 'amazon aws'],
  },
  {
    canonical: 'gcp',
    name: 'Google Cloud Platform',
    category: 'cloud_devops',
    aliases: ['gcp', 'google cloud'],
  },
  {
    canonical: 'azure',
    name: 'Microsoft Azure',
    category: 'cloud_devops',
    aliases: ['azure'],
  },
  {
    canonical: 'docker',
    name: 'Docker',
    category: 'cloud_devops',
    aliases: ['containerization', 'containers', 'docker containers'],
  },
  {
    canonical: 'kubernetes',
    name: 'Kubernetes',
    category: 'cloud_devops',
    aliases: ['k8s', 'kube'],
  },
  {
    canonical: 'terraform',
    name: 'Terraform',
    category: 'cloud_devops',
    aliases: ['iac', 'infrastructure as code'],
  },
  {
    canonical: 'cicd',
    name: 'CI/CD',
    category: 'cloud_devops',
    aliases: [
      'continuous integration',
      'continuous deployment',
      'continuous delivery',
      'cicd pipelines',
      'github actions',
      'gitlab ci',
    ],
  },
  {
    canonical: 'linux',
    name: 'Linux',
    category: 'cloud_devops',
    aliases: ['unix', 'ubuntu', 'debian', 'alpine'],
  },
  {
    canonical: 'prometheus',
    name: 'Prometheus',
    category: 'cloud_devops',
    aliases: ['grafana', 'datadog', 'observability'],
  },

  // --- Architecture & Distributed Systems ---
  {
    canonical: 'microservices',
    name: 'Microservices',
    category: 'architecture',
    aliases: ['microservices architecture', 'micro-service'],
  },
  {
    canonical: 'distributed_systems',
    name: 'Distributed Systems',
    category: 'architecture',
    aliases: ['distributed architecture', 'distributed computing'],
  },
  {
    canonical: 'system_design',
    name: 'System Design',
    category: 'architecture',
    aliases: ['system architecture', 'software architecture', 'high-level design'],
  },
  {
    canonical: 'event_driven',
    name: 'Event-Driven Architecture',
    category: 'architecture',
    aliases: ['event driven', 'message queues', 'eda', 'pub sub', 'pubsub'],
  },

  // --- Data & Machine Learning ---
  {
    canonical: 'kafka',
    name: 'Apache Kafka',
    category: 'data_ml',
    aliases: ['kafka', 'apache kafka'],
  },
  {
    canonical: 'spark',
    name: 'Apache Spark',
    category: 'data_ml',
    aliases: ['spark', 'pyspark'],
  },
  {
    canonical: 'machine_learning',
    name: 'Machine Learning',
    category: 'data_ml',
    aliases: ['ml', 'machine learning', 'deep learning'],
  },
  {
    canonical: 'ai',
    name: 'Artificial Intelligence',
    category: 'data_ml',
    aliases: ['ai', 'generative ai', 'genai', 'llm', 'llms'],
  },
  {
    canonical: 'pytorch',
    name: 'PyTorch',
    category: 'data_ml',
    aliases: ['torch'],
  },
  {
    canonical: 'tensorflow',
    name: 'TensorFlow',
    category: 'data_ml',
    aliases: ['tf'],
  },

  // --- Engineering Practices & Security ---
  {
    canonical: 'testing',
    name: 'Unit & Integration Testing',
    category: 'practices',
    aliases: ['tdd', 'test driven development', 'jest', 'vitest', 'unit testing', 'automated testing'],
  },
  {
    canonical: 'agile',
    name: 'Agile & Scrum',
    category: 'practices',
    aliases: ['agile', 'scrum', 'kanban', 'sprint planning'],
  },
  {
    canonical: 'security',
    name: 'Application Security (OWASP)',
    category: 'practices',
    aliases: ['owasp', 'appsec', 'security best practices', 'oauth', 'jwt'],
  },
];

/**
 * Fast lookup map from any normalized alias/name to its canonical SkillDefinition.
 */
export const ALIAS_LOOKUP_MAP = new Map<string, SkillDefinition>();

for (const skill of SKILL_DEFINITIONS) {
  // Map canonical
  ALIAS_LOOKUP_MAP.set(skill.canonical.toLowerCase(), skill);
  // Map clean display name
  ALIAS_LOOKUP_MAP.set(skill.name.toLowerCase(), skill);
  // Map all aliases
  for (const alias of skill.aliases) {
    ALIAS_LOOKUP_MAP.set(alias.toLowerCase(), skill);
  }
}
