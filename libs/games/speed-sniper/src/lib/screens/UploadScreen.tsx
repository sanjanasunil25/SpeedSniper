import React, { useState, useCallback } from 'react';
import { extractTextFromPDF } from '@game-engine/resource';

interface UploadScreenProps {
  onUpload: (text: string, name: string) => void;
}

export default function UploadScreen({ onUpload }: UploadScreenProps) {
  const [text, setText] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = () => {
    if (text.trim()) {
      onUpload(text, 'pasted-text');
    }
  };

  const handleFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file.');
      return;
    }

    setIsExtracting(true);
    setError(null);
    try {
      const extractedText = await extractTextFromPDF(file);
      if (extractedText) {
        onUpload(extractedText, file.name);
      } else {
        setError('No text found in PDF.');
      }
    } catch (err: any) {
      console.error(err);
      setError('Failed to extract text from PDF.');
    } finally {
      setIsExtracting(false);
    }
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100dvh',
      width: '100%',
      background: '#0a0a1a',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated Background Particles */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              position: 'absolute',
              width: Math.random() * 4 + 'px',
              height: Math.random() * 4 + 'px',
              background: 'rgba(99, 102, 241, 0.4)',
              borderRadius: '50%',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animation: `float-particle ${Math.random() * 10 + 10}s linear infinite`,
              animationDelay: `-${Math.random() * 20}s`
            }}
          />
        ))}
      </div>

      {/* Scrollable content area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch' as any,
        padding: '24px 16px 8px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        <h1 style={{
          fontSize: 'clamp(2rem, 8vw, 4rem)',
          marginBottom: '0.4rem',
          marginTop: '0.5rem',
          color: '#f8fafc',
          textShadow: '0 0 30px rgba(99, 102, 241, 0.8)',
          fontWeight: 900,
          letterSpacing: '-0.02em',
          textAlign: 'center',
        }}>⚡ SPEED SNIPER</h1>

        <p style={{
          fontSize: 'clamp(0.9rem, 3vw, 1.3rem)',
          marginBottom: '1.5rem',
          color: '#94a3b8',
          fontWeight: 500,
          textAlign: 'center',
        }}>
          Upload a resource. Snipe the concept.
        </p>

        <div style={{ width: '100%', maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* PDF Drop Zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            className={isExtracting ? '' : 'pdf-zone'}
            style={{
              width: '100%',
              padding: '2rem 1.5rem',
              backgroundColor: isDragging ? 'rgba(99, 102, 241, 0.1)' : 'rgba(30, 41, 59, 0.5)',
              border: `2px dashed ${isDragging ? '#6366f1' : '#334155'}`,
              borderRadius: '1.5rem',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              backdropFilter: 'blur(8px)',
              position: 'relative',
              animation: !isExtracting && !isDragging ? 'pulse-border 2s infinite' : 'none',
              textAlign: 'center',
            }}
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              accept=".pdf"
              onChange={onFileChange}
              style={{ display: 'none' }}
            />
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', filter: 'drop-shadow(0 0 10px rgba(99, 102, 241, 0.5))' }}>📄</div>
            {isExtracting ? (
              <div style={{ color: '#6366f1', fontWeight: 'bold', fontSize: '1.1rem' }}>Extracting text...</div>
            ) : (
              <>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '0.4rem', color: '#f1f5f9' }}>
                  Drop PDF here or tap to browse
                </div>
                <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                  We'll generate rounds based on your document
                </div>
              </>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', color: '#334155', gap: '1rem' }}>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #334155)' }} />
            <span style={{ fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.1em' }}>OR PASTE TEXT</span>
            <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #334155, transparent)' }} />
          </div>

          {/* Text Area */}
          <div style={{
            width: '100%',
            backgroundColor: 'rgba(30, 41, 59, 0.3)',
            borderRadius: '1.5rem',
            padding: '1.25rem',
            border: '1px solid rgba(51, 65, 85, 0.5)',
            backdropFilter: 'blur(4px)',
          }}>
            <textarea
              value={text}
              onChange={(e) => { setText(e.target.value); setError(null); }}
              placeholder="Paste text/notes here to generate a game..."
              style={{
                width: '100%',
                height: '120px',
                backgroundColor: 'rgba(15, 23, 42, 0.5)',
                color: '#f8fafc',
                border: '1px solid #334155',
                borderRadius: '0.75rem',
                padding: '1rem',
                marginBottom: '0',
                resize: 'none',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => e.target.style.borderColor = '#6366f1'}
              onBlur={(e) => e.target.style.borderColor = '#334155'}
            />

            {error && <div style={{ color: '#ef4444', marginTop: '0.75rem', fontSize: '0.875rem', fontWeight: 500 }}>{error}</div>}
          </div>
        </div>
      </div>

      {/* Sticky bottom bar with Generate button */}
      <div style={{
        position: 'sticky',
        bottom: 0,
        padding: '12px 16px',
        background: 'linear-gradient(to top, #0a0a1a 80%, transparent)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        zIndex: 100,
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || isExtracting}
            className="generate-btn"
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '0.75rem',
              background: text.trim() ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : '#334155',
              color: text.trim() ? '#ffffff' : '#94a3b8',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              border: 'none',
              cursor: text.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: text.trim() ? '0 10px 15px -3px rgba(99, 102, 241, 0.3)' : 'none',
            }}
          >
            Generate My Challenge →
          </button>
        </div>
      </div>

      <style>{`
        @keyframes float-particle {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(50px) scale(0.5); opacity: 0; }
        }
        @keyframes pulse-border {
          0% { border-color: #334155; box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
          50% { border-color: #6366f1; box-shadow: 0 0 20px 0 rgba(99, 102, 241, 0.2); }
          100% { border-color: #334155; box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
        }
        .generate-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 0 25px rgba(99, 102, 241, 0.6) !important;
          filter: brightness(1.1);
        }
        .pdf-zone:hover {
          background-color: rgba(99, 102, 241, 0.05) !important;
          border-color: #6366f1 !important;
        }
      `}</style>
    </div>
  );
}
