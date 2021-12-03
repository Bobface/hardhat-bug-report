const { BigNumber } = require('ethers')
const { ethers, network, artifacts } = require('hardhat')
const { expect } = require('chai')

const RICH_ETH_ADDRESS = '0xDA9dfA130Df4dE4673b89022EE50ff26f6EA73Cf'
const RICH_WETH_ADDRESS = '0xE78388b4CE79068e89Bf8aA7f218eF6b9AB0e9d0'
const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'

describe('Bug', () => {
    it('Bug', async () => {
        // Impersonate accounts to get some ETH and WETH
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [RICH_ETH_ADDRESS]
        })
        const richETHSigner = await ethers.getSigner(RICH_ETH_ADDRESS)
        
        await network.provider.request({
            method: "hardhat_impersonateAccount",
            params: [RICH_WETH_ADDRESS]
        })
        const richWETHSigner = await ethers.getSigner(RICH_WETH_ADDRESS)

        // Send some ETH to the rich WETH address for tx fee
        await richETHSigner.sendTransaction({
            to: RICH_WETH_ADDRESS,
            value: ethers.utils.parseEther('1.0')
        })

        // Deploy the bug contract
        const factory = await ethers.getContractFactory('Bug')
        const bug = await factory.connect(richWETHSigner).deploy()

        // Send 1 WETH to the buggy contract
        const IERC20 = await artifacts.readArtifact('IERC20')
        const weth = new ethers.Contract(
			WETH_ADDRESS,
			IERC20.abi,
			richWETHSigner
		)
        await weth.connect(richWETHSigner).transfer(bug.address, ethers.utils.parseEther('1.0'))

        // Call the buggy contract
        await richWETHSigner.sendTransaction({
            to: bug.address,
        })

        // Get the WETH balance of the buggy contract after the call
        // It should be zero 
        const balanceBefore = await weth.balanceOf(bug.address)
        expect(balanceBefore.toString()).to.equal('0')
    })
})