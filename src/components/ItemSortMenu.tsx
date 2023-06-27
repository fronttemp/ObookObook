import {Select} from 'antd'

const ItemSortMenu = ( {onSortChange} ) => {
  const handleSortSelect  = (value) => {
    onSortChange(value)
  }

  return (
    <Select 
      defaultValue= '관련순'
      onChange = {handleSortSelect}
      options = {[
        {
          value: 'Accuracy',
          lavel: 'Accuracy'
        },
        {
          value: 'Title',
          lavel: 'Title'
        },
        {
          value: 'PublishTime',
          lavel: 'PublishTime'
        }
      ]}
      />
  )
}

export default ItemSortMenu