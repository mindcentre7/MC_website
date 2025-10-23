import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import fs from 'fs/promises';
import path from 'path';

// Revalidate every 10 seconds to ensure fresh content
export const revalidate = 10;

export const metadata: Metadata = {
  title: 'About Us - Serangoon Tuition & Bedok Tuition Centre',
  description: 'Learn about Mind Centre for Learning, a trusted tuition centre in Serangoon and Bedok, Singapore. Our proven methodologies have helped hundreds of students achieve A\'s.',
  keywords: [
    'about mind centre',
    'serangoon tuition centre',
    'bedok tuition',
    'bishan tuition',
    'education centre singapore',
    'trusted tuition',
  ],
  openGraph: {
    title: 'About Mind Centre for Learning - Serangoon Tuition',
    description: 'Learn about Mind Centre for Learning, a trusted tuition centre in Serangoon and Bedok, Singapore.',
    url: 'https://www.mindcentre.com.sg/about',
  },
  alternates: {
    canonical: 'https://www.mindcentre.com.sg/about',
  },
};

interface AboutData {
  title: string;
  introduction: string;
  mission: string;
  vision: string;
  values: Array<{ title: string; description: string }>;
  achievements: string[];
  foundersMessage: string[];
}

async function getAboutData(): Promise<AboutData> {
  try {
    const filePath = path.join(process.cwd(), 'public', 'content', 'about.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const data = JSON.parse(fileContent);
    
    // Validate required fields
    if (!data.title || !data.introduction || !data.mission || !data.vision || !data.values || !data.achievements || !data.foundersMessage) {
      throw new Error('Invalid JSON structure');
    }
    
    return data as AboutData;
  } catch (error) {
    console.error('Error reading about data:', error);
    // Return default content if about.json is missing or invalid
    return {
      title: 'About Mind Centre for Learning',
      introduction: 'At Mind Centre, we believe every student has the potential to excel. Our proven methodologies, backed by brain research, help students learn faster and more effectively.',
      mission: 'To empower students with effective learning strategies that build confidence, improve grades, and foster a lifelong love of learning.',
      vision: 'To be Singapore\'s leading tuition centre known for innovative teaching methods and exceptional student results.',
      values: [
        {
          title: 'Excellence',
          description: 'We strive for the highest standards in education and student support.',
        },
        {
          title: 'Innovation',
          description: 'We continuously improve our teaching methods based on the latest educational research.',
        },
        {
          title: 'Care',
          description: 'We genuinely care about each student\'s academic and personal growth.',
        },
        {
          title: 'Integrity',
          description: 'We maintain the highest ethical standards in all our interactions.',
        },
      ],
      achievements: [
        'Over 20 years of excellence in education',
        'Thousands of students helped to achieve their goals',
        'Proven track record in PSLE, O-Level, and A-Level excellence',
        'Specialized programs for IP and IB students',
        'Award-winning teaching methodologies',
      ],
      foundersMessage: [
        "David was a Singapore government scholar graduating from the University of Manchester, UK, with a B.Sc. in Mechanical Engineering with First Class Honours. As a reward for good work performance, a postgraduate scholarship was awarded to him to study in the USA, graduating with an M.Sc in Operations Research. In addition, his teaching qualification via a Graduate Diploma in Teaching from the University of Auckland, NZ, has enabled him to teach many primary, secondary and college students in school.",
        "Violet holds a B.Sc. majoring in Chemistry and Biochemistry from the NUS, an MBA from Golden Gate University, USA, as well as an Advanced Certificate in TEFL for English language teaching. After working for a period of time in MNCs, she moved on to teaching at the Singapore Polytechnic as well as guiding primary, secondary and JC students to achieve their maximum potential through private tuition. For the past over 10 years, many groups of students have achieved success under her guidance, some of which have stayed on with her from primary to JC level!"
      ],
    };
  }
}

export default async function AboutPage() {
  const aboutData = await getAboutData();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">{aboutData.title}</h1>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-lg text-gray-700 leading-relaxed mb-6">{aboutData.introduction}</p>
        
        <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">Our Mission</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">{aboutData.mission}</p>
        
        <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">Our Vision</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-6">{aboutData.vision}</p>
        
        <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">Our Values</h2>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {aboutData.values.map((value, index) => (
            <div key={index} className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">{value.title}</h3>
              <p className="text-gray-700">{value.description}</p>
            </div>
          ))}
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">Our Achievements</h2>
        <ul className="list-disc pl-6 space-y-3 text-lg text-gray-700 mb-6">
          {aboutData.achievements.map((achievement, index) => (
            <li key={index}>{achievement}</li>
          ))}
        </ul>
        
        {/* ✅ FIXED: Changed to "Founders' Background" */}
        <h2 className="text-3xl font-bold text-gray-900 mt-8 mb-4">Founders' Background</h2>
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-8 rounded-2xl border border-purple-200 mb-6">
          {aboutData.foundersMessage.map((message, index) => (
            <div key={index} className="mb-6 last:mb-0">
              <p className="text-lg text-gray-800 leading-relaxed whitespace-pre-line">{message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}