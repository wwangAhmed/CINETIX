import React, { useMemo, useState } from 'react';
import { downloadQRCodePNG } from '../utils/downloadPass';

interface Props {
  data: string;
  size?: number;
  fgColor?: string;
  bgColor?: string;
  showScanBeam?: boolean;
  allowDownload?: boolean;
}

// Deterministic matrix generator for ticket data
function generateMatrix(text: string, dimension = 25): boolean[][] {
  const matrix: boolean[][] = Array.from({ length: dimension }, () =>
    Array(dimension).fill(false)
  );

  // Position detection patterns (7x7 corners)
  function drawFinderPattern(rowStart: number, colStart: number) {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[rowStart + r][colStart + c] = true;
        } else {
          matrix[rowStart + r][colStart + c] = false;
        }
      }
    }
  }

  // Draw 3 standard finder patterns
  drawFinderPattern(0, 0);
  drawFinderPattern(0, dimension - 7);
  drawFinderPattern(dimension - 7, 0);

  // Timing patterns
  for (let i = 8; i < dimension - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Simple deterministic hash based on text
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  // Pseudo-random data filling
  for (let r = 0; r < dimension; r++) {
    for (let c = 0; c < dimension; c++) {
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= dimension - 8;
      const inBottomLeft = r >= dimension - 8 && c < 8;
      const inTiming = r === 6 || c === 6;
      const inCenterBadge = r >= 10 && r <= 14 && c >= 10 && c <= 14;

      if (!inTopLeft && !inTopRight && !inBottomLeft && !inTiming && !inCenterBadge) {
        hash = Math.imul(hash ^ (r * 31 + c * 17), 16777619);
        matrix[r][c] = (hash & 1) === 1;
      }
    }
  }

  return matrix;
}

export default function DynamicQRCode({
  data,
  size = 180,
  fgColor = '#181715',
  bgColor = '#FFFFFF',
  showScanBeam = false,
  allowDownload = true,
}: Props) {
  const dimension = 25;
  const matrix = useMemo(() => generateMatrix(data, dimension), [data]);
  const cellSize = size / dimension;
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setDownloading(true);
    try {
      await downloadQRCodePNG(data, 'cinetix-gate-qr.png');
    } finally {
      setTimeout(() => setDownloading(false), 1200);
    }
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        background: bgColor,
        padding: 8,
        borderRadius: 12,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
        display: 'inline-block',
      }}
      className="group"
      title={allowDownload ? "Click to download QR code" : undefined}
    >
      <svg
        width={size - 16}
        height={size - 16}
        viewBox={`0 0 ${size} ${size}`}
        style={{ display: 'block' }}
      >
        {matrix.map((row, r) =>
          row.map((active, c) => {
            if (r >= 10 && r <= 14 && c >= 10 && c <= 14) return null;
            if (!active) return null;
            return (
              <rect
                key={`${r}-${c}`}
                x={c * cellSize}
                y={r * cellSize}
                width={cellSize}
                height={cellSize}
                fill={fgColor}
                rx={1}
              />
            );
          })
        )}

        {/* Center Cinetix badge */}
        <rect
          x={10 * cellSize}
          y={10 * cellSize}
          width={5 * cellSize}
          height={5 * cellSize}
          fill="#181715"
          rx={4}
        />
        <text
          x={12.5 * cellSize}
          y={13.2 * cellSize}
          fill="#FF9D16"
          fontSize={cellSize * 2.2}
          fontWeight="900"
          fontFamily="Bebas Neue, sans-serif"
          textAnchor="middle"
        >
          CTX
        </text>
      </svg>

      {/* Optional holographic scanner animation */}
      {showScanBeam && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            height: 3,
            background: 'linear-gradient(90deg, transparent, #FF9D16, #CC903B, transparent)',
            boxShadow: '0 0 12px #FF9D16',
            animation: 'scanAnimation 2.2s ease-in-out infinite alternate',
          }}
        />
      )}

      {/* Floating Download Button on hover */}
      {allowDownload && (
        <button
          onClick={handleDownload}
          style={{
            position: 'absolute',
            bottom: 4,
            right: 4,
            background: 'rgba(24, 23, 21, 0.85)',
            border: '1px solid #FF9D16',
            color: '#FF9D16',
            borderRadius: 6,
            padding: '2px 6px',
            fontSize: 9,
            fontWeight: 800,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            transition: 'all 0.2s ease',
          }}
          title="Download QR code as PNG image"
        >
          <span>📥</span>
          <span>{downloading ? '✓' : 'PNG'}</span>
        </button>
      )}

      <style>{`
        @keyframes scanAnimation {
          0% { top: 6px; opacity: 0.6; }
          100% { top: calc(100% - 10px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
