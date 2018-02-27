import React, { Component } from 'react'
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import { Button, Container, Dropdown, Grid, Header, Icon, Menu, Popup } from 'semantic-ui-react'

import * as accountActions from '../../actions/accountActions'
import * as accountsActions from '../../actions/accountsActions'
import * as statusActions from '../../actions/statusActions'

import LoginButton from '../elements/login/button'
import LogoutItem from '../elements/login/logout'
import AccountAvatar from '../elements/account/avatar'

class HeaderMenu extends Component {
  state = {
    isClaiming: false,
    hasBalance: false
  }
  componentDidMount() {
    if (!this.props.account || !this.props.account.data) {
      this.props.actions.fetchAccount(this.props.account.name)
    }
    this.interval = setInterval(() => this.props.actions.fetchAccount(this.props.account.name), 60000);
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.account && nextProps.account.data) {
      const { data } = nextProps.account
      const fields = [
        'reward_sbd_balance',
        'reward_steem_balance',
        'reward_vesting_balance'
      ];
      const hasBalance = fields.filter((field) => {
        return (parseFloat(data[field].split(" ")[0]) > 0)
      })
      this.setState({hasBalance, isClaiming: false});
    }
  }
  handleClaim = () => {
    const account = this.props.account
    const data = account.data
    const reward_sbd = data.reward_sbd_balance;
    const reward_steem = data.reward_steem_balance;
    const reward_vests = data.reward_vesting_balance;
    this.setState({isClaiming: true})
    this.props.actions.claimRewards({ account, reward_sbd, reward_steem, reward_vests });
  }
  vests_to_sp(vests){
    return Math.round(vests / 1e6 * this.props.status.network.steem_per_mvests * 1000) / 1000
  }
  render() {
    const { account } = this.props
    const { loading, name } = account
    const { height } = this.props.status.network
    const { isClaiming, hasBalance } = this.state
    let data = {}
    let avatar = false
    let pendingBalance = false
    let userItem = (
      <Menu.Item>
        <LoginButton {... this.props}/>
      </Menu.Item>
    )
    const indicator = (!loading) ? (
      <Popup
        trigger={
          <Icon name='checkmark' />
        }
        position='bottom center'
        inverted
        content={`Current Blockchain Height: #${height}`}
        basic
      />
    ) : (
      <Popup
        trigger={
          <Icon loading name='asterisk' />
        }
        position='bottom center'
        inverted
        content={`Connecting to the Steem blockchain`}
        basic
      />
    )
    if (name) {
      if(account) {
        data = account.data
      }
      avatar = (
        <AccountAvatar
          className=""
          noLink={true}
          size={35}
          style={{margin: 0}}
          username={name}
        />
      )
      userItem = (
        <Dropdown style={{padding: '0 1.1em'}} item trigger={avatar} pointing='top right' icon={null} className='icon'>
          <Dropdown.Menu>
            <Dropdown.Item as="a" href={`/@${name}`} icon="user" content="Profile" />
            <Dropdown.Item as="a" href={`/accounts`} icon="users" content="Accounts" />
            <LogoutItem {...this.props} />
          </Dropdown.Menu>
        </Dropdown>
      )
      if(data) {
        if(hasBalance.length > 0) {
          pendingBalance = (
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
                          if(data[field]) {
                            const kind = field.split("_")[1]
                            const amount = data[field].split(" ")[0]
                            const value = (kind === 'vesting') ? this.vests_to_sp(amount) : amount
                            const symbol = (kind === 'vesting') ? 'SP' : 'SBD'
                            return (
                                <Grid.Column key={symbol} textAlign='center'>
                                      <Header color='green'>
                                          +{value}{' '}<small>{symbol}</small>
                                      </Header>
                                </Grid.Column>
                            )
                          }
                        })}
                    </Grid.Row>
                    <Grid.Row columns={1}>
                        <Grid.Column>
                            <Button color='purple' fluid size='small' onClick={this.handleClaim} loading={isClaiming}>
                              Claim Rewards
                            </Button>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Popup>
          )
        }
      }
    }
    return (
      <Menu color='blue' size='large' inverted style={{borderBottom: '3px solid #767676'}}>
        <Container>
          <Link to='/' className='title active item'>
            <strong>chainBB.com</strong>
          </Link>
          {/*
          <Link to='/' className='title item'>General</Link>
          <Link to='/forums/steem' className='title item'>Steem</Link>
          <Link to='/forums/crypto' className='title item'>Crypto</Link>
          */}
          <Menu.Menu position='right'>
            {pendingBalance}
            {userItem}
            <Menu.Item>
              {indicator}
            </Menu.Item>
          </Menu.Menu>
        </Container>
      </Menu>
    )
  }
}


function mapStateToProps(state, ownProps) {
  return {
    account: state.account,
    accounts: state.accounts,
    preferences: state.preferences,
    status: state.status
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({
    ...accountActions,
    ...accountsActions,
    ...statusActions
  }, dispatch)}
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderMenu);
