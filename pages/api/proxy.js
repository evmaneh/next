import axios from 'axios';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { assetIDs } = req.query;
    if (!assetIDs) {
        return res.status(400).json({ error: 'Asset IDs are required' });
    }

    try {
        const url = `https://thumbnails.roblox.com/v1/assets?assetIds=${assetIDs}&format=png&size=150x150`;
        const response = await axios.get(url);
        
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch thumbnail' });
    }
}
