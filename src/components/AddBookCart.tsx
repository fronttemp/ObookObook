import React, { useState } from 'react';
import { useCartStore } from '../store/useCartStore';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from './ConfirmModal';

interface Book {
  title: string;
  isbn: string;
  priceStandard: number;
  id: string;
  cover: string;
}

interface CartStore {
  bookCart: Book[];
  addBookCart: (book: Book) => void; // Promise<void>를 사용하는 이유는 addBookCart가 비동기 함수이기 때문.
}

interface Props {
  book: Book;
}

const AddBookCart: React.FC<Props> = ({ book }) => {
  const { bookCart, addBookCart } = useCartStore() as CartStore
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [showCancel, setShowCancel] = useState(true);
  const navigate = useNavigate();

  const handleAddToCart = async () => {
    if (
      bookCart.some(
        b => b.title === book.title && b.isbn === book.isbn
      )
    ) {
      setModalContent('이미 장바구니에 등록된 상품입니다.');
      setShowCancel(false);
      setIsModalVisible(true);
    } else {
      await addBookCart(book);
      setModalContent('상품이 장바구니에 담겼습니다. 장바구니로 이동하시겠습니까?');
      setShowCancel(true);
      setIsModalVisible(true);
    }
  }

  const onConfirm = (confirm: boolean) => {
    setIsModalVisible(false);
    if (confirm && modalContent !== '이미 장바구니에 등록된 상품입니다.') {
      navigate('/Cart');
    }
  }

  return (
    <>
      <Button onClick={handleAddToCart}>장바구니 추가</Button>
      <div>
        <ConfirmModal
          content={modalContent}
          onConfirm={onConfirm}
          open={isModalVisible}
          setConfirmVisible={setIsModalVisible}
          showCancelButton={showCancel}
        />
      </div>
    </>
  );
}

export default AddBookCart;