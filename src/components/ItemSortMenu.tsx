import { Select } from 'antd';

interface ItemSortMenuProps {
  onSortChange: (value: string) => void;
}

const ItemSortMenu = ({ onSortChange }: ItemSortMenuProps) => {
  const handleSortSelect = (value: string) => {
    onSortChange(value);
  };

  return (
    <Select
      defaultValue="정렬순"
      onChange={handleSortSelect}
      options={[
        {
          value: 'Accuracy',
          label: 'Accuracy'
        },
        {
          value: 'Title',
          label: 'Title'
        },
        {
          value: 'PublishTime',
          label: 'PublishTime'
        }
      ]}
    />
  );
};

export default ItemSortMenu;