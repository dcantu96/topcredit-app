import Lottie from "react-lottie"
import animationData from "../../../assets/lotties/success-check.json"
import { motion } from "framer-motion"

const SuccessAnimation = ({ onCompleted }: { onCompleted: () => void }) => {
  return (
    <FullPageAnimationContainer>
      <Lottie
        isClickToPauseDisabled
        ariaLabel="Success animation"
        eventListeners={[{ eventName: "complete", callback: onCompleted }]}
        options={{
          loop: false,
          autoplay: true,
          animationData: animationData,
          rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
          },
        }}
        width={300}
        height={300}
      />
    </FullPageAnimationContainer>
  )
}

const FullPageAnimationContainer = ({
  children,
}: {
  children?: React.ReactNode
}) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      exit={{ opacity: 0 }}
    >
      {children}
    </motion.div>
  )
}

export default SuccessAnimation
