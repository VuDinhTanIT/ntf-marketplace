import axios from 'axios'
import fs from 'fs'
import middleware from './middleware/middleware'
import nextConnect from 'next-connect'
import FormData from 'form-data'

const pinataBaseUrl = 'https://api.pinata.cloud'
const JWT = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI0ZWI2ZmNjOS03ODc4LTQ1ZWMtODViZC03NGRlNmM4YjdmYzIiLCJlbWFpbCI6ImdhcmVubG9sLjJrNEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiNDcwYzRjMTE1ZDYzOTdhN2U0MmIiLCJzY29wZWRLZXlTZWNyZXQiOiJmYTliNTU5MzEwZTcwMjYxZThiOWZlMzA4NWM4YmYyOWJhNWUxNGNkNGFmOWI2MjAzNjU1NDg3MmE2OTIwZjBhIiwiaWF0IjoxNzAxOTIxMjMxfQ.fumEuqOwWwWVih918QMFajmOihfCAb3SOOB8RyT8uak'

const handler = nextConnect()
handler.use(middleware)

export const config = {
  api: {
    bodyParser: false
  }
}

handler.post(async function handlePost ({ body, files }, response) {
  try {
    const fileUrl = await uploadFileToIPFS(files.file[0])
    const metadata = {
      name: body.name[0],
      description: body.description[0],
      image: fileUrl
    }

    const metadaUrl = await uploadJsonToIPFS(metadata, body.name[0])
    return response.status(200).json({
      url: metadaUrl
    })
  } catch (error) {
    console.log('Error uploading file: ', error)
  }
})

async function uploadFileToIPFS (data) {
  const formData = new FormData()
  formData.append('file', fs.createReadStream(data.path), data.originalFileName)

  try {
    const { data: responseData } = await axios.post(`${pinataBaseUrl}/pinning/pinFileToIPFS`, formData, {
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        Authorization: JWT

        // pinata_api_key: process.env.PINATA_API_KEY,
        // pinata_secret_api_key: process.env.PINATA_SECRET_KEY
      }
    })
    const url = `https://ipfs.io/ipfs/${responseData.IpfsHash}?filename=${data.originalFilename}`
    return url
  } catch (error) {
    console.log(error)
  }
}
async function uploadJsonToIPFS (json, fileName) {
  try {
    const { data: responseData } = await axios.post(`${pinataBaseUrl}/pinning/pinJSONToIPFS`, json, {
      headers: {
        Authorization: JWT

        // pinata_api_key: process.env.PINATA_API_KEY,
        // pinata_secret_api_key: process.env.PINATA_SECRET_KEY
      }
    })
    const url = `https://ipfs.io/ipfs/${responseData.IpfsHash}?filename=${fileName}`
    return url
  } catch (error) {
    console.log(error.response.data)
  }
}

export default handler
