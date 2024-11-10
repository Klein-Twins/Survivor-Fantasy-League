import { useDispatch } from "react-redux";
import { SurvivorDetails } from "../../types/survivorTypes";
import SurvivorCard from "./SurvivorCard";
import { openModal } from "../../store/slices/modalSlice";

const SurvivorCardList: React.FC<{ survivors: SurvivorDetails[] }> = ({ survivors }) => {

    const dispatch = useDispatch();

    const handleSurvivorCardClick = (survivor: SurvivorDetails) => {
      dispatch(openModal({type: 'survivorDetail', props: {survivor: survivor}}))
    }

    return (
      <div className="flex flex-wrap justify-center">
        {survivors.map((survivor) => (
          <div key={survivor.survivorId} onClick={() => handleSurvivorCardClick(survivor)} className="transform transition-transform duration-300 hover:scale-105">
            <SurvivorCard survivor={survivor} />
          </div>
        ))}
      </div>
    );
  };

export default SurvivorCardList;