//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
interface IERC20 {

    function balanceOf(address account) external view returns (uint256);

    function transfer(address to, uint256 amount) external returns (bool);

    function approve(address spender, uint256 amount) external returns (bool);

    function transferFrom(address _from,address _to,uint256 _amount) external returns(bool);
}