const hre = require('hardhat')

// const dogsMetadataUrl = 'https://www.google.com/imgres?imgurl=https%3A%2F%2Fcafefcdn.com%2F203337114487263232%2F2023%2F12%2F4%2Fgia-vang-30112021-1701692638020-17016926395151878756433.jpg&tbnid=ExjokCBOqkJwhM&vet=12ahUKEwi97dOf3IeDAxUkm1YBHeGkC-oQMygAegQIARBA..i&imgrefurl=https%3A%2F%2Fcafef.vn%2Fthi-truong-vang-co-con-lap-lanh-sau-nguong-2100-usd-ounce-188231204192558539.chn&docid=Olp3l4s1Whmd4M&w=1600&h=1120&q=v%C3%A0ng&ved=2ahUKEwi97dOf3IeDAxUkm1YBHeGkC-oQMygAegQIARBA'
const dogsMetadataUrl = 'https://moccasin-worldwide-meadowlark-967.mypinata.cloud/ipfs/Qma1QLz3iDpFbFDPwhd6uefT4sKfv8kpVGbCvvyh91sMPR?pinataGatewayToken=mTLJl6vSyJjb-0YrWaR-0b-p8UMqiSXOegJNsUfiKm0uLw4U5BuHIpLA8043eOWl&_gl=1*1rer9qy*_ga*MTcyMDExODQ4LjE3MDE5MjA2NTE.*_ga_5RMPXG14TE*MTcwMjM3MTI4MS4xMS4xLjE3MDIzNzEyODYuNTUuMC4w'
const techEventMetadataUrl = 'https://moccasin-worldwide-meadowlark-967.mypinata.cloud/ipfs/QmdN9RcpxVhMxuN5hSfrf8cz7KBwE5RpunEtNMq3xvKa3M?pinataGatewayToken=mTLJl6vSyJjb-0YrWaR-0b-p8UMqiSXOegJNsUfiKm0uLw4U5BuHIpLA8043eOWl&_gl=1*1w5jlge*_ga*MTcyMDExODQ4LjE3MDE5MjA2NTE.*_ga_5RMPXG14TE*MTcwMjM3MTI4MS4xMS4xLjE3MDIzNzE0NzguNjAuMC4w'
const yellowCrownMetadataUrl = 'https://moccasin-worldwide-meadowlark-967.mypinata.cloud/ipfs/Qmb6ikk1g2TY455sg2sUTZdwXPFkQ88vLfEii5izon7t51?pinataGatewayToken=mTLJl6vSyJjb-0YrWaR-0b-p8UMqiSXOegJNsUfiKm0uLw4U5BuHIpLA8043eOWl&_gl=1*r29gex*_ga*MTcyMDExODQ4LjE3MDE5MjA2NTE.*_ga_5RMPXG14TE*MTcwMjM3MTI4MS4xMS4xLjE3MDIzNzE4OTcuNjAuMC4w'
const ashleyMetadataUrl = 'https://moccasin-worldwide-meadowlark-967.mypinata.cloud/ipfs/QmcAiZYUCKz5pNQj2xuumt31aU6BybsuijoTWVyB9HjkJq?pinataGatewayToken=mTLJl6vSyJjb-0YrWaR-0b-p8UMqiSXOegJNsUfiKm0uLw4U5BuHIpLA8043eOWl&_gl=1*pwmge3*_ga*MTcyMDExODQ4LjE3MDE5MjA2NTE.*_ga_5RMPXG14TE*MTcwMjM3MTI4MS4xMS4xLjE3MDIzNzIwODcuNjAuMC4w'
const codeconMetadataUrl = 'https://moccasin-worldwide-meadowlark-967.mypinata.cloud/ipfs/QmV8kXuDMxi5NBAJuqXm7zy8SghwmGzw32YHXr3DBiXbAd?pinataGatewayToken=mTLJl6vSyJjb-0YrWaR-0b-p8UMqiSXOegJNsUfiKm0uLw4U5BuHIpLA8043eOWl&_gl=1*c17qj4*_ga*MTcyMDExODQ4LjE3MDE5MjA2NTE.*_ga_5RMPXG14TE*MTcwMjM3MTI4MS4xMS4xLjE3MDIzNzI3MjMuNDEuMC4w'
const webArMetadataUrl = 'https://moccasin-worldwide-meadowlark-967.mypinata.cloud/ipfs/QmcokWY64xn1kX84i9JCJZPzeGHexZveRjjPc8us6bWEbh?pinataGatewayToken=mTLJl6vSyJjb-0YrWaR-0b-p8UMqiSXOegJNsUfiKm0uLw4U5BuHIpLA8043eOWl&_gl=1*1kmapy6*_ga*MTcyMDExODQ4LjE3MDE5MjA2NTE.*_ga_5RMPXG14TE*MTcwMjM3MTI4MS4xMS4xLjE3MDIzNzI5MDIuNjAuMC4w'

