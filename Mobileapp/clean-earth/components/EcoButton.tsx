import { TouchableOpacity, Text, View } from 'react-native';
import React from 'react';

interface EcoButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'outline';
  icon?: React.ReactNode;
}

export default function EcoButton({ title, onPress, variant = 'primary', icon }: EcoButtonProps) {
  const baseStyle = "flex-row items-center justify-center py-4 rounded-2xl shadow-sm";
  const bgStyle = variant === 'primary' ? "bg-primary" : "bg-white border border-primary";
  const textStyle = variant === 'primary' ? "text-white font-bold text-lg" : "text-primary font-bold text-lg";

  return (
    <TouchableOpacity onPress={onPress} className={`${baseStyle} ${bgStyle}`}>
      {icon && <View className="mr-2">{icon}</View>}
      <Text className={textStyle}>{title}</Text>
    </TouchableOpacity>
  );
}