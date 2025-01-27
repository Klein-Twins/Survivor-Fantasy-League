import { FaUsers, FaChartLine, FaTrophy } from 'react-icons/fa';

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <FaUsers className='text-4xl' />,
      title: 'Create Your Team',
      description:
        'Pick your favorite Survivor players and form your dream team. Choose wisely - your strategy matters!',
    },
    {
      icon: <FaChartLine className='text-4xl' />,
      title: 'Track the Game',
      description:
        "Follow your team's progress through weekly updates. Make strategic decisions based on real-time performance.",
    },
    {
      icon: <FaTrophy className='text-4xl' />,
      title: 'Compete with Others',
      description: "Challenge other players, climb the leaderboard, and prove you're the ultimate Survivor strategist!",
    },
  ];

  return (
    <div className='bg-surface-a1-dark py-16'>
      <div className='container mx-auto px-4'>
        <h2 className='text-3xl md:text-4xl font-bold text-center mb-12 dark:text-primary-a2-dark'>How It Works</h2>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {steps.map((step, index) => (
            <div
              key={index}
              className='flex flex-col items-center text-center p-6 space-y-4 
                rounded-lg dark:bg-surface-a2-dark hover:transform hover:scale-105 
                transition-all duration-300 dark:text-primary-a0-dark'>
              <div className='p-4 rounded-full dark:bg-primary-a3-dark/10 dark:text-primary-a3-dark'>{step.icon}</div>
              <h3 className='text-xl font-bold dark:text-primary-a2-dark'>{step.title}</h3>
              <p className='text-sm'>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
