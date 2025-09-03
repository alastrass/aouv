export interface PaymentPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  type: 'lifetime' | 'subscription' | 'content-pack';
  interval?: 'week' | 'month' | 'year';
  features: string[];
}

export interface ContentPack {
  id: string;
  name: string;
  theme: string;
  description: string;
  price: number;
  currency: string;
  questionsCount: number;
  truthsCount: number;
  difficulty: 'soft' | 'intense' | 'extreme';
  preview: string[];
  isPurchased: boolean;
  isLocked: boolean;
}

export interface UserSubscription {
  id: string;
  planId: string;
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  startDate: string;
  endDate?: string;
  nextBillingDate?: string;
  paypalSubscriptionId?: string;
}

export interface UserPurchase {
  id: string;
  userId: string;
  itemId: string;
  itemType: 'lifetime' | 'content-pack';
  purchaseDate: string;
  amount: number;
  currency: string;
  paypalOrderId: string;
  status: 'completed' | 'pending' | 'failed' | 'refunded';
}

export interface PaymentState {
  isLoading: boolean;
  error: string | null;
  subscription: UserSubscription | null;
  purchases: UserPurchase[];
  availableContentPacks: ContentPack[];
}
