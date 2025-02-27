import { NextResponse } from 'next/server';

const proxies = [
    "https://proxy1.example.com",
    "https://proxy2.example.com",
    "https://proxy3.example.com"
];
let currentProxyIndex = 0;

async function fetchWithRotation(assetIDs) {
    let attempt = 0;
    while (attempt < proxies.length) {
        const proxyUrl = `${proxies[currentProxyIndex]}/v1/assets?assetIds=${assetIDs}&format=png&size=150x150`;
        try {
            const response = await fetch(proxyUrl);
            if (response.ok) {
                return await response.json();
            }
        } catch (error) {
            console.error(`Proxy ${proxies[currentProxyIndex]} failed, rotating...`);
        }
        currentProxyIndex = (currentProxyIndex + 1) % proxies.length;
        attempt++;
    }
    throw new Error('All proxies failed');
}

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const assetIDs = searchParams.get('assetIDs');

    if (!assetIDs) {
        return NextResponse.json({ error: 'Asset IDs are required' }, { status: 400 });
    }

    try {
        const data = await fetchWithRotation(assetIDs);
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Thumbnail fetch failed' }, { status: 500 });
    }
}

export const config = {
    runtime: 'edge',
};
