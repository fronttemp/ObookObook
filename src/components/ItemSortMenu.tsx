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
          value: '관련순',
          lavel: 'Accuracy'
        },
        {
          value: '제목순',
          lavel: 'Title'
        },
        {
          value: '최신순',
          lavel: 'PublishTime'
        }
      ]}
      />
  )
}

export default ItemSortMenu