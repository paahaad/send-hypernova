#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;
use instructions::*;

pub mod instructions;
pub mod state;
pub mod error;

declare_id!("ChsLbPE12EHPaABRUtTJUNPwa4oi7Pm9TipwFD65Z31k");

#[program]
pub mod hypernova {
    use super::*;

    pub fn create_token(
        ctx: Context<CreateToken>,
        start_time: i64,
        end_time: i64,
        ticker: i64,
    
        token_name: String,
        token_symbol: String,
        token_uri: String,
        
        total_supply: u64,
        token_price: u64,
        min_purchase: u64,
        max_purchase: u64,
        presale_percentage: i8,
    ) -> Result<()> {
        create::create_token(ctx, start_time, end_time, ticker , token_name, token_symbol, token_uri, total_supply, token_price, min_purchase, max_purchase, presale_percentage)
    }

    pub fn mint_token(ctx: Context<MintToken>, amount: u64) -> Result<()> {
        mint::mint_token(ctx, amount)
    }
}