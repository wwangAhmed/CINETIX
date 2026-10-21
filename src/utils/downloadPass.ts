// High-definition ticket pass and asset image downloader utility for CINETIX

interface TicketPassParams {
  movieTitle: string;
  theaterName: string;
  date: string;
  time: string;
  format: string;
  seats: string[];
  total: number;
  bookingRef: string;
  qrData?: string;
}

// Generate a deterministic 25x25 QR matrix for canvas drawing
function generateQRMatrix(text: string, dimension = 25): boolean[][] {
  const matrix: boolean[][] = Array.from({ length: dimension }, () =>
    Array(dimension).fill(false)
  );

  function drawFinder(row: number, col: number) {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const isCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        matrix[row + r][col + c] = isBorder || isCenter;
      }
    }
  }

  drawFinder(0, 0);
  drawFinder(0, dimension - 7);
  drawFinder(dimension - 7, 0);

  for (let i = 8; i < dimension - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  for (let r = 0; r < dimension; r++) {
    for (let c = 0; c < dimension; c++) {
      const inTopLeft = r < 8 && c < 8;
      const inTopRight = r < 8 && c >= dimension - 8;
      const inBottomLeft = r >= dimension - 8 && c < 8;
      const inTiming = r === 6 || c === 6;
      const inCenter = r >= 10 && r <= 14 && c >= 10 && c <= 14;

      if (!inTopLeft && !inTopRight && !inBottomLeft && !inTiming && !inCenter) {
        hash = Math.imul(hash ^ (r * 31 + c * 17), 16777619);
        matrix[r][c] = (hash & 1) === 1;
      }
    }
  }

  return matrix;
}

