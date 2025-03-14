import React from 'react';
import { Link } from 'react-router-dom';
import {
  ButtonPrimaryColors,
  TextPrimaryColor,
  TextTertiaryColor,
} from '../../../../styles/CommonColorClassNames';

const CallToAction: React.FC = () => {
  return (
    <section className='py-20 dark:bg-surface-a0-dark'>
      <div className='container mx-auto px-4 text-center'>
        <h2 className={`text-4xl font-bold mb-6 ${TextTertiaryColor}`}>
          Ready to Start Your Survivor Fantasy Journey?
        </h2>
        <p className={`text-xl mb-8 max-w-2xl mx-auto ${TextPrimaryColor}`}>
          Join Survivor fans competing for glory. Create your team and prove
          your strategic prowess!
        </p>
        <Link
          to='/register'
          className={`inline-block px-8 py-4 ${ButtonPrimaryColors} font-bold rounded-lg 
           transition-colors text-lg`}>
          Start Your Team Today!
        </Link>
      </div>
    </section>
  );
};

export default CallToAction;
