import { ButtonPrimaryColors } from '../../../styles/CommonColorClassNames';

function NoLeaguesMessage() {
  return (
    <div className='flex flex-col items-center justify-center text-center p-6'>
      <h2 className='text-2xl font-semibold mb-2'>
        You are not part of any leagues
      </h2>
      <p className='text-lg mb-4'>
        Join a league or create a new one to get started!
      </p>
      <button
        className={`${ButtonPrimaryColors} px-4 py-2 rounded-lg transition-colors`}>
        Create League
      </button>
    </div>
  );
}

export default NoLeaguesMessage;
