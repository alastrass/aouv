import React, { useState } from 'react';

interface PointsPerRoundSelectorProps {
  onPointsChange: (points: number) => void;
}

const PointsPerRoundSelector: React.FC<PointsPerRoundSelectorProps> = ({ onPointsChange }) => {
  const [selectedOption, setSelectedOption] = useState<number | 'custom'>(10);
  const [customValue, setCustomValue] = useState('');
  const [error, setError] = useState('');

  const handleOptionChange = (value: number | 'custom') => {
    setSelectedOption(value);
    if (value !== 'custom')
