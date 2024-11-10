import { SurvivorDetails } from "../../types/survivorTypes";
import SurvivorCard from "./SurvivorCard";

const SurvivorCardList: React.FC<{ survivors: SurvivorDetails[] }> = ({ survivors }) => {
    return (
      <div className="flex flex-wrap justify-center">
        {survivors.map((survivor) => (
          <div key={survivor.survivorId} className="transform transition-transform duration-300 hover:scale-105">
            <SurvivorCard survivor={survivor} />
          </div>
        ))}
      </div>
    );
  };

export default SurvivorCardList;