import React, { useEffect } from 'react';
import SeasonList from '../components/admin/SeasonList';
import SeasonPanel from '../components/admin/SeasonPanel';
import { useDispatch } from 'react-redux';
import { getSeasons } from '../store/slices/seasonSlice';
import { AppDispatch } from '../store/store';

const AdminPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getSeasons());
  }, [dispatch]);

  return (
    <div className='container mx-auto pt-2 text-center'>
      <SeasonPanel />
    </div>
  );
};

export default AdminPage;
