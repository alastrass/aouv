import React from 'react';
import { Sparkles, Heart } from 'lucide-react';
import { Category } from '../types';

interface WheelSpinnerProps {
  isSpinning: boolean;
  category: Category;
}

const WheelSpinner: React.FC<WheelSpinnerProps> = ({ isSpinning, category }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <div className="relative">
          {/* Spinning wheel */}
          <div className={`w-48 h-48 mx-auto mb-8 rounded-full border-8 ${
            category === 'soft' 
              ? 'border-purple-500 bg-gradient-to-br from-purple-500/20 to-pink-500/20' 
              : 'border-red-500 bg-gradient-to-br from-red-500/20 to-orange-500/20'
          } ${
            isSpinning ? 'animate-spin' : ''
          } flex items-center justify-center shadow-2xl`}>
            <div className="text-center">
              <Heart className={`w-12 h-12 mx-auto mb-2 ${
                category === 'soft' ? 'text-purple-300' : 'text-red-300'
              }`} />
              <div className="text-white font-bold text-lg">
                {category === 'soft' ? 'SOFT' : 'INTENSE'}
              </div>
            </div>
          </div>
          
          {/* Sparkles around the wheel */}
          <Sparkles className="absolute top-0 left-8 w-6 h-6 text-amber-400 animate-pulse" />
          <Sparkles className="absolute top-8 right-0 w-4 h-4 text-amber-300 animate-pulse delay-300" />
          <Sparkles className="absolute bottom-0 right-8 w-6 h-6 text-amber-400 animate-pulse delay-150" />
          <Sparkles className="absolute bottom-8 left-0 w-4 h-4 text-amber-300 animate-pulse delay-450" />
        </div>
        
        <h2 className="text-3xl font-bold text-white mb-4 animate-pulse">
          {isSpinning ? 'Sélection en cours...' : 'Préparation du défi !'}
        </h2>
        
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-pink-500 rounded-full animate-bounce delay-100"></div>
          <div className="w-3 h-3 bg-amber-500 rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
};

export default WheelSpinner;
