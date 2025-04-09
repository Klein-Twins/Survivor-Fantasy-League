import { useState } from 'react';

export function usePickOptions<T>(
  minNumSelections: number,
  maxNumSelections: number
) {
  const [selectedItems, setSelectedItems] = useState<T[]>([]);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  function handleOptionClick(item: T, getItemId: (item: T) => string) {
    setSelectedItems((prevSelected) => {
      if (prevSelected.some((i) => getItemId(i) === getItemId(item))) {
        // If already selected, remove it
        return prevSelected.filter((i) => getItemId(i) !== getItemId(item));
      } else if (prevSelected.length < maxNumSelections) {
        // If not selected and within max limit, add it
        return [...prevSelected, item];
      } else {
        // If max limit is exceeded, remove the oldest selection and add the new one
        const [, ...remaining] = prevSelected; // Remove the first (oldest) selection
        return [...remaining, item];
      }
    });

    if (
      selectedItems.length >= minNumSelections &&
      selectedItems.length <= maxNumSelections
    ) {
      setIsCompleted(true); // Set completed state to true
    } else {
      setIsCompleted(false); // Reset completed state
    }
  }

  return { selectedItems, handleOptionClick, isCompleted };
}
