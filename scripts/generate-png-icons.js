import fs from 'fs';
import zlib from 'zlib';
import path from 'path';

// CRC32 implementation
const crcTable = new Uint32Array(256);
for (let i = 0; i < 256; i++) {
  let c = i;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[i] = c >>> 0;
}

function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    c = (c >>> 8) ^ crcTable[(c ^ buf[i]) & 0xFF];
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function createPNG(width, height, isMaskable = false) {
  // Create RGBA buffer
  const scanlines = Buffer.alloc((width * 4 + 1) * height);
  
  // Center and scale
  const cx = width / 2;
  const cy = height / 2;
  const r = isMaskable ? width * 0.48 : width * 0.46;
  const cornerRadius = isMaskable ? 0 : width * 0.22;

  for (let y = 0; y < height; y++) {
    const rowOffset = y * (width * 4 + 1);
    scanlines[rowOffset] = 0; // filter byte: none

    for (let x = 0; x < width; x++) {
      const pxOffset = rowOffset + 1 + x * 4;

      // Check rounded rect corner for non-maskable
      let inBounds = true;
      if (!isMaskable) {
        let dx = 0;
        let dy = 0;
        if (x < cornerRadius) dx = cornerRadius - x;
        else if (x > width - cornerRadius) dx = x - (width - cornerRadius);
        if (y < cornerRadius) dy = cornerRadius - y;
        else if (y > height - cornerRadius) dy = y - (height - cornerRadius);
        if (dx * dx + dy * dy > cornerRadius * cornerRadius) {
          inBounds = false;
        }
      }

      if (!inBounds) {
        // Transparent
        scanlines[pxOffset] = 0;
        scanlines[pxOffset + 1] = 0;
        scanlines[pxOffset + 2] = 0;
        scanlines[pxOffset + 3] = 0;
        continue;
      }

      // Background gradient: #ff5722 to #ee4d2d
      const t = (x + y) / (width + height);
      let rCol = Math.round(255 - t * (255 - 238)); // 255 -> 238 (#ee)
      let gCol = Math.round(87 - t * (87 - 77));    // 87 -> 77 (#4d)
      let bCol = Math.round(34 + t * (45 - 34));    // 34 -> 45 (#2d)

      // Normalize coords inside icon box (-1 to 1)
      const nx = (x - cx) / (width * 0.35);
      const ny = (y - cy) / (height * 0.35);

      // Handle curve: ellipse arc from (-0.45, -0.2) to (0.45, -0.2), top at -0.6
      const handleThick = 0.12;
      const hx = nx / 0.45;
      const hy = (ny + 0.1) / 0.45;
      if (ny < -0.1 && hx * hx + hy * hy < 1.05 && hx * hx + hy * hy > 0.65 && ny > -0.65) {
        // Handle white color
        rCol = 255;
        gCol = 255;
        bCol = 255;
      }

      // Shopping bag body: trapezoid from ny = -0.1 to 0.75
      if (ny >= -0.1 && ny <= 0.75) {
        const bagWidth = 0.82 - (ny - (-0.1)) * 0.12;
        if (Math.abs(nx) <= bagWidth) {
          // Inside bag: white (#ffffff)
          rCol = 255;
          gCol = 255;
          bCol = 255;

          // Inside bag: letter "V" stroke
          // V goes from (-0.35, 0.1) -> (0, 0.6) -> (0.35, 0.1)
          const vx = Math.abs(nx);
          const vy = ny;
          const expectedVx = (vy - 0.1) * (0.35 / 0.5);
          if (vy >= 0.1 && vy <= 0.58 && Math.abs(vx - (0.35 - (vy - 0.1) * (0.35 / 0.48))) < 0.09) {
            // Orange stroke for "V"
            rCol = 238;
            gCol = 77;
            bCol = 45;
          }
        }
      }

      // Star / Golden badge on top right of bag (nx = 0.5, ny = -0.05)
      const starDist = Math.hypot(nx - 0.5, ny - (-0.05));
      if (starDist < 0.2) {
        rCol = 255;
        gCol = 210;
        bCol = 0;
      }

      scanlines[pxOffset] = rCol;
      scanlines[pxOffset + 1] = gCol;
      scanlines[pxOffset + 2] = bCol;
      scanlines[pxOffset + 3] = 255;
    }
  }

  // Compress scanlines with zlib
  const compressed = zlib.deflateSync(scanlines, { level: 9 });

  // Build PNG chunks
  const chunks = [];
  
  // PNG Signature
  chunks.push(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]));

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  chunks.push(createChunk('IHDR', ihdr));

  // IDAT
  chunks.push(createChunk('IDAT', compressed));

  // IEND
  chunks.push(createChunk('IEND', Buffer.alloc(0)));

  return Buffer.concat(chunks);
}

function createChunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcInput = Buffer.concat([typeBuf, data]);
  const crcVal = crc32(crcInput);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crcVal, 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

const publicDir = path.resolve('public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

console.log('Generating PWA icons in /public...');
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPNG(192, 192, false));
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPNG(512, 512, false));
fs.writeFileSync(path.join(publicDir, 'pwa-maskable-512x512.png'), createPNG(512, 512, true));
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPNG(180, 180, false));
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), createPNG(64, 64, false));

console.log('Successfully generated all PWA icons!');
