import { NextResponse } from 'next/server';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const assetIDs = searchParams.get('assetIDs');

    if (!assetIDs) {
        return NextResponse.json({ error: 'Asset IDs are required' }, { status: 400 });
    }

    const thumbnailUrl = `https://thumbnails.roblox.com/v1/assets?assetIds=${assetIDs}&format=png&size=150x150`;

    try {
        const response = await fetch(thumbnailUrl);
        if (!response.ok) throw new Error('Failed to fetch thumbnail');

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Thumbnail fetch failed' }, { status: 500 });
    }
}

export const config = {
    runtime: 'edge',
};
