import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

const TypingMessage = ({ sender, text }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => prev + text[index]);
      index++;
      if (index === text.length) {
        clearInterval(intervalId);
      }
    }, 1); // Adjust the speed here (milliseconds per character)

    return () => clearInterval(intervalId);
  }, [text]);

  return (
    <div>
      <Typography variant="body1">{displayedText}</Typography>
      <Typography variant="caption" color="textSecondary">{sender}</Typography>
    </div>
  );
};

export default TypingMessage;
