export const uploadToIPFS = async (data: FormData) => {
  const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      pinata_api_key: `${import.meta.env.VITE_PINATA_API_KEY}`,
      pinata_secret_api_key: `${import.meta.env.VITE_PINATA_API_SECRET}`,
    },
    body: data,
  });

  const result = await response.json();
  if (!result.IpfsHash) throw Error('Failed to upload to IPFS');

  return result.IpfsHash;
};
