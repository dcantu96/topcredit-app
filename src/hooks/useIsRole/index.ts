import { useRecoilValue } from "recoil"
import { Role } from "../../schema.types"
import { myProfileState } from "components/providers/auth/atoms"

const useIsRole = (role: Role) => {
  const user = useRecoilValue(myProfileState)
  return !!user?.roles.includes(role)
}

export default useIsRole