export function downloadTicketPassImage(ticket: TicketPassParams): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const width = 1200;
      const height = 620;
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not create canvas context');

      // 1. Dark luxury background
      ctx.fillStyle = '#181715';
      ctx.fillRect(0, 0, width, height);

      // Card Container background with subtle radial gradient
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#24221F');
      bgGrad.addColorStop(1, '#1C1B19');
      ctx.fillStyle = bgGrad;
      roundRect(ctx, 40, 40, width - 80, height - 80, 24);
      ctx.fill();

      // Golden outer stroke
      ctx.strokeStyle = '#665946';
      ctx.lineWidth = 2;
      roundRect(ctx, 40, 40, width - 80, height - 80, 24);
      ctx.stroke();

      // Top glowing accent strip
      const stripGrad = ctx.createLinearGradient(40, 40, width - 40, 40);
      stripGrad.addColorStop(0, '#FF9D16');
      stripGrad.addColorStop(0.5, '#CC903B');
      stripGrad.addColorStop(1, '#FF9D16');
      ctx.fillStyle = stripGrad;
      roundRect(ctx, 40, 40, width - 80, 10, { tl: 24, tr: 24, bl: 0, br: 0 });
      ctx.fill();

      // 2. Left stub (Vertical Admit)
      const stubGrad = ctx.createLinearGradient(40, 40, 120, height - 40);
      stubGrad.addColorStop(0, '#FF9D16');
      stubGrad.addColorStop(1, '#CC903B');
      ctx.fillStyle = stubGrad;
      roundRect(ctx, 40, 40, 80, height - 80, { tl: 24, bl: 24, tr: 0, br: 0 });
      ctx.fill();

      // Vertical text in stub
      ctx.save();
      ctx.translate(88, height / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillStyle = '#181715';
      ctx.font = '900 28px "Bebas Neue", sans-serif';
      ctx.textAlign = 'center';
      ctx.letterSpacing = '6px';
      ctx.fillText('ADMIT ' + ticket.seats.length, 0, 0);
      ctx.restore();

      // 3. Main Ticket Body
      const contentX = 150;
      let curY = 95;

      // Header Tagline
      ctx.fillStyle = '#FF9D16';
      ctx.font = '700 13px "Inter", sans-serif';
      ctx.fillText('★  CINETIX OFFICIAL DIGITAL GATE PASS', contentX, curY);

      // Format Pill
      ctx.fillStyle = 'rgba(255, 157, 22, 0.15)';
      roundRect(ctx, 600, curY - 16, 120, 26, 6);
      ctx.fill();
      ctx.strokeStyle = '#FF9D16';
      ctx.lineWidth = 1;
      roundRect(ctx, 600, curY - 16, 120, 26, 6);
      ctx.stroke();
      ctx.fillStyle = '#FF9D16';
      ctx.font = '800 12px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(ticket.format || 'IMAX 3D', 660, curY + 2);
      ctx.textAlign = 'left';

      // Movie Title
      curY += 55;
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 48px "Bebas Neue", sans-serif';
      ctx.fillText((ticket.movieTitle || 'CINETIX EXPERIENCE').toUpperCase(), contentX, curY);

      // Divider
      curY += 24;
      ctx.strokeStyle = '#3A3731';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(contentX, curY);
      ctx.lineTo(720, curY);
      ctx.stroke();

      // Details Grid
      curY += 35;
      // Col 1: Cinema
      ctx.fillStyle = '#99784B';
      ctx.font = '600 12px "Inter", sans-serif';
      ctx.fillText('THEATRE LOCATION', contentX, curY);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 18px "Inter", sans-serif';
      ctx.fillText(ticket.theaterName || 'Cinetix Grand IMAX', contentX, curY + 26);

      // Col 2: Date & Time
      ctx.fillStyle = '#99784B';
      ctx.font = '600 12px "Inter", sans-serif';
      ctx.fillText('DATE & TIME', contentX + 320, curY);
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 18px "Inter", sans-serif';
      ctx.fillText(`${ticket.date} · ${ticket.time}`, contentX + 320, curY + 26);

      curY += 80;
      // Col 1: Seats
      ctx.fillStyle = '#99784B';
      ctx.font = '600 12px "Inter", sans-serif';
      ctx.fillText('RESERVED SEATS', contentX, curY);
      let seatX = contentX;
      ticket.seats.forEach((seat) => {
        ctx.fillStyle = '#FF9D16';
        roundRect(ctx, seatX, curY + 10, 48, 28, 6);
        ctx.fill();
        ctx.fillStyle = '#181715';
        ctx.font = '800 14px "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(seat, seatX + 24, curY + 29);
        ctx.textAlign = 'left';
        seatX += 56;
      });

      // Col 2: Total Paid
      ctx.fillStyle = '#99784B';
      ctx.font = '600 12px "Inter", sans-serif';
      ctx.fillText('TOTAL AMOUNT PAID', contentX + 320, curY);
      ctx.fillStyle = '#22C55E';
      ctx.font = '800 22px "Inter", sans-serif';
      ctx.fillText(`$${ticket.total}.00  ✓ VERIFIED`, contentX + 320, curY + 30);

      // Booking Reference & Security badge at bottom
      curY += 85;
      ctx.fillStyle = '#C7BFB5';
      ctx.font = '500 13px "Inter", sans-serif';
      ctx.fillText(`Booking Ref: `, contentX, curY);
      ctx.fillStyle = '#FF9D16';
      ctx.font = '700 13px "Inter", sans-serif';
      ctx.fillText(ticket.bookingRef, contentX + 85, curY);

      ctx.fillStyle = '#99784B';
      ctx.font = '500 11px "Inter", sans-serif';
      ctx.fillText('🔒 256-Bit Cryptographic Vault Token · PCI-DSS Level 1 Verified', contentX, curY + 22);

      // 4. Perforation Notch & Dashed Line
      const perfX = 770;
      ctx.setLineDash([8, 8]);
      ctx.strokeStyle = '#665946';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(perfX, 40);
      ctx.lineTo(perfX, height - 40);
      ctx.stroke();
      ctx.setLineDash([]);

      // Top and bottom punch holes
      ctx.fillStyle = '#181715';
      ctx.beginPath();
      ctx.arc(perfX, 40, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(perfX, height - 40, 18, 0, Math.PI * 2);
      ctx.fill();

      // 5. Right Section: QR Code & Verification
      const qrBoxX = 815;
      const qrBoxY = 100;
      const qrSize = 270;

      // QR White Container
      ctx.fillStyle = '#FFFFFF';
      roundRect(ctx, qrBoxX, qrBoxY, qrSize, qrSize, 16);
      ctx.fill();
      ctx.strokeStyle = '#FF9D16';
      ctx.lineWidth = 3;
      roundRect(ctx, qrBoxX, qrBoxY, qrSize, qrSize, 16);
      ctx.stroke();

      // Draw QR Matrix
      const matrix = generateQRMatrix(ticket.qrData || `CINETIX|${ticket.bookingRef}|${ticket.movieTitle}`);
      const cellSize = (qrSize - 32) / 25;
      ctx.fillStyle = '#181715';
      for (let r = 0; r < 25; r++) {
        for (let c = 0; c < 25; c++) {
          if (r >= 10 && r <= 14 && c >= 10 && c <= 14) continue; // center badge
          if (matrix[r][c]) {
            ctx.fillRect(qrBoxX + 16 + c * cellSize, qrBoxY + 16 + r * cellSize, cellSize + 0.3, cellSize + 0.3);
          }
        }
      }

      // Center CTX badge
      ctx.fillStyle = '#181715';
      roundRect(ctx, qrBoxX + 16 + 10 * cellSize, qrBoxY + 16 + 10 * cellSize, 5 * cellSize, 5 * cellSize, 4);
      ctx.fill();
      ctx.fillStyle = '#FF9D16';
      ctx.font = `900 ${cellSize * 2.2}px "Bebas Neue", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('CTX', qrBoxX + 16 + 12.5 * cellSize, qrBoxY + 16 + 13.5 * cellSize);
      ctx.textAlign = 'left';

      // Scan instruction below QR
      ctx.fillStyle = '#22C55E';
      ctx.font = '800 13px "Inter", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('● TOUCHLESS GATE ENTRY VALID', qrBoxX + qrSize / 2, qrBoxY + qrSize + 32);

      // Barcode simulation
      const barY = qrBoxY + qrSize + 48;
      const barW = qrSize;
      ctx.fillStyle = '#FFFFFF';
      for (let bx = 0; bx < barW; bx += 4) {
        const thickness = (bx * 13) % 4 === 0 ? 3 : 1.5;
        const barH = 30;
        ctx.fillRect(qrBoxX + bx, barY, thickness, barH);
      }
      ctx.fillStyle = '#C7BFB5';
      ctx.font = '600 10px monospace';
      ctx.fillText(`* ${ticket.bookingRef} *`, qrBoxX + qrSize / 2, barY + 44);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error('Canvas blob generation failed'));
          return;
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Cinetix-Pass-${ticket.bookingRef}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        resolve();
      }, 'image/png');
    } catch (err) {
      reject(err);
    }
  });
}

// Download standalone high-res QR image
export function downloadQRCodePNG(data: string, filename = 'cinetix-qr.png'): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      const canvas = document.createElement('canvas');
      const size = 512;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('No canvas context');

      // White background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, size, size);

      // Gold border
      ctx.strokeStyle = '#FF9D16';
      ctx.lineWidth = 12;
      ctx.strokeRect(6, 6, size - 12, size - 12);

      // QR Matrix
      const matrix = generateQRMatrix(data);
      const cellSize = (size - 64) / 25;
      ctx.fillStyle = '#181715';
      for (let r = 0; r < 25; r++) {
        for (let c = 0; c < 25; c++) {
          if (r >= 10 && r <= 14 && c >= 10 && c <= 14) continue;
          if (matrix[r][c]) {
            ctx.fillRect(32 + c * cellSize, 32 + r * cellSize, cellSize + 0.4, cellSize + 0.4);
          }
        }
      }

      // Center CTX
      ctx.fillStyle = '#181715';
      roundRect(ctx, 32 + 10 * cellSize, 32 + 10 * cellSize, 5 * cellSize, 5 * cellSize, 8);
      ctx.fill();
      ctx.fillStyle = '#FF9D16';
      ctx.font = `900 ${cellSize * 2.3}px "Bebas Neue", sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText('CTX', 32 + 12.5 * cellSize, 32 + 13.5 * cellSize);

      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error('Failed blob'));
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 2000);
        resolve();
      }, 'image/png');
    } catch (e) {
      reject(e);
    }
  });
}

// Download any image asset directly
export async function downloadAssetImage(url: string, filename: string): Promise<void> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(blobUrl), 2000);
  } catch {
    // Fallback direct link download
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

// Helper to draw rounded rectangles
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  radius: number | { tl?: number; tr?: number; br?: number; bl?: number }
) {
  let r = { tl: 0, tr: 0, br: 0, bl: 0 };
  if (typeof radius === 'number') {
    r = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    r = { ...r, ...radius };
  }
  ctx.beginPath();
  ctx.moveTo(x + r.tl, y);
  ctx.lineTo(x + w - r.tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
  ctx.lineTo(x + w, y + h - r.br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
  ctx.lineTo(x + r.bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
  ctx.lineTo(x, y + r.tl);
  ctx.quadraticCurveTo(x, y, x + r.tl, y);
  ctx.closePath();
}
