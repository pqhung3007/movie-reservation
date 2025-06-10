interface Seat {
  seatNumber: string;
  isReserved: boolean;
}

export function generateSeatMap() {
  const rows = 'ABCDEFGH'.split('');
  const seatsPerRow = 8;
  const seatMap: Seat[] = [];

  for (const row of rows) {
    for (let i = 1; i <= seatsPerRow; i++) {
      seatMap.push({ seatNumber: `${row}${i}`, isReserved: false });
    }
  }

  return seatMap;
}
