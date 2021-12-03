pragma solidity 0.8.4;

contract Bug {
    fallback() external {
        assembly {
            // Load the pointer to free memory
            let free_mem_ptr := mload(0x40)
            // Store the function signature for transfer(address,uint256)
            mstore(free_mem_ptr, 0xa9059cbb00000000000000000000000000000000000000000000000000000000)
            // Store the address of the recipient, msg.sender
            mstore(add(free_mem_ptr, 0x4), caller())
            // Store the amount of WETH to send, 10^18
            mstore(add(free_mem_ptr, 0x24), 1000000000000000000)
            // Execute the transfer function on the WETH contract 
            // with msg.sender as the recipient and 
            // 10^18 as the amount of WETH to send
            let r := call(gas(), 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2, 0x0, free_mem_ptr, 0x44, 0x0, 0x0)
            // Check whether the call succeeded
            if eq(r, 0x0) {
                revert(0, 0)
            }
        }
    }
}