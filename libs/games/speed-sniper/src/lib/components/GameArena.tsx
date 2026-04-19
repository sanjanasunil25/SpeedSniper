import React, { useEffect, useRef, useState } from 'react';
import { TokenState } from '../types';
import { initTokens, updateTokens } from '../tokenPhysics';
import { AnswerToken } from './AnswerToken';

interface Props {
  answers: string[];
  correctAnswer: string;
  round: number;
  onCorrectHit: () => void;
  onMiss: () => void;
}

export function GameArena({
  answers,
  correctAnswer,
  round,
  onCorrectHit,
  onMiss,
}: Props) {
  const [tokens, setTokens] = useState<TokenState[]>([]);
  const tokensRef = useRef<TokenState[]>([]);
  const animRef = useRef<number>(0);
  const resolvedRef = useRef(false);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const answersWithCorrect = answers.map(text => ({
      text,
      isCorrect: text === correctAnswer,
    }));

    const initial = initTokens(answersWithCorrect, round - 1);
    tokensRef.current = initial;
    setTokens([...initial]);
    resolvedRef.current = false;
    startTimeRef.current = Date.now();

    let lastTime = 0;

    const loop = (timestamp: number) => {
      if (lastTime === 0) lastTime = timestamp;
      const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
      lastTime = timestamp;

      const updated = updateTokens(tokensRef.current, dt);
      tokensRef.current = updated;
      setTokens([...updated]);

      if (!resolvedRef.current) {
        const elapsed = Date.now() - startTimeRef.current;
        if (elapsed > 2000) {
          const correct = updated.find(t => t.isCorrect);
          if (correct && correct.status === 'exited') {
            resolvedRef.current = true;
            onMiss();
            return;
          }
        }
      }

      animRef.current = requestAnimationFrame(loop);
    };

    animRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animRef.current);
  }, [round]);

  const handleClick = (tokenId: string) => {
    if (resolvedRef.current) return;
    const token = tokensRef.current.find(t => t.id === tokenId);
    if (!token || token.status !== 'floating') return;

    const updated = tokensRef.current.map(t =>
      t.id === tokenId
        ? { ...t, status: (token.isCorrect ? 'hit' : 'wrong') as TokenState['status'] }
        : t
    );
    tokensRef.current = updated;
    setTokens([...updated]);

    if (token.isCorrect) {
      resolvedRef.current = true;
      cancelAnimationFrame(animRef.current);
      setTimeout(onCorrectHit, 400);
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: 'calc(100vh - 160px)',
      overflow: 'hidden',
    }}>
      {tokens.map(token => (
        <AnswerToken key={token.id} token={token} onClick={handleClick} />
      ))}
    </div>
  );
}

export default GameArena;
