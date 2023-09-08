import { Modal } from './modal';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  idProp: string
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, isLoading, idProp }) => {

  const [id, setId] = useState('')

  useEffect(() => {
    if(isOpen) {
      setId(idProp)
    }
  }, [idProp, isOpen])
  console.log(id)

  return (
    <Modal 
      title='Are you sure?'
      description='This action cannot be undone'
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className='pt-6 space-x-2 flex justify-end items-center w-full'>
        <Button disabled={isLoading} onClick={onClose} variant={"outline"}>
          Cancel
        </Button>
        <Button variant={'destructive'} disabled={isLoading} onClick={onConfirm}>
          Delete
        </Button>
      </div>
    </Modal>
  )
}

export default DeleteModal
