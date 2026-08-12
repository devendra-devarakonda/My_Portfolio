import React from 'react';

export const StructuredData: React.FC = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      // 1. PERSON ENTITY (Dev / Devendra Devarakonda)
      {
        '@type': 'Person',
        '@id': 'https://devdevarakonda.in/#person',
        name: 'Devendra Devarakonda',
        alternateName: ['Dev Devarakonda', 'Devendra', 'Dev'],
        jobTitle: 'Founder & Lead Software Engineer',
        worksFor: {
          '@id': 'https://velora-tech.in/#organization',
        },
        url: 'https://devdevarakonda.in',
        image: 'https://devdevarakonda.in/images/hero.jpg',
        description:
          'Devendra Devarakonda (Dev Devarakonda) is a software engineer, AI developer, and founder of Velora Tech, specializing in building enterprise SaaS, AI applications, and custom web engineering.',
        sameAs: [
          'https://github.com/devendra-devarakonda',
          'https://github.com/Veloratech-india',
          'https://linkedin.com/in/devendra-devarakonda',
          'https://x.com/devdevarakonda',
        ],
      },

      // 2. ORGANIZATION ENTITY (Velora Tech)
      {
        '@type': 'Organization',
        '@id': 'https://velora-tech.in/#organization',
        name: 'Velora Tech',
        alternateName: ['VeloraTech', 'Velora', 'Velora Software'],
        url: 'https://velora-tech.in',
        logo: {
          '@type': 'ImageObject',
          url: 'https://velora-tech.in/logo.png',
        },
        founder: {
          '@id': 'https://devdevarakonda.in/#person',
        },
        image: 'https://velora-tech.in/logo.png',
        description:
          'Velora Tech is a software development company specializing in AI solutions, SaaS platforms, web applications, mobile apps, and cloud engineering.',
        email: 'contact@velora-tech.in',
        slogan: 'Where Innovation Meets Execution',
        sameAs: [
          'https://github.com/Veloratech-india',
        ],
        contactPoint: {
          '@type': 'ContactPoint',
          contactType: 'Customer Support',
          email: 'contact@velora-tech.in',
          availableLanguage: ['English'],
        },
      },

      // 3. WEBSITE ENTITY
      {
        '@type': 'WebSite',
        '@id': 'https://devdevarakonda.in/#website',
        url: 'https://devdevarakonda.in',
        name: 'Devendra Devarakonda | Dev Devarakonda',
        publisher: {
          '@id': 'https://devdevarakonda.in/#person',
        },
        inLanguage: 'en',
      },

      // 4. WEBPAGE ENTITY
      {
        '@type': 'WebPage',
        '@id': 'https://devdevarakonda.in/#homepage',
        url: 'https://devdevarakonda.in',
        name: 'Devendra Devarakonda (Dev Devarakonda) | Founder of Velora Tech',
        isPartOf: {
          '@id': 'https://devdevarakonda.in/#website',
        },
        about: [
          { '@id': 'https://velora-tech.in/#organization' },
          { '@id': 'https://devdevarakonda.in/#person' },
        ],
        description:
          'Personal Portfolio and Engineering Showcase of Devendra Devarakonda (Dev Devarakonda), Founder of Velora Tech. Building AI applications, SaaS platforms, and enterprise software.',
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default StructuredData;
