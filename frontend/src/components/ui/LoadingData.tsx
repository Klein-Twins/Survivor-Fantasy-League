import { FaSpinner } from 'react-icons/fa';

interface LoadingDataProps {
  text?: string;
  textColor?: string;
}

const LoadingData: React.FC<LoadingDataProps> = ({
  text,
  textColor = 'dark:text-primary-a1-dark text-primary-a1-light',
}) => {
  return (
    <div className={`flex flex-col items-center space-y-2 justify-center`}>
      {text && <p className={`text-lg font-semibold ${textColor}`}>{text}</p>}
      <FaSpinner className='animate-spin-slow text-4xl' />
    </div>
  );
};

export default LoadingData;
