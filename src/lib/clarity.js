import Clarity from '@microsoft/clarity'

export const initClarity = (
  projectId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID || 'y25638ax6l'
) => {
  if (typeof window !== 'undefined' && projectId) {
    Clarity.init(projectId)
  }
}

export { Clarity }
export default Clarity
