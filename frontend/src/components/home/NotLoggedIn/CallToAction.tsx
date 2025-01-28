import React from 'react';
import { Link } from 'react-router-dom';

const CallToAction: React.FC = () => {
  return (
    <section className='py-20 dark:bg-surface-a0-dark'>
      <div className='container mx-auto px-4 text-center'>
        <h2 className='text-4xl font-bold mb-6 dark:text-primary-a2-dark'>
          Ready to Start Your Survivor Fantasy Journey?
        </h2>
        <p className='text-xl mb-8 max-w-2xl mx-auto dark:text-primary-a0-dark'>
          Join Survivor fans competing for glory. Create your team and prove your strategic prowess!
        </p>
        <Link
          to='/register'
          className='inline-block px-8 py-4 bg-primary-a3-dark text-white font-bold rounded-lg 
            hover:bg-primary-a2-dark transition-colors text-lg'>
          Start Your Team Today!
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
