interface TagSearchMenuProps {
  onTagClick: (value: string) => void;
}

const TagSearchMenu = ({ onTagClick }: TagSearchMenuProps) => {
  const handleClick = (value: string) => {
    onTagClick(value);
  };

  return (
    <ul className='drop-list'>
      <li className='drop-list__item'>
        <button className='drop-list__link' onClick={() => handleClick('0')} value='0'>
          전체
        </button>
      </li>
      <li className='drop-list__item'>
        <button className='drop-list__link' onClick={() => handleClick('38396')} value='38396'>
          소설/시/희곡
        </button>
      </li>
      <li className='drop-list__item'>
        <button className='drop-list__link' onClick={() => handleClick('38403')} value='38403'>
          인문학
        </button>
      </li>
      <li className='drop-list__item'>
        <button className='drop-list__link' onClick={() => handleClick('38400')} value='38400'>
          자기계발
        </button>
      </li>
      <li className='drop-list__item'>
        <button className='drop-list__link' onClick={() => handleClick('38398')} value='38398'>
          경제경영
        </button>
      </li>
      <li className='drop-list__item'>
        <button className='drop-list__link' onClick={() => handleClick('38404')} value='38404'>
          사회과학
        </button>
      </li>
      <li className='drop-list__item'>
        <button className='drop-list__link' onClick={() => handleClick('38416')} value='38416'>
          만화
        </button>
      </li>
    </ul>
  );
};

export default TagSearchMenu;