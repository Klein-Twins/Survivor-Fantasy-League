import React from 'react';
import SeasonList from '../components/admin/SeasonList';
import SeasonPanel from '../components/admin/SeasonPanel';

const AdminPage: React.FC = () => {
  return (
    <div className='container mx-auto pt-2 text-center'>
      <SeasonPanel />
    </div>
  );
};

export default AdminPage;
