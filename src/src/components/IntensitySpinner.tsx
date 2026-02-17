import React from 'react';
import { Zap } from 'lucide-react';

interface IntensitySpinnerProps {
  isSpinning: boolean;
}

const IntensitySpinner: React.FC<IntensitySpinnerProps> = ({ isSpinning }) => {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <style>{`
        @keyframes lightning {
          0%, 100% { opacity: 0; }
          10%, 15% { opacity: 1; transform: scaleX(1); }
          20% { opacity: 0; }
          30%, 35% { opacity: 1; transform: scaleX(1); }
          40% { opacity: 0; }
          80%, 85% { opacity: 1; transform: scaleX(1); }
          90%, 95% { opacity: 1; transform: scaleX(1); }
        }

        @keyframes pulse-intense {
          0%, 100% { box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.7); }
          50% { box-shadow: 0 0 0 20px rgba(251, 191, 36, 0); }
        }

        @keyframes zap-bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }

        .lightning-bg {
          animation: lightning 0.8s infinite;
          position: relative;
        }

        .intensity-circle {
          animation: pulse-intense 2s infinite;
        }

        .zap-icon {
          animation: zap-bounce 0.6s infinite;
        }
      `}</style>

      <div className="text-center">
        <div className="relative mb-8">
          {/* Central intensity orb */}
          <div className="intensity-circle w-40 h-40 mx-auto rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center shadow-2xl border-4 border-amber-300">
            <div className="text-center">
              <Zap className="zap-icon w-16 h-16 text-white mx-auto mb-2" />
              <div className="text-white font-bold text-lg">INTENSITÉ</div>
            </div>
          </div>

          {/* Lightning bolts around */}
          <div className="absolute top-4 left-2 lightning-bg">
            <Zap className="w-6 h-6 text-amber-400" />
          </div>
          <div className="absolute top-6 right-4 lightning-bg" style={{animationDelay: '0.2s'}}>
            <Zap className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="absolute bottom-4 right-2 lightning-bg" style={{animationDelay: '0.4s'}}>
            <Zap className="w-6 h-6 text-amber-400" />
          </div>
          <div className="absolute bottom-6 left-4 lightning-bg" style={{animationDelay: '0.1s'}}>
            <Zap className="w-5 h-5 text-yellow-400" />
          </div>
        </div>

        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 mb-4 animate-pulse">
          {isSpinning ? 'Augmentation de puissance...' : 'Préparation du défi !'}
        </h2>

        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-amber-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
          <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-3 h-3 bg-rose-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );
};

export default IntensitySpinner;
