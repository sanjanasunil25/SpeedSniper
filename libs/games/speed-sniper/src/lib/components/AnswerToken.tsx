import React from 'react';
import { TokenState } from '../types';

interface Props {
  token: TokenState;
  onClick: (id: string) => void;
}

export function AnswerToken({ token, onClick }: Props) {
  const getStyle = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      position: 'absolute',
      left: token.x + '%',
      top: token.y + '%',
      transform: 'translateY(-50%)',
      padding: '12px 24px',
      minWidth: '80px',
      textAlign: 'center',
      borderRadius: '50px',
      fontSize: '15px',
      fontWeight: '700',
      color: 'white',
      cursor: 'crosshair',
      userSelect: 'none',
      whiteSpace: 'nowrap',
      zIndex: 10,
      transition: 'transform 0.1s, box-shadow 0.1s',
      border: '2px solid rgba(99, 102, 241, 0.8)',
      background: 'rgba(99, 102, 241, 0.25)',
      backdropFilter: 'blur(8px)',
      boxShadow: '0 0 15px rgba(99, 102, 241, 0.4)',
    };

    if (token.status === 'hit') {
      return {
        ...base,
        background: 'rgba(34, 197, 94, 0.4)',
        border: '2px solid #22c55e',
        boxShadow: '0 0 25px rgba(34, 197, 94, 0.8)',
        transform: 'translateY(-50%) scale(1.2)',
      };
    }

    if (token.status === 'wrong') {
      return {
        ...base,
        background: 'rgba(239, 68, 68, 0.4)',
        border: '2px solid #ef4444',
        boxShadow: '0 0 25px rgba(239, 68, 68, 0.8)',
      };
    }

    return base;
  };

  if (token.status === 'exited') return null;

  return (
    <div style={getStyle()} onClick={() => onClick(token.id)}>
      {token.text}
    </div>
  );
}

export default AnswerToken;
