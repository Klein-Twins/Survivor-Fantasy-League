import React from 'react';

interface NotificationProps {
  title?: string;
  description?: string;
}

const Notification: React.FC<NotificationProps> = ({ title, description }) => {
  return (
    <div className='flex flex-col space-y-8'>
        <h2 className='text-center'>{title}</h2>
        <p className='text-center'>{description}</p>
    </div>
  );
}

export default Notification;