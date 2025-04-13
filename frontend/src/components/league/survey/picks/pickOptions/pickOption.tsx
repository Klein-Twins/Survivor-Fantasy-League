interface PickOptionProps<T> {
  item: T;
  onClick: () => void;
  isSelected: boolean;
  renderContent: (item: T) => React.ReactNode;
}

function PickOption<T>({
  item,
  onClick,
  isSelected,
  renderContent,
}: PickOptionProps<T>) {
  const optionBackground = isSelected
    ? 'dark:bg-primary bg-surface-a3-light font-bold'
    : 'dark:bg-surface-a1-dark bg-surface-a1-light';

  return (
    <div
      className={`flex flex-col items-center space-y-1 rounded-md p-2 ${optionBackground}`}
      onClick={onClick}>
      {renderContent(item)}
    </div>
  );
}

export default PickOption;
