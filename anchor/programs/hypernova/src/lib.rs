#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Mint};

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod hypernova {
    use super::*;

    pub fn initialize_presale(
        ctx: Context<InitializePresale>, 
        presale_price: u64,
        min_purchase: u64,
        max_purchase: u64,
        hard_cap: u64,
        start_time: i64,
        end_time: i64
    ) -> Result<()> {
        // TODO: 1. Init presale 2. check input
        let presale_pool = &mut ctx.accounts.presale_pool;
        
        require!(start_time < end_time, PresaleError::InvalidTimeRange);
        require!(min_purchase < max_purchase, PresaleError::InvalidPurchaseRange);
        
        presale_pool.presale_token_mint = ctx.accounts.token_mint.key();
        presale_pool.presale_price = presale_price;
        presale_pool.min_purchase = min_purchase;
        presale_pool.max_purchase = max_purchase;
        presale_pool.hard_cap = hard_cap;
        presale_pool.start_time = start_time;
        presale_pool.end_time = end_time;
        presale_pool.total_raised = 0;
        presale_pool.total_tokens_sold = 0;
        presale_pool.is_finalized = false;

        Ok(())
    }

    pub fn purchase_tokens(
        ctx: Context<PurchaseTokens>, 
        sol_amount: u64
    ) -> Result<()> {
        let presale_pool = &mut ctx.accounts.presale_pool;
        let clock = Clock::get()?;
        let current_timestamp = clock.unix_timestamp;

        // Validate purchase conditions
        require!(
            current_timestamp >= presale_pool.start_time && 
            current_timestamp <= presale_pool.end_time, 
            PresaleError::PresaleNotActive
        );

        // Check purchase amount limits
        require!(
            sol_amount >= presale_pool.min_purchase &&
            sol_amount <= presale_pool.max_purchase, 
            PresaleError::InvalidPurchaseAmount
        );

        // Calculate tokens to receive
        let tokens_to_receive = sol_amount
            .checked_div(presale_pool.presale_price)
            .ok_or(PresaleError::MathOverflow)?;

        // Check hard cap
        require!(
            presale_pool.total_tokens_sold
                .checked_add(tokens_to_receive)
                .ok_or(PresaleError::MathOverflow)? 
            <= presale_pool.hard_cap, 
            PresaleError::HardCapExceeded
        );

        // Transfer SOL to presale vault
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: ctx.accounts.presale_vault.to_account_info(),
            }
        );
        anchor_lang::system_program::transfer(cpi_context, sol_amount)?;

        // Mint tokens to buyer
        let token_context = CpiContext::new(
            ctx.accounts.token_program.to_account_info(),
            token::MintTo {
                mint: ctx.accounts.token_mint.to_account_info(),
                to: ctx.accounts.buyer_token_account.to_account_info(),
                authority: ctx.accounts.presale_pool.key(),
            }
        );
        token::mint_to(token_context, tokens_to_receive)?;

        // Update presale pool state
        presale_pool.total_raised = presale_pool
            .total_raised
            .checked_add(sol_amount)
            .ok_or(PresaleError::MathOverflow)?;
        
        presale_pool.total_tokens_sold = presale_pool
            .total_tokens_sold
            .checked_add(tokens_to_receive)
            .ok_or(PresaleError::MathOverflow)?;

        Ok(())
    }

    pub fn finalize_presale(ctx: Context<FinalizePresale>) -> Result<()> {
        let presale_pool = &mut ctx.accounts.presale_pool;
        let clock = Clock::get()?;

        // Ensure presale is over and not already finalized
        require!(
            clock.unix_timestamp > presale_pool.end_time, 
            PresaleError::PresaleNotEnded
        );
        require!(!presale_pool.is_finalized, PresaleError::AlreadyFinalized);

        // Transfer raised funds to project wallet
        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.presale_vault.to_account_info(),
                to: ctx.accounts.project_wallet.to_account_info(),
            }
        );
        let total_raised = presale_pool.total_raised;
        anchor_lang::system_program::transfer(cpi_context, total_raised)?;

        // Mark presale as finalized
        presale_pool.is_finalized = true;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializePresale<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(
        init, 
        payer = authority, 
        space = 8 + 256 // Additional space for future upgrades
    )]
    pub presale_pool: Account<'info, PresalePool>,
    
    pub token_mint: Account<'info, Mint>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub rent: Sysvar<'info, Rent>,
}

#[derive(Accounts)]
pub struct PurchaseTokens<'info> {
    #[account(mut)]
    pub presale_pool: Account<'info, PresalePool>,
    
    #[account(mut)]
    pub buyer: Signer<'info>,
    
    #[account(
        mut,
        seeds = [b"presale_vault"],
        bump
    )]
    pub presale_vault: SystemAccount<'info>,
    
    #[account(mut)]
    pub token_mint: Account<'info, Mint>,
    
    #[account(
        mut,
        associated_token::mint = token_mint,
        associated_token::authority = buyer
    )]
    pub buyer_token_account: Account<'info, TokenAccount>,
    
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct FinalizePresale<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    
    #[account(mut)]
    pub presale_pool: Account<'info, PresalePool>,
    
    #[account(
        mut,
        seeds = [b"presale_vault"],
        bump
    )]
    pub presale_vault: SystemAccount<'info>,
    
    #[account(mut)]
    pub project_wallet: SystemAccount<'info>,
    
    pub system_program: Program<'info, System>,
}

#[account]
#[derive(Default)]
pub struct PresalePool {
    pub presale_token_mint: Pubkey,
    pub presale_price: u64,         // Price per token in lamports
    pub min_purchase: u64,          // Minimum purchase amount
    pub max_purchase: u64,          // Maximum purchase amount
    pub hard_cap: u64,              // Maximum tokens to sell
    pub start_time: i64,            // Presale start timestamp
    pub end_time: i64,              // Presale end timestamp
    pub total_raised: u64,          // Total SOL raised
    pub total_tokens_sold: u64,     // Total tokens sold
    pub is_finalized: bool,         // Presale finalization status
}

#[error_code]
pub enum PresaleError {
    #[msg("Invalid time range for presale")]
    InvalidTimeRange,
    #[msg("Invalid purchase amount range")]
    InvalidPurchaseRange,
    #[msg("Presale is not active")]
    PresaleNotActive,
    #[msg("Invalid purchase amount")]
    InvalidPurchaseAmount,
    #[msg("Presale hard cap exceeded")]
    HardCapExceeded,
    #[msg("Math overflow occurred")]
    MathOverflow,
    #[msg("Presale has not ended")]
    PresaleNotEnded,
    #[msg("Presale already finalized")]
    AlreadyFinalized,
}