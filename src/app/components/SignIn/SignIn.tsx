/** @は絶対パスインポート */
import { useDisclosure } from '@nextui-org/modal'
import { SignInModal } from '../common/Modal/SignInModal/SignInModal'
import { Button } from '@nextui-org/button'
import styles from './SignIn.module.scss'
import { useAuth } from '@/hooks/user'

export default function SignIn() {
  const { isOpen, onOpen: handleOpenAuthModal, onOpenChange, onClose } = useDisclosure()
  const { user } = useAuth()

  return (
    <>
      <div className={styles.buttonContainer}>
        <Button
          onClick={handleOpenAuthModal}
          radius="full"
          className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
          size="lg"
          fullWidth
        >
          Login
        </Button>
      </div>

      <div>{user?.name}</div>

      <SignInModal isOpen={isOpen} onClose={onClose} onOpenChange={onOpenChange} />
    </>
  )
}
