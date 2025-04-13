import { useMemo } from 'react';

interface UsePickOptionsProps<T> {
  pickId: string;
  minNumSelections: number;
  maxNumSelections: number;
  playerChoices: Map<string, T[]>;
  setPlayerChoices: React.Dispatch<React.SetStateAction<Map<string, T[]>>>;
}

const usePickOptions = <T,>({
  pickId,
  minNumSelections,
  maxNumSelections,
  playerChoices,
  setPlayerChoices,
}: UsePickOptionsProps<T>) => {
  const selectedItems = useMemo(
    () => playerChoices.get(pickId) || [],
    [playerChoices, pickId]
  );

  const handleOptionClick = (item: T, getId: (item: T) => string) => {
    setPlayerChoices((prev) => {
      const updatedChoices = new Map(prev);
      const currentChoices = updatedChoices.get(pickId) || [];
      const itemId = getId(item);

      if (currentChoices.some((choice) => getId(choice) === itemId)) {
        // Remove the item if it is already selected
        updatedChoices.set(
          pickId,
          currentChoices.filter((choice) => getId(choice) !== itemId)
        );
      } else {
        // Add the item if it is not already selected
        if (currentChoices.length < maxNumSelections) {
          updatedChoices.set(pickId, [...currentChoices, item]);
        } else {
          // Remove the first item and add the new item
          const updatedSelection = [...currentChoices.slice(1), item];
          updatedChoices.set(pickId, updatedSelection);
        }
      }

      return updatedChoices;
    });
  };

  const isCompleted =
    selectedItems.length >= minNumSelections &&
    selectedItems.length <= maxNumSelections;

  return {
    selectedItems,
    handleOptionClick,
    isCompleted,
  };
};

export default usePickOptions;
