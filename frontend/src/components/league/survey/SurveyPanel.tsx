import React, { useState } from 'react';
import { Episode, League, Profile } from '../../../../generated-api';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import Survey from './Survey';

import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.css';

import './SurveyPanel.css';
import { NavigationOptions } from 'swiper/types';
import EpisodeSwiper from './EpisodeSwiper';

interface SurveyPanelProps {
  leagueId: League['id'];
  profileId: Profile['profileId'];
}

const SurveyPanel: React.FC<SurveyPanelProps> = ({ leagueId, profileId }) => {
  const currentSeason = useSelector(
    (state: RootState) => state.season.selectedSeason
  );
  const activeEpisode = useSelector(
    (state: RootState) => state.season.activeEpisode || null
  );

  const initialEpisodeOnPageLoad: Episode | null =
    activeEpisode || currentSeason.episodes.length > 1
      ? currentSeason.episodes[currentSeason.episodes.length - 1]
      : null;

  const [selectedEpisode, setSelectedEpisode] = useState<Episode>(
    initialEpisodeOnPageLoad
  );

  const panelBackgroundColor =
    'dark:bg-surface-a5-dark bg-surface-a5-light dark:text-white text-black';

  return (
    <div
      className={`flex flex-col w-full justify-center ${panelBackgroundColor} p-2 rounded-md`}>
      <h1 className='text-center text-4xl font-bold py-2'>Your Surveys</h1>
      <EpisodeSwiper
        episodes={currentSeason.episodes}
        selectedEpisode={selectedEpisode}
        onSelect={setSelectedEpisode}
      />
      <Survey
        leagueId={leagueId}
        profileId={profileId}
        activeEpisode={selectedEpisode}
      />
    </div>
  );
};

export default SurveyPanel;

// interface EpisodeSelectionProps {
//   episodes: Episode[];
//   selectedEpisode: Episode;
//   onSelect: (episode: Episode) => void;
// }
// const EpisodeSelection: React.FC<EpisodeSelectionProps> = ({
//   episodes,
//   selectedEpisode,
//   onSelect,
// }) => {
//   const prevRef = React.useRef<HTMLDivElement>(null);
//   const nextRef = React.useRef<HTMLDivElement>(null);
//   const [swiperInstance, setSwiperInstance] = React.useState<any>(null);
//   const [slidesReady, setSlidesReady] = React.useState(false); // Track if slides are ready

//   // Set the last episode as the selected episode on load
//   React.useEffect(() => {
//     if (episodes.length > 0) {
//       onSelect(episodes[episodes.length - 1]); // Select the last episode
//     }
//   }, [episodes, onSelect]);

//   // Calculate the initial slide index for Swiper
//   const initialSlideIndex = React.useMemo(() => {
//     if (episodes.length > 0) {
//       const lastEpisodeIndex = episodes.length - 1;
//       console.log('Initial Slide Index:', Math.floor(lastEpisodeIndex / 3)); // Assuming 3 slides per view
//       return Math.floor(lastEpisodeIndex / 3); // Assuming 3 slides per view
//     }
//     return 0;
//   }, [episodes]);

//   // Initialize Swiper manually after it is created and slides are ready
//   React.useEffect(() => {
//     if (swiperInstance && slidesReady) {
//       console.log('Manually initializing Swiper...');
//       swiperInstance.init(); // Manually initialize Swiper
//       console.log('Swiper initialized:', swiperInstance);
//       console.log('Sliding to initial slide index:', initialSlideIndex);

//       // Ensure Swiper moves to the correct slide after initialization
//       swiperInstance.slideTo(initialSlideIndex, 0); // Move to the correct initial slide
//     }
//   }, [swiperInstance, slidesReady, initialSlideIndex]);

//   // Determine the index of the currently selected episode
//   const selectedIndex = episodes.findIndex(
//     (episode) => episode.id === selectedEpisode.id
//   );

//   // Determine if the selected episode is the first or last
//   const isFirstEpisode = selectedIndex === 0;
//   const isLastEpisode = selectedIndex === episodes.length - 1;

