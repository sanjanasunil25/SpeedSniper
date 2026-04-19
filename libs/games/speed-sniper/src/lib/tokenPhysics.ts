import { TokenState } from './types';

const SPEEDS = [6, 7, 8, 9, 10, 12, 14, 16];

export function initTokens(
  answers: { text: string; isCorrect: boolean }[],
  round: number
): TokenState[] {
  const speed = SPEEDS[Math.min(round, 7)];
  const shuffled = [...answers].sort(() => Math.random() - 0.5);

  return shuffled.map((ans, i) => {
    const isLeft = i < 4;
    const baseY = isLeft 
      ? [15, 35, 55, 75][i] 
      : [25, 45, 65, 85][i - 4];
    
    return {
      id: String(i),
      text: ans.text,
      isCorrect: ans.isCorrect,
      x: isLeft ? -5 : 105,
      y: baseY + (Math.random() * 5 - 2.5),
      vx: isLeft ? speed : -speed,
      vy: (Math.random() - 0.5) * 3,
      status: 'floating' as const,
    };
  });
}

export function updateTokens(tokens: TokenState[], dt: number): TokenState[] {
  return tokens.map(token => {
    if (token.status !== 'floating') return token;

    let { x, y, vx, vy } = token;
    x += vx * dt;
    y += vy * dt;

    if (y <= 5) { y = 5; vy = Math.abs(vy); }
    if (y >= 90) { y = 90; vy = -Math.abs(vy); }

    const exited = x < -20 || x > 120;

    return {
      ...token,
      x, y, vx, vy,
      status: exited ? 'exited' as const : 'floating' as const,
    };
  });
}
