import React from 'react'
import { Helmet } from "react-helmet";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import _ from 'lodash'
import steem from 'steem'

import { Button, Header, List, Grid, Segment, Table } from 'semantic-ui-react'
import { goToTop } from 'react-scrollable-anchor'

import * as accountActions from '../actions/accountActions'
import * as accountsActions from '../actions/accountsActions'
import * as breadcrumbActions from '../actions/breadcrumbActions'
import * as chainstateActions from '../actions/chainstateActions'
import * as preferenceActions from '../actions/preferenceActions'
import * as statusActions from '../actions/statusActions'

import LoginButton from '../components/elements/login/button'
import AccountAvatar from '../components/elements/account/avatar'
import AccountLink from '../components/elements/account/link'
import AccountManageRow from '../components/elements/account/manage/row'

class Accounts extends React.Component {

  constructor(props) {
    super(props);
    goToTop()
  }

  componentDidMount() {
    const accounts = this.props.accounts.auths.map(account => account.name);
    this.props.actions.getAccounts(accounts)
    this.props.actions.getDynamicGlobalProperties()
    this.interval = setInterval(() => this.props.actions.getAccounts(accounts), 6000);
  }

  componentWillMount() {
    this.props.actions.setBreadcrumb([
      {
        name: 'Accounts',
        link: '/'
      }
    ]);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  swapAccount = (e, { value }) => {
    const { props } = this
    const { name, key } = _.find(props.accounts.auths, {name: value});
    if(name && key) {
      const t = this
      let isValidKey = steem.auth.isWif(key),
          isValidForAccount = false
      steem.api.getAccounts([name], function(err, result) {
        if(!result.length) {
          return
        }
        if(result && isValidKey) {
          let public_key = steem.auth.wifToPublic(key),
              key_auths = result[0].posting.key_auths
          for(var i=0; i < key_auths.length; i++) {
            if(key_auths[i][0] === public_key) {
              isValidForAccount = true
            }
          }
        }
        if(isValidForAccount) {
          props.actions.signinAccount(name, key)
        } else {
          console.log("invalid key")
        }
      })
    }
  }

  render() {
    const { account, accounts, chainstate } = this.props
    let rows = false
    if(accounts && Object.keys(chainstate.accounts).length > 0) {
      rows = (accounts.auths.map((current) => {
        const chainstate_accounts = chainstate.accounts
        const chainstate_current = chainstate_accounts[current.name]
        return (
          <AccountManageRow
            account={current}
            actions={this.props.actions}
            active={account.name}
            chainstate={chainstate_current}
            globalprops={chainstate.props}
            key={current.name}
            swapAccount={this.swapAccount.bind(this)}
          />
        )
      }))
    }
    return (
      <Segment basic>
        {/* <Segment clearing>
          <Header>
            Current User
          </Header>
          <AccountAvatar
            size={35}
            style={{margin: 0}}
            username={account.name}
          />
          <AccountLink username={account.name} />
        </Segment> */}
        <Segment>
          <Header>
            <LoginButton
              actions={this.props.actions}
              buttonColor='green'
              buttonFloated='right'
              buttonIcon='plus'
              buttonText='Add another account'
            />
            All Accounts
            <Header.Subheader>
              Click "Use" to swap to a specific account and use it.
            </Header.Subheader>
          </Header>
          <Table>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell></Table.HeaderCell>
                <Table.HeaderCell>Account</Table.HeaderCell>
                <Table.HeaderCell>Voting Power</Table.HeaderCell>
                <Table.HeaderCell>Steem Power</Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
                <Table.HeaderCell></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {rows}
            </Table.Body>
          </Table>
        </Segment>
      </Segment>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    account: state.account,
    accounts: state.accounts,
    chainstate: state.chainstate,
    preferences: state.preferences,
    status: state.status
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({
    ...accountActions,
    ...accountsActions,
    ...breadcrumbActions,
    ...chainstateActions,
    ...preferenceActions,
    ...statusActions
  }, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);
