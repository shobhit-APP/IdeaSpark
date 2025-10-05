import * as React from 'react';
import { Alert, TouchableOpacityProps } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

interface FeatureGuardProps {
  feature: string;
  children: React.ReactElement<TouchableOpacityProps>;
  onAccessDenied?: () => void;
  showAlert?: boolean;
}

export function FeatureGuard({ 
  feature, 
  children, 
  onAccessDenied,
  showAlert = true 
}: FeatureGuardProps) {
  const { checkFeatureAccess, incrementUsage } = useAuth();
  
  const handleFeatureAccess = () => {
    const access = checkFeatureAccess(feature);
    
    if (!access.hasAccess) {
      if (showAlert) {
        Alert.alert(
          '🔒 Feature Locked',
          access.isLimited 
            ? `You've reached your daily limit for this feature. Upgrade to Premium for unlimited access!`
            : 'This feature requires Premium membership. Upgrade now to unlock!',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Upgrade to Premium', 
              onPress: onAccessDenied,
              style: 'default'
            },
          ]
        );
      }
      
      if (onAccessDenied) {
        onAccessDenied();
      }
      return false;
    }
    
    // If feature has limits, increment usage
    if (access.isLimited) {
      incrementUsage(feature);
    }
    
    return true;
  };

  const originalOnPress = children.props.onPress;
  
  return React.cloneElement(children, {
    onPress: (event: any) => {
      if (handleFeatureAccess()) {
        originalOnPress?.(event);
      }
    }
  });
}

export function useFeatureAccess() {
  const { checkFeatureAccess, incrementUsage, user } = useAuth();
  
  const canUseFeature = (feature: string): boolean => {
    const access = checkFeatureAccess(feature);
    return access.hasAccess;
  };
  
  const getFeatureStatus = (feature: string) => {
    return checkFeatureAccess(feature);
  };
  
  const useFeature = (feature: string): boolean => {
    const access = checkFeatureAccess(feature);
    if (access.hasAccess && access.isLimited) {
      incrementUsage(feature);
    }
    return access.hasAccess;
  };
  
  return {
    canUseFeature,
    getFeatureStatus,
    useFeature,
    user
  };
}