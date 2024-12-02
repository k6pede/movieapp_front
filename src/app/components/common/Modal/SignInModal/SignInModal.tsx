import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@nextui-org/modal'
import { Button, Divider } from '@nextui-org/react'
import { FcGoogle } from 'react-icons/fc'
import { FaMicrosoft } from 'react-icons/fa'
import { useAuth } from '@/hooks/user'

interface SignInModalProps {
  isOpen: boolean
  onOpenChange: () => void
  onClose: () => void
}
export function SignInModal({ isOpen, onOpenChange, onClose }: SignInModalProps) {
  const { login, isPending } = useAuth()
  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      onClose={onClose}
      size="2xl"
      placement="center"
    >
      <ModalContent>
        <ModalHeader>
          <div>GoogleかMicrosoftでログインができます</div>
        </ModalHeader>
        <Divider />
        <ModalBody>
          <Button
            color="primary"
            startContent={<FcGoogle />}
            onClick={() => login('google').then((isSuccess) => isSuccess && onClose())}
          >
            Googleでログインする
          </Button>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>閉じる</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
