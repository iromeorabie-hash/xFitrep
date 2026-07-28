export interface Subscription {
  plan: "Basic" | "Premium" | "Elite" | "Custom" | "None";
  activatedAt: string | null;
  expiresAt: string | null;
  durationDays: number;
}

export interface SubscriptionRequest {
  plan: "Basic" | "Premium" | "Elite" | "Custom";
  paymentRef: string;
  notes?: string;
  submittedAt: string;
}

export interface Meal {
  id: string;
  type: "Breakfast" | "Lunch" | "Dinner" | "Snack";
  title: string;
  titleAr?: string;
  description: string;
  descriptionAr?: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  ingredients: string[];
  ingredientsAr?: string[];
  instructions: string;
  instructionsAr?: string;
}

export interface DietPlan {
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFats: number;
  summary: string;
  summaryAr?: string;
  dietaryNotes: string;
  dietaryNotesAr?: string;
  meals: Meal[];
  generatedAt: string;
}

export interface CustomerProfile {
  profilePicture?: string;
  age?: number;
  height?: number; // cm
  weight?: number; // kg
  fitnessGoal?: "Weight Loss" | "Weight Gain" | "Muscle Building" | "Maintenance";
  activityLevel?: "Sedentary" | "Lightly Active" | "Moderately Active" | "Very Active";
  cuisine?: "Egyptian" | "Middle Eastern" | "Western" | "Mediterranean" | "Asian" | "International";
  budgetLevel?: "Low / Budget-Friendly" | "Medium / Balanced" | "High / Premium";
  healthConditions?: string[];
  allergies?: string[];
  foodPreferences?: string[];
  dislikedFoods?: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  password?: string; // Hidden on client outputs if needed, but preserved in mock DB
  status: "pending" | "approved" | "rejected";
  subscription: Subscription;
  favorites: string[]; // Video IDs
  favoriteCategories?: Record<string, string>; // Video ID -> Workout Routine Category
  createdAt: string;
  subscriptionRequest?: SubscriptionRequest;
  profile?: CustomerProfile;
  dietPlan?: DietPlan;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  categoryId: string; // References Category.id
  url: string; // YouTube, Vimeo, or direct MP4 URL
  duration: number; // in minutes
  views: number;
  thumbnail?: string;
  trainer: string;
  createdAt: string;
}

export interface AppStats {
  activeMembers: number;
  totalViews: number;
}
