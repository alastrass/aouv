import { useState, useEffect } from 'react';
import { PaymentState, UserPurchase, UserSubscription, ContentPack } from '../types/payment';

// PayPal SDK types
declare global {
  interface Window {
    paypal?: any;
  }
}

export const usePayPal = () => {
  const [paymentState, setPaymentState] = useState<PaymentState>({
    isLoading: false,
    error: null,
    subscription: null,
    purchases: [],
    availableContentPacks: []
  });

  const [isSDKLoaded, setIsSDKLoaded] = useState(false);

  // Load PayPal SDK
  useEffect(() => {
    const loadPayPalSDK = () => {
      if (window.paypal) {
        setIsSDKLoaded(true);
        return;
      }

      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=EUR&intent=capture&vault=true&components=buttons,marks`;
      script.async = true;
      script.onload = () => setIsSDKLoaded(true);
      script.onerror = () => {
        setPaymentState(prev => ({
          ...prev,
          error: 'Erreur lors du chargement de PayPal'
        }));
      };
      document.body.appendChild(script);
    };

    loadPayPalSDK();
  }, []);

  // Create PayPal order for one-time purchase
  const createOrder = async (amount: number, currency: string = 'EUR', description: string) => {
    try {
      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          description
        }),
      });

      const data = await response.json();
      return data.orderID;
    } catch (error) {
      console.error('Error creating PayPal order:', error);
      throw error;
    }
  };

  // Capture PayPal payment
  const captureOrder = async (orderID: string) => {
    try {
      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderID }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error capturing PayPal order:', error);
      throw error;
    }
  };

  // Create PayPal subscription
  const createSubscription = async (planId: string) => {
    try {
      const response = await fetch('/api/paypal/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      });

      const data = await response.json();
      return data.subscriptionID;
    } catch (error) {
      console.error('Error creating PayPal subscription:', error);
      throw error;
    }
  };

  // Purchase content pack
  const purchaseContentPack = async (packId: string, amount: number) => {
    setPaymentState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const orderID = await createOrder(amount, 'EUR', `Content Pack: ${packId}`);
      
      return new Promise((resolve, reject) => {
        window.paypal.Buttons({
          createOrder: () => orderID,
          onApprove: async (data: any) => {
            try {
              const captureData = await captureOrder(data.orderID);
              
              // Update local state
              const newPurchase: UserPurchase = {
                id: Date.now().toString(),
                userId: 'current-user', // Replace with actual user ID
                itemId: packId,
                itemType: 'content-pack',
                purchaseDate: new Date().toISOString(),
                amount,
                currency: 'EUR',
                paypalOrderId: data.orderID,
                status: 'completed'
              };

              setPaymentState(prev => ({
                ...prev,
                purchases: [...prev.purchases, newPurchase],
                isLoading: false
              }));

              // Unlock content pack
              unlockContentPack(packId);
              
              resolve(captureData);
            } catch (error) {
              setPaymentState(prev => ({
                ...prev,
                error: 'Erreur lors de la finalisation du paiement',
                isLoading: false
              }));
              reject(error);
            }
          },
          onError: (err: any) => {
            setPaymentState(prev => ({
              ...prev,
              error: 'Erreur lors du paiement PayPal',
              isLoading: false
            }));
            reject(err);
          }
        }).render('#paypal-button-container');
      });
    } catch (error) {
      setPaymentState(prev => ({
        ...prev,
        error: 'Erreur lors de la création de la commande',
        isLoading: false
      }));
      throw error;
    }
  };

  // Purchase lifetime access
  const purchaseLifetimeAccess = async (amount: number) => {
    setPaymentState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const orderID = await createOrder(amount, 'EUR', 'Lifetime Premium Access');
      
      return new Promise((resolve, reject) => {
        window.paypal.Buttons({
          createOrder: () => orderID,
          onApprove: async (data: any) => {
            try {
              const captureData = await captureOrder(data.orderID);
              
              const newPurchase: UserPurchase = {
                id: Date.now().toString(),
                userId: 'current-user',
                itemId: 'lifetime-premium',
                itemType: 'lifetime',
                purchaseDate: new Date().toISOString(),
                amount,
                currency: 'EUR',
                paypalOrderId: data.orderID,
                status: 'completed'
              };

              setPaymentState(prev => ({
                ...prev,
                purchases: [...prev.purchases, newPurchase],
                isLoading: false
              }));

              // Unlock all content
              unlockAllContent();
              
              resolve(captureData);
            } catch (error) {
              setPaymentState(prev => ({
                ...prev,
                error: 'Erreur lors de la finalisation du paiement',
                isLoading: false
              }));
              reject(error);
            }
          },
          onError: (err: any) => {
            setPaymentState(prev => ({
              ...prev,
              error: 'Erreur lors du paiement PayPal',
              isLoading: false
            }));
            reject(err);
          }
        }).render('#paypal-button-container');
      });
    } catch (error) {
      setPaymentState(prev => ({
        ...prev,
        error: 'Erreur lors de la création de la commande',
        isLoading: false
      }));
      throw error;
    }
  };

  // Subscribe to weekly premium
  const subscribeWeeklyPremium = async (planId: string) => {
    setPaymentState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const subscriptionID = await createSubscription(planId);
      
      return new Promise((resolve, reject) => {
        window.paypal.Buttons({
          createSubscription: () => subscriptionID,
          onApprove: async (data: any) => {
            try {
              const newSubscription: UserSubscription = {
                id: Date.now().toString(),
                planId,
                status: 'active',
                startDate: new Date().toISOString(),
                nextBillingDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                paypalSubscriptionId: data.subscriptionID
              };

              setPaymentState(prev => ({
                ...prev,
                subscription: newSubscription,
                isLoading: false
              }));

              resolve(data);
            } catch (error) {
              setPaymentState(prev => ({
                ...prev,
                error: 'Erreur lors de l\'activation de l\'abonnement',
                isLoading: false
              }));
              reject(error);
            }
          },
          onError: (err: any) => {
            setPaymentState(prev => ({
              ...prev,
              error: 'Erreur lors de l\'abonnement PayPal',
              isLoading: false
            }));
            reject(err);
          }
        }).render('#paypal-subscription-container');
      });
    } catch (error) {
      setPaymentState(prev => ({
        ...prev,
        error: 'Erreur lors de la création de l\'abonnement',
        isLoading: false
      }));
      throw error;
    }
  };

  // Unlock content pack
  const unlockContentPack = (packId: string) => {
    // Store in localStorage for persistence
    const unlockedPacks = JSON.parse(localStorage.getItem('unlockedContentPacks') || '[]');
    if (!unlockedPacks.includes(packId)) {
      unlockedPacks.push(packId);
      localStorage.setItem('unlockedContentPacks', JSON.stringify(unlockedPacks));
    }
  };

  // Unlock all content
  const unlockAllContent = () => {
    localStorage.setItem('hasLifetimeAccess', 'true');
    localStorage.setItem('lifetimePurchaseDate', new Date().toISOString());
  };

  // Check if user has lifetime access
  const hasLifetimeAccess = () => {
    return localStorage.getItem('hasLifetimeAccess') === 'true';
  };

  // Check if content pack is unlocked
  const isContentPackUnlocked = (packId: string) => {
    if (hasLifetimeAccess()) return true;
    const unlockedPacks = JSON.parse(localStorage.getItem('unlockedContentPacks') || '[]');
    return unlockedPacks.includes(packId);
  };

  // Cancel subscription
  const cancelSubscription = async (subscriptionId: string) => {
    try {
      const response = await fetch('/api/paypal/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subscriptionId }),
      });

      if (response.ok) {
        setPaymentState(prev => ({
          ...prev,
          subscription: prev.subscription ? {
            ...prev.subscription,
            status: 'cancelled'
          } : null
        }));
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      setPaymentState(prev => ({
        ...prev,
        error: 'Erreur lors de l\'annulation de l\'abonnement'
      }));
    }
  };

  return {
    paymentState,
    isSDKLoaded,
    purchaseContentPack,
    purchaseLifetimeAccess,
    subscribeWeeklyPremium,
    cancelSubscription,
    hasLifetimeAccess,
    isContentPackUnlocked,
    unlockContentPack,
    unlockAllContent
  };
};
