export interface UserProfile {
  uid: string
  name: string
  bio: string
  avatarUrl: string
  role: "user" | "admin"
  preferences: {
    theme: "light" | "dark"
  }
  createdAt: Date
}
