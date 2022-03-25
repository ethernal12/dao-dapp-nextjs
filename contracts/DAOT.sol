// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20dwdw.sol";

    contract DAOT is ERC20{

      

        constructor(uint _totalSupply, address _admin)  ERC20 ("daoToken","DAOT"){
            address owner = address(this);

            _mint(address(this), _totalSupply * 10 ** 18); // 100 MIL minted tokens
            _transfer(owner, _admin, _totalSupply * 10 ** 18 / 3); // transfer 1/3 of minted tokens to admin
        }

        function transferFrom(address owner, address _to, uint _amount) public override returns(bool){
            owner = address(this);
             //_spendAllowance(owner, _to, _amount); // does not find teh function to set allowance to = 0 ?
            _transfer(owner, _to, _amount * 10 ** 18);
           
            return true;
        }


        function approve(address spender, uint amount) public override returns(bool){
            address owner = address(this);
            _approve(owner, spender, amount);
            return true;
        }

 
}