//   // Handle the "next" arrow click
//   const handleNext = () => {
//     if (isLastEpisode) return; // Do nothing if the last episode is selected

//     const nextIndex = selectedIndex + 1;

//     // If the next episode is on the next page, navigate to the next page
//     if (
//       swiperInstance &&
//       nextIndex % swiperInstance.params.slidesPerView === 0
//     ) {
//       swiperInstance.slideNext();
//     }

//     // Update the selected episode
//     onSelect(episodes[nextIndex]);
//   };

//   // Handle the "prev" arrow click
//   const handlePrev = () => {
//     if (isFirstEpisode) return; // Do nothing if the first episode is selected

//     const prevIndex = selectedIndex - 1;

//     // If the previous episode is on the previous page, navigate to the previous page
//     if (
//       swiperInstance &&
//       selectedIndex % swiperInstance.params.slidesPerView === 0
//     ) {
//       swiperInstance.slidePrev();
//     }

//     // Update the selected episode
//     onSelect(episodes[prevIndex]);
//   };

//   return (
//     <div
//       style={{
//         width: '100%',
//         maxWidth: '1024px',
//         margin: '0 auto',
//         display: 'flex',
//         alignItems: 'center',
//         position: 'relative',
//       }}>
//       {/* Left Arrow */}
//       <div
//         ref={prevRef}
//         onClick={handlePrev}
//         style={{
//           position: 'absolute',
//           left: '0',
//           top: '50%',
//           transform: 'translateY(-50%)',
//           display: isFirstEpisode ? 'none' : 'flex', // Hide if the first episode is selected
//           alignItems: 'center',
//           justifyContent: 'center',
//           backgroundColor: '#e5e7eb',
//           color: '#374151',
//           borderRadius: '50%',
//           width: '40px',
//           height: '40px',
//           cursor: 'pointer',
//           zIndex: 10,
//         }}>
//         &#8592;
//       </div>

//       {/* Swiper Component */}
//       <div style={{ width: '100%' }}>
//         <Swiper
//           onSwiper={(swiper) => {
//             console.log('Swiper Instance:', swiper);
//             console.log('Initial Slide Index:', swiper.params.initialSlide);
//             setSwiperInstance(swiper); // Save the Swiper instance
//           }}
//           onSlidesLengthChange={() => setSlidesReady(true)} // Mark slides as ready
//           modules={[Navigation, Pagination]}
//           spaceBetween={20}
//           slidesPerView={3}
//           slidesPerGroup={3}
//           initialSlide={initialSlideIndex} // Start Swiper at the correct page
//           pagination={{
//             clickable: true,
//           }}
//           style={{ width: '100%' }}>
//           {episodes.map((episode) => (
//             <SwiperSlide key={episode.id}>
//               <div
//                 onClick={() => onSelect(episode)}
//                 style={{
//                   padding: '8px 16px',
//                   backgroundColor:
//                     selectedEpisode.id === episode.id ? '#3b82f6' : '#d1d5db',
//                   color:
//                     selectedEpisode.id === episode.id ? '#ffffff' : '#000000',
//                   borderRadius: '8px',
//                   textAlign: 'center',
//                   cursor: 'pointer',
//                   width: '100%',
//                 }}>
//                 Episode {episode.number}
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>

//       {/* Right Arrow */}
//       <div
//         ref={nextRef}
//         onClick={handleNext}
//         style={{
//           position: 'absolute',
//           right: '0',
//           top: '50%',
//           transform: 'translateY(-50%)',
//           display: isLastEpisode ? 'none' : 'flex', // Hide if the last episode is selected
//           alignItems: 'center',
//           justifyContent: 'center',
//           backgroundColor: '#e5e7eb',
//           color: '#374151',
//           borderRadius: '50%',
//           width: '40px',
//           height: '40px',
//           cursor: 'pointer',
//           zIndex: 10,
//         }}>
//         &#8594;
//       </div>
//     </div>
//   );
// };
