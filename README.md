### Here is the flow of what I understand: 

1. we are building a token launchpad where anyone((Developer)) can come and launch the token.
2. We also have pre-sale option means: developer raise funds before lunch. how he will do this is via pool. 
	developer will put some token in pool and anyone can buy from the pool, this will happend via fixed prices.
	in smart contract. formula is given by yash.

3. Each token (100%) = 20% LP (Constant) + X% Dev wants to sell (or Presale folks to buy) + Y% for Dev to buy (or team allocation)

4. The SOL raised during the presale is permanently added to a LP along with an equivalent amount of the project's tokens(i.e 20% constant).

### My Task will be 
1. Pool where users can deposit the amount and just receive the tokens from the pool
- initialize_presale
- purchase_tokens
- finalize_presale

### My be:
2. Token allocation Managemnt
- set_token_allocation:- Implement access controls for allocation settings
- create_liquidity_pool:- Automatically create a liquidity pool on a DEX