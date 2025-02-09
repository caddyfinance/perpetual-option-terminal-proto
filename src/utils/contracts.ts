import { ethers } from 'ethers';
import LSDOptionsPoolABI from '../contracts/LSDOptionsPool.json';

// Base Goerli testnet contract address - you'll need to update this after deployment
const POOL_ADDRESS = "0x0000000000000000000000000000000000000000";

export const getOptionsContract = (signer: ethers.Signer) => {
    return new ethers.Contract(POOL_ADDRESS, LSDOptionsPoolABI.abi, signer);
};

export const createOption = async (
    contract: ethers.Contract,
    asset: string,
    strike: number,
    premium: number,
    size: number,
    expiry: number,
    isCall: boolean
) => {
    try {
        const tx = await contract.createOption(
            asset,
            ethers.parseEther(strike.toString()),
            ethers.parseEther(premium.toString()),
            ethers.parseEther(size.toString()),
            expiry,
            isCall
        );
        await tx.wait();
        return tx.hash;
    } catch (error) {
        console.error("Error creating option:", error);
        throw error;
    }
};

export const buyOption = async (
    contract: ethers.Contract,
    optionId: number,
    premium: number
) => {
    try {
        const tx = await contract.buyOption(optionId, {
            value: ethers.parseEther(premium.toString())
        });
        await tx.wait();
        return tx.hash;
    } catch (error) {
        console.error("Error buying option:", error);
        throw error;
    }
};

export const exerciseOption = async (
    contract: ethers.Contract,
    optionId: number,
    strikePrice: number,
    isCall: boolean
) => {
    try {
        const tx = await contract.exerciseOption(optionId, {
            value: isCall ? ethers.parseEther(strikePrice.toString()) : 0
        });
        await tx.wait();
        return tx.hash;
    } catch (error) {
        console.error("Error exercising option:", error);
        throw error;
    }
};