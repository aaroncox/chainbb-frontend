import React from 'react';
import steem from 'steem';
import { Button, Container, Dropdown, Grid, Header, Icon, Menu, Popup } from 'semantic-ui-react'

export default class AccountPendingRewards extends React.Component {

  state = {
    chainstate: {
      ts: 0
    },
    isClaiming: false,
    hasBalance: []
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.chainstate && nextProps.chainstate.ts != this.state.chainstate.ts) {
      const { chainstate } = nextProps
      const fields = [
        'reward_sbd_balance',
        'reward_steem_balance',
        'reward_vesting_balance'
      ];
      const hasBalance = fields.filter((field) => {
        return (parseFloat(chainstate[field].split(" ")[0]) > 0)
      })
      this.setState({
        chainstate,
        hasBalance,
        isClaiming: false
      });
    }
  }

  handleClaim = () => {
    const { account, chainstate } = this.props
    const reward_sbd = chainstate.reward_sbd_balance;
    const reward_steem = chainstate.reward_steem_balance;
    const reward_vests = chainstate.reward_vesting_balance;
    this.setState({isClaiming: true})
    this.props.claimRewards({ account, reward_sbd, reward_steem, reward_vests });
  }

  vests_to_sp = (vests) => {
    const { globalprops } = this.props
    const { total_vesting_fund_steem, total_vesting_shares } = globalprops
    return Math.round(steem.formatter.vestToSteem(vests, total_vesting_shares, total_vesting_fund_steem) * 1000) / 1000
  }

  render() {
    const { chainstate } = this.props
    const { isClaiming, hasBalance } = this.state
    if(!hasBalance.length) {
      return false
    }
    return (
      <Popup
        trigger={
          <Menu.Item style={{padding: '0 1.1em'}}>
            <Icon name='gift' size='big' style={{margin: 0}} />
          </Menu.Item>
        }
        hoverable
      >
          <Grid>
              <Grid.Row columns={1}>
                  <Grid.Column>
                      <Header>
                        Pending Rewards
                        <Header.Subheader>
                          Rewards from your posting and voting activity.
                        </Header.Subheader>
                      </Header>
                  </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={2}>
                {hasBalance.map((field) => {
                  const kind = field.split("_")[1]
                  const amount = chainstate[field].split(" ")[0]
                  const value = (kind === 'vesting') ? this.vests_to_sp(amount) : amount
                  const symbol = (kind === 'vesting') ? 'SP' : 'SBD'
                  return (
                      <Grid.Column key={symbol} textAlign='center'>
                            <Header color='green'>
                                +{value}{' '}<small>{symbol}</small>
                            </Header>
                      </Grid.Column>
                  )
                  })}
              </Grid.Row>
              <Grid.Row columns={1}>
                  <Grid.Column>
                      <Button
                        color='purple'
                        fluid
                        loading={isClaiming}
                        onClick={this.handleClaim}
                        size='small'
                      >
                        Claim Rewards
                      </Button>
                  </Grid.Column>
              </Grid.Row>
          </Grid>
      </Popup>

    )
  }
}
