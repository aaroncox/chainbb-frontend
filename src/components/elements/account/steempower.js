import React from 'react';
import steem from 'steem';
import { Button, Container, Dropdown, Grid, Header, Icon, Menu, Popup } from 'semantic-ui-react'
import NumericLabel from '../../../utils/NumericLabel';

export default class AccountSteemPower extends React.Component {

  steemPower() {
    const { delegated_vesting_shares, received_vesting_shares, vesting_shares } = this.props.chainstate
    const vests = parseFloat(vesting_shares) - parseFloat(delegated_vesting_shares) + parseFloat(received_vesting_shares)
    return this.vests_to_sp(vests)
  }

  vests_to_sp = (vests) => {
    const { globalprops } = this.props
    const { total_vesting_fund_steem, total_vesting_shares } = globalprops
    return Math.round(steem.formatter.vestToSteem(vests, total_vesting_shares, total_vesting_fund_steem) * 1000) / 1000
  }

  render() {
    if(!this.props.chainstate) return false
    const numberFormat = {
      shortFormat: true,
      shortFormatMinValue: 1000
    };
    const power = this.steemPower()
    return (
      <NumericLabel params={numberFormat}>{power} SP</NumericLabel>

    )
  }

}
