import {
  SurveyAvailabilityStatus,
  SurveySubmissionStatus,
} from '../../../../generated-api';

interface SurveyStatusViewProps {
  openDate: Date;
  dueDate: Date;
  submissionStatus: SurveySubmissionStatus;
  availabilityStatus: SurveyAvailabilityStatus;
}

const SurveyStatusView: React.FC<SurveyStatusViewProps> = ({
  openDate,
  dueDate,
  submissionStatus,
  availabilityStatus,
}) => {
  const colors = 'dark:text-white text-black';

  return (
    <div className={`w-full p-6 space-y-4 ${colors}`}>
      <h2 className='text-2xl font-bold text-center'>Status</h2>
      <div className='flex justify-between'>
        <div id='open-and-due-date'>
          <div id='open-date'>
            <p className='text-sm'>Open Date</p>
            <p className='text-lg font-medium'>
              {openDate.toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              })}
            </p>
          </div>
          <div id='due-date'>
            <p className='text-sm'>Due Date</p>
            <p className='text-lg font-medium'>
              {dueDate.toLocaleDateString('en-US', {
                month: 'short',
                day: '2-digit',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
        <div id='status'>
          <div id='submission-status'>
            <p className='text-sm'>Submission Status</p>
            <p
              className={`text-lg font-medium ${
                submissionStatus === 'Submitted'
                  ? 'dark:text-green-300 text-green-300'
                  : 'text-red-700'
              }`}>
              {submissionStatus}
            </p>
          </div>
          <div id='availability-status'>
            <p className='text-sm'>Availability Status</p>
            <p
              className={`text-lg font-medium ${
                availabilityStatus === 'Available'
                  ? 'dark:text-green-300 text-green-300'
                  : 'text-red-700'
              }`}>
              {availabilityStatus}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyStatusView;
