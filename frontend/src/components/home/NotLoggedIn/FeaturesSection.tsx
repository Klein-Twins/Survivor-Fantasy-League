import { FaFire, FaUsers, FaChartBar } from 'react-icons/fa';

export default function FeaturesSection() {
  const features = [
    {
      icon: <FaChartBar className='text-orange-500 w-10 h-10' />,
      title: 'Real-Time Scoring & Updates',
      description: 'Stay updated with how your team is performing as the game unfolds.',
    },
    {
      icon: <FaFire className='text-red-500 w-10 h-10' />,
      title: 'Easy-to-Use Interface',
      description: 'Manage your team effortlessly with an intuitive design that simplifies everything.',
    },
    {
      icon: <FaUsers className='text-blue-500 w-10 h-10' />,
      title: 'Compete with Friends',
      description: 'Create private leagues or join public ones to compete with Survivor enthusiasts.',
    },
  ];

  return (
    <section className='py-10 container mx-auto'>
      <div className='max-w-6xl mx-auto px-4'>
        <h2 className='text-3xl font-bold text-center text-primary-a0 mb-6'>Why Play Survivor Fantasy League?</h2>
        <div className='grid md:grid-cols-3 gap-6'>
          {features.map((feature, index) => (
            <div
              key={index}
              className='shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300 dark:bg-surface-a2-dark p-6'>
              <div className='flex items-center justify-center mb-4'>{feature.icon}</div>
              <h3 className='text-xl font-semibold dark:text-primary-a1-dark'>{feature.title}</h3>
              <p className='text-sm dark:text-primary-a3-dark mt-2'>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
