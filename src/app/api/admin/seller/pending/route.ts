import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const pendingSellers = [
      {
        id: '1',
        name: 'Gupta Kirana Store',
        category: 'Grocery',
        location: 'Whitefield',
      },
      {
        id: '2',
        name: 'Lakshmi Dairy & Sweets',
        category: 'Dairy',
        location: 'Kadugodi',
      },
    ];

    return NextResponse.json(pendingSellers);

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch sellers' },
      { status: 500 }
    );
  }
}