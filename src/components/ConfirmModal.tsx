import { Button, Modal } from 'antd'

type ModalCancelOkProps = {
  content: React.ReactNode;
  onConfirm: (confirm: boolean) => void;
  open: boolean;
  setConfirmVisible: (visible: boolean) => void;
  showCancelButton?: boolean;
};

const ModalCancelOk: React.FC<ModalCancelOkProps>= ({content, onConfirm, open, setConfirmVisible, showCancelButton = true}) => {
  
  const handleCancel = () => {
    setConfirmVisible(false)
  }

  const handleConfirm = () => {
    setConfirmVisible(false)
    onConfirm(true)
  }

  return (
    <div>
      <Modal
        open={open}
        centered
        bodyStyle={{ textAlign: 'center' }}
        onOk={handleConfirm}
        onCancel={handleCancel}
        closable={false}
        maskClosable={false}
        width={280}
        footer={
          <div style={{ textAlign: 'center' }}>
            {showCancelButton && 
              <Button
                key="cancel"
                onClick={handleCancel}
                style={{ marginRight: '0.5em' }}>
                취소
              </Button>
            }
            <Button
              key="ok"
              type="primary"
              onClick={handleConfirm}
              style={{ marginLeft: '0.5em' }}>
              확인
            </Button>
          </div>
        }>
        <p>
          <b>
            {content}
          </b>
        </p>
      </Modal>
    </div>
  )
}

export default ModalCancelOk
