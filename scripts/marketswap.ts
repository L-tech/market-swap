import { Signer } from "ethers";
import { ethers, network } from "hardhat";

const DAI_USD = '0x0FCAa9c899EC5A91eBc3D5Dd869De833b06fB046'
const USDT = "0x55c18d10ded7968Cd980AbfE0547B410DF284413"
const DAI = "0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F"
const DAITokenHolder = "0x75d46b9f6a8ff92da784be6a763050f848551483";
const USDTTokenHolder = "0xffeac40c46db67aad2f02a5fe0ae283c1cb257dd";
async function main() {

  const tokenPrice = await ethers.getContractFactory("PriceConsumerV3");
  const feedPrice = await tokenPrice.deploy(DAI_USD);
  await feedPrice.deployed();
  // getting the chainlink feed price
  await feedPrice.getLatestPrice()
  console.log(await feedPrice.viewPrice());
 
  //deploying the dai token contract
  const DaiToken = await ethers.getContractAt("IERC20", DAI);

  const USDToken = await ethers.getContractAt("IERC20", USDT);

  console.log("DAI balance before:", await DaiToken.balanceOf(feedPrice.address))
  console.log("usdt balance before:", await USDToken.balanceOf(feedPrice.address))


  await network.provider.send("hardhat_setBalance", [
    DAITokenHolder,
    "0x16345785D8A0000",
  ]);

  
// @ts-ignore
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [DAITokenHolder], // address to impersonate
  });
  const signer1: Signer = await ethers.getSigner(DAITokenHolder);
  await DaiToken
    .connect(signer1)
    .transfer(
      feedPrice.address,
      "1820342231153430000000000000000"
  );
  console.log("DAI balance:", await DaiToken.balanceOf(feedPrice.address))
    //impersonating a USDT account in order to get the account to be a liquidity pool for the contract
// @ts-ignore
  await hre.network.provider.request({
    method: "hardhat_impersonateAccount",
    params: [USDTTokenHolder], // address to impersonate
  });
  const signer2: Signer = await ethers.getSigner(USDTTokenHolder);
  await USDToken
    .connect(signer2)
    .transfer(
      feedPrice.address,
      "14200"
  );
  console.log("usdt balance:", await USDToken.balanceOf(feedPrice.address))
  console.log("Greeter deployed to:", feedPrice.address);

    //swapping from DAI to USDT
  await feedPrice.checkToken(DAI, USDT, 0.00005)
  console.log("DAI balance after swap:", await DaiToken.balanceOf(feedPrice.address))
  console.log("usdt balance after swap:", await USDToken.balanceOf(feedPrice.address))

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
