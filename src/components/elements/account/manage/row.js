import React from 'react';

import { Button, Header, List, Grid, Segment, Table } from 'semantic-ui-react'

import AccountPendingRewards from '../pendingrewards'
import AccountAvatar from '../avatar'
import AccountLink from '../link'
import AccountSteemPower from '../steempower'
import AccountVotingPower from '../votingpower'

export default class AccountManageRow extends React.Component {
  render() {
    const { account, active, chainstate, globalprops } = this.props
    return (
      <Table.Row key={account.name}>
        <Table.Cell collapsing>
          <AccountAvatar
            size={35}
            style={{margin: 0}}
            username={account.name}
          />
        </Table.Cell>
        <Table.Cell>
          <AccountLink username={account.name} />
        </Table.Cell>
        <Table.Cell>
          <AccountVotingPower chainstate={chainstate} />
        </Table.Cell>
        <Table.Cell>
          <AccountSteemPower
            chainstate={chainstate}
            globalprops={globalprops}
          />
        </Table.Cell>
        <Table.Cell collapsing>
          <AccountPendingRewards
            account={account}
            chainstate={chainstate}
            claimRewards={this.props.actions.claimRewards}
            globalprops={globalprops}
          />
        </Table.Cell>
        <Table.Cell collapsing>
          <Button
            size='tiny'
            floated='right'
            color={(account.name === active) ? 'green' : 'blue'}
            content={(account.name === active) ? 'Active' : 'Use'}
            value={account.name}
            onClick={this.props.swapAccount}
            disabled={(account.name === active)}
          />
        </Table.Cell>
      </Table.Row>
    )
  }
}
