
// Firebase de-activated for static mode
export const db = {};
export const storage = {};
// Fixed: Expanded mock auth to satisfy Firebase Auth type requirements and usage in AdminDashboard
export const auth: any = {
  currentUser: null,
  useDeviceLanguage: () => {},
  onAuthStateChanged: () => () => {},
  app: {
    options: {
      projectId: 'mobilehub-static-project'
    }
  },
  name: 'mock-auth',
  config: {}
};
export default {};
