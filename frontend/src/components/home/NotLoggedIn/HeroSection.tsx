import { Link } from 'react-router-dom';
const HeroSection: React.FC = () => {
  return (
    <div className=' dark:from-surface-a0-dark'>
      <div className='container mx-auto px-4 py-16'>
        {/* Hero Section */}
        <div className='flex flex-col-reverse lg:flex-row items-center justify-between gap-12'>
          {/* Left Content */}
          <div className='flex-1 space-y-8 text-center lg:text-left'>
            <h1 className='text-4xl md:text-5xl lg:text-6xl font-bold dark:text-primary-a2-dark'>
              Where Strategy Meets
              <span className='block text-primary-a3-dark'>Survivor Fantasy</span>
            </h1>

            <p className='text-lg md:text-xl dark:text-primary-a0-dark max-w-2xl'>
              Join the ultimate fantasy league for Survivor fans. Create your team, track the game, and compete against
              others to see who has the best strategy!
            </p>

            <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
              <Link
                to='/register'
                className='px-8 py-3 bg-primary-a3-dark text-white font-bold rounded-lg 
            hover:bg-primary-a2-dark transition-colors text-lg text-center'>
                Start Your Journey
              </Link>
              <Link
                to='/about'
                className='px-8 py-3 border-2 border-primary-a3-dark dark:text-primary-a3-dark 
            font-bold rounded-lg hover:bg-primary-a3-dark hover:text-white 
            transition-colors text-lg text-center'>
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Content - Image */}
          <div className='flex-1 relative'>
            <img
              src='/SFLLogoDark.jpeg'
              alt='Survivor Fantasy League'
              className='w-full max-w-lg mx-auto rounded-lg shadow-2xl'
            />
            <div
              className='absolute -z-10 top-0 right-0 w-72 h-72 bg-primary-a3-dark/20 
        rounded-full filter blur-3xl'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