async function getMintedTokenId (transaction) {
  const transactionResult = await transaction.wait()
  const event = transactionResult.events[0]
  const value = event.args[2]
  return value.toNumber()
}

async function getCreatedMarketItemId (transaction) {
  const transactionResult = await transaction.wait()
  const marketItemEvent = transactionResult.events.find(event => event.args)
  const value = marketItemEvent.args[0]
  return value.toNumber()
}

async function setupMarket (marketplaceAddress, nftAddress) {
  const networkName = hre.network.name.toUpperCase()
  marketplaceAddress = marketplaceAddress || process.env[`MARKETPLACE_CONTRACT_ADDRESS_${networkName}`]
  nftAddress = nftAddress || process.env[`NFT_CONTRACT_ADDRESS_${networkName}`]

  const marketplaceContract = await hre.ethers.getContractAt('Marketplace', marketplaceAddress)
  const nftContract = await hre.ethers.getContractAt('NFT', nftAddress)
  const nftContractAddress = nftContract.address
  const [acc1, acc2] = await hre.ethers.getSigners()

  const price = hre.ethers.utils.parseEther('0.01')
  const listingFee = await marketplaceContract.getListingFee()

  const dogsMintTx = await nftContract.mintToken(dogsMetadataUrl)
  const dogsTokenId = await getMintedTokenId(dogsMintTx)
  const techEventMintTx = await nftContract.mintToken(techEventMetadataUrl)
  const techEventTokenId = await getMintedTokenId(techEventMintTx)
  const codeconMintTx = await nftContract.mintToken(codeconMetadataUrl)
  const codeconTokenId = await getMintedTokenId(codeconMintTx)
  const webArMintTx = await nftContract.mintToken(webArMetadataUrl)
  const webArTokenId = await getMintedTokenId(webArMintTx)
  await marketplaceContract.createMarketItem(nftContractAddress, dogsTokenId, price, { value: listingFee })
  await marketplaceContract.createMarketItem(nftContractAddress, techEventTokenId, price, { value: listingFee })
  const codeconMarketTx = await marketplaceContract.createMarketItem(nftContractAddress, codeconTokenId, price, { value: listingFee })
  const codeconMarketItemId = await getCreatedMarketItemId(codeconMarketTx)
  await marketplaceContract.createMarketItem(nftContractAddress, webArTokenId, price, { value: listingFee })
  console.log(`${acc1.address} minted tokens ${dogsTokenId}, ${techEventTokenId}, ${codeconTokenId} and ${webArTokenId} and listed them as market items`)

  await marketplaceContract.cancelMarketItem(nftContractAddress, codeconMarketItemId)
  console.log(`${acc1.address} canceled market item for token ${codeconTokenId}`)

  const yellowMintTx = await nftContract.connect(acc2).mintToken(yellowCrownMetadataUrl)
  const yellowTokenId = await getMintedTokenId(yellowMintTx)
  const ashleyMintTx = await nftContract.connect(acc2).mintToken(ashleyMetadataUrl)
  const ashleyTokenId = await getMintedTokenId(ashleyMintTx)
  await marketplaceContract.connect(acc2).createMarketItem(nftContractAddress, yellowTokenId, price, { value: listingFee })
  await marketplaceContract.connect(acc2).createMarketItem(nftContractAddress, ashleyTokenId, price, { value: listingFee })
  console.log(`${acc2.address} minted tokens ${yellowTokenId} and ${ashleyTokenId} and listed them as market items`)

  await marketplaceContract.createMarketSale(nftContractAddress, yellowTokenId, { value: price })
  console.log(`${acc1.address} bought token ${yellowTokenId}`)
  await nftContract.approve(marketplaceContract.address, yellowTokenId)
  await marketplaceContract.createMarketItem(nftContractAddress, yellowTokenId, price, { value: listingFee })
  console.log(`${acc1.address} put token ${yellowTokenId} for sale`)

  await marketplaceContract.connect(acc2).createMarketSale(nftContractAddress, dogsTokenId, { value: price })
  await nftContract.connect(acc2).approve(marketplaceContract.address, dogsTokenId)
  await marketplaceContract.connect(acc2).createMarketItem(nftContractAddress, dogsTokenId, price, { value: listingFee })
  console.log(`${acc2.address} bought token ${dogsTokenId} and put it for sale`)

  await marketplaceContract.connect(acc2).createMarketSale(nftContractAddress, webArTokenId, { value: price })
  console.log(`${acc2.address} bought token ${webArTokenId}`)
}

async function main () {
  if (process.env.IS_RUNNING) return
  await setupMarket()
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error)
    process.exit(1)
  })

module.exports = {
  setupMarket: setupMarket
}
