import React, { useState } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import Drawer from '../components/ui/Drawer';

const AboutPage: React.FC = () => {
  const [isTechOpen, setIsTechOpen] = useState(true);

  return (
    <div className='container mx-auto px-4 py-8 space-y-8 dark:text-primary-a0-dark'>
      {/* Hero Section */}
      <div className='flex flex-col md:flex-row items-center gap-8'>
        <img
          className='w-48 h-48 rounded-full object-cover'
          src='/AboutMe.jpeg'
          alt='Patrick Klein'
        />
        <div className='space-y-4'>
          <h1 className='text-4xl font-bold dark:text-primary-a2-dark'>
            Patrick Klein
          </h1>
          <p className='text-xl'>Full Stack Developer</p>
          <div className='flex gap-4'>
            <a
              href='https://github.com/Patrick687'
              className='text-3xl dark:hover:text-primary-a3-dark'>
              <FaGithub />
            </a>
            <a
              href='https://linkedin.com/in/patrick-hal-klein'
              className='text-3xl dark:hover:text-primary-a3-dark'>
              <FaLinkedin />
            </a>
            <a
              href='mailto:pklein111697@gmail.com'
              className='text-3xl dark:hover:text-primary-a3-dark'>
              <FaEnvelope />
            </a>
          </div>
        </div>
      </div>

      <section id='Info Drawers'>
        <Drawer title='Technical Overview' defaultOpen={true}>
          <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4'>
            {/* Languages */}
            <div className='space-y-2'>
              <h3 className='font-semibold text-xl underline underline-offset-8'>
                Languages
              </h3>
              <ul className='list-disc list-inside'>
                <li>Java</li>
                <li>JavaScript</li>
                <li>TypeScript</li>
                <li>SQL</li>
              </ul>
            </div>

            {/* Frameworks */}
            <div className='space-y-2'>
              <h3 className='font-semibold text-xl underline underline-offset-8'>
                Frameworks & Libraries
              </h3>
              <ul className='list-disc list-inside'>
                <li>React with TypeScript</li>
                <li>Redux Toolkit</li>
                <li>TailwindCSS</li>
                <li>Spring Framework</li>
              </ul>
            </div>

            {/* Tools */}
            <div className='space-y-2'>
              <h3 className='font-semibold text-xl underline underline-offset-8'>
                Tools & Technologies
              </h3>
              <ul className='list-disc list-inside'>
                <li>Docker</li>
                <li>OpenAPI 3.0</li>
                <li>Git</li>
                <li>Maven</li>
              </ul>
            </div>

            {/* Database */}
            <div className='space-y-2'>
              <h3 className='font-semibold text-xl underline underline-offset-8'>
                Database & Testing
              </h3>
              <ul className='list-disc list-inside'>
                <li>PostgreSQL</li>
                <li>MySQL</li>
                <li>Jest</li>
                <li>JUnit</li>
              </ul>
            </div>
          </div>
        </Drawer>

        <Drawer title='Project Highlights' defaultOpen={false}>
          <div className='space-y-2'>
            <p>Key features implemented in this project:</p>
            <ul className='list-disc list-inside'>
              <li>Real-time game state updates</li>
              <li>Secure user authentication</li>
              <li>Responsive design for all devices</li>
              <li>API documentation with Swagger/OpenAPI</li>
              <li>Automated testing with Jest</li>
            </ul>
          </div>
        </Drawer>

        <Drawer title='Professional Background' defaultOpen={false}>
          <h2 className='text-2xl font-bold'>Professional Background</h2>
          <p>
            With 4 years of experience in software development, primarily
            focused on Java and retail systems, I've successfully transitioned
            to full-stack web development. My background includes:
          </p>
          <ul className='list-disc list-inside'>
            <li>API integration experience with major retail systems</li>
            <li>Large-scale data processing and optimization</li>
            <li>Agile development methodologies</li>
            <li>CI/CD pipeline implementation</li>
          </ul>
        </Drawer>
      </section>
    </div>
  );
};

export default AboutPage;
