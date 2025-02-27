import { NextResponse } from 'next/server';

// Define an array of proxy functions.
// Each function receives the assetIDs and returns a fetch() promise.
const proxies = [
  async (assetIDs) => {
    // Proxy 1: you can customize headers or other options here.
    const url = `https://thumbnails.roblox.com/v1/assets?assetIds=${assetIDs}&format=png&size=150x150`;
    return await fetch(url, { headers: { 'X-Proxy-Id': '1' } });
  },
  async (assetIDs) => {
    // Proxy 2: another configuration if needed.
    const url = `https://thumbnails.roblox.com/v1/assets?assetIds=${assetIDs}&format=png&size=150x150`;
    return await fetch(url, { headers: { 'X-Proxy-Id': '2' } });
  },
  async (assetIDs) => {
    // Proxy 3: yet another variation.
    const url = `https://thumbnails.roblox.com/v1/assets?assetIds=${assetIDs}&format=png&size=150x150`;
    return await fetch(url, { headers: { 'X-Proxy-Id': '3' } });
  }
];

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const assetIDs = searchParams.get('assetIDs');

  if (!assetIDs) {
    return NextResponse.json({ error: 'Asset IDs are required' }, { status: 400 });
  }

  let lastError = null;
  
  // Iterate over each proxy function until one returns a successful response.
  for (const proxyFunc of proxies) {
    try {
      const response = await proxyFunc(assetIDs);
      
      // If the proxy is rate limited, move on to the next one.
      if (response.status === 429) {
        console.warn(`Proxy with custom header is rate limited. Trying next proxy...`);
        continue;
      }
      
      // If response is not OK, record error and try the next.
      if (!response.ok) {
        lastError = new Error(`Proxy returned status ${response.status}`);
        continue;
      }
      
      // Successfully retrieved data.
      const data = await response.json();
      return NextResponse.json(data);
    } catch (error) {
      lastError = error;
      console.error(`Error with proxy: ${error.message}`);
      continue;
    }
  }

  // If none of the proxies succeeded, return an error.
  return NextResponse.json(
    { error: 'All proxies failed', details: lastError ? lastError.message : '' },
    { status: 500 }
  );
}

export const config = {
  runtime: 'edge',
};
