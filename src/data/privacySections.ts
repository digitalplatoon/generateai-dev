
import { Shield, Eye, Lock, Users, Globe, FileText } from 'lucide-react';

export const privacySections = [
  {
    id: 'information-collection',
    title: 'Information We Collect',
    icon: FileText,
    content: [
      {
        subtitle: 'Personal Information',
        text: 'We collect information you provide directly to us, such as when you create an account, subscribe to our service, participate in our community, or contact us for support. This may include your name, email address, username, and any other information you choose to provide.'
      },
      {
        subtitle: 'Usage Information',
        text: 'We automatically collect certain information about your use of our platform, including your IP address, browser type, operating system, pages viewed, time spent on pages, and other usage statistics to improve our service.'
      },
      {
        subtitle: 'Device Information',
        text: 'We may collect information about the devices you use to access our service, including hardware model, operating system version, unique device identifiers, and mobile network information.'
      }
    ]
  },
  {
    id: 'how-we-use',
    title: 'How We Use Your Information',
    icon: Eye,
    content: [
      {
        subtitle: 'Service Provision',
        text: 'We use your information to provide, maintain, and improve our AI development platform, including personalizing your learning experience and providing customer support.'
      },
      {
        subtitle: 'Communication',
        text: 'We may use your contact information to send you technical notices, updates, security alerts, and administrative messages related to your account and our services.'
      },
      {
        subtitle: 'Analytics and Improvement',
        text: 'We analyze usage patterns to understand how our platform is used, identify areas for improvement, and develop new features that better serve our community.'
      }
    ]
  },
  {
    id: 'information-sharing',
    title: 'Information Sharing and Disclosure',
    icon: Users,
    content: [
      {
        subtitle: 'Service Providers',
        text: 'We may share your information with third-party service providers who assist us in operating our platform, conducting our business, or serving our users, provided they agree to keep this information confidential.'
      },
      {
        subtitle: 'Legal Requirements',
        text: 'We may disclose your information if required to do so by law or if we believe that such action is necessary to comply with legal processes, protect our rights, or ensure the safety of our users.'
      },
      {
        subtitle: 'Business Transfers',
        text: 'In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction, subject to the same privacy protections outlined in this policy.'
      }
    ]
  },
  {
    id: 'data-security',
    title: 'Data Security',
    icon: Lock,
    content: [
      {
        subtitle: 'Security Measures',
        text: 'We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.'
      },
      {
        subtitle: 'Encryption',
        text: 'All data transmission between your device and our servers is encrypted using industry-standard SSL/TLS protocols. Sensitive data is encrypted at rest using AES-256 encryption.'
      },
      {
        subtitle: 'Access Controls',
        text: 'We maintain strict access controls and regularly audit access to personal data. Only authorized personnel with a legitimate business need can access your information.'
      }
    ]
  },
  {
    id: 'user-rights',
    title: 'Your Rights and Choices',
    icon: Shield,
    content: [
      {
        subtitle: 'Access and Correction',
        text: 'You have the right to access, update, or correct your personal information at any time through your account settings or by contacting us directly.'
      },
      {
        subtitle: 'Data Portability',
        text: 'You can request a copy of your personal data in a structured, commonly used, and machine-readable format. We will provide this data within 30 days of your request.'
      },
      {
        subtitle: 'Deletion',
        text: 'You can request deletion of your personal information at any time. We will delete your data within 30 days, except where we are required to retain it for legal or business purposes.'
      }
    ]
  },
  {
    id: 'cookies',
    title: 'Cookies and Tracking',
    icon: Globe,
    content: [
      {
        subtitle: 'Essential Cookies',
        text: 'We use essential cookies that are necessary for the operation of our platform, including authentication, security, and basic functionality cookies.'
      },
      {
        subtitle: 'Analytics Cookies',
        text: 'We use analytics cookies to understand how users interact with our platform, which helps us improve our services. You can opt out of these cookies through your browser settings.'
      },
      {
        subtitle: 'Third-Party Cookies',
        text: 'Our platform may include third-party services that set their own cookies. These are governed by the respective third parties\' privacy policies.'
      }
    ]
  }
];
