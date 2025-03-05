#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod hypernova {
    use super::*;

  pub fn close(_ctx: Context<CloseHypernova>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.hypernova.count = ctx.accounts.hypernova.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.hypernova.count = ctx.accounts.hypernova.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeHypernova>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.hypernova.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeHypernova<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Hypernova::INIT_SPACE,
  payer = payer
  )]
  pub hypernova: Account<'info, Hypernova>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseHypernova<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub hypernova: Account<'info, Hypernova>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub hypernova: Account<'info, Hypernova>,
}

#[account]
#[derive(InitSpace)]
pub struct Hypernova {
  count: u8,
}
