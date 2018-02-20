import React from 'react';
import steem from 'steem';
import { Button, Container, Dropdown, Grid, Header, Icon, Menu, Popup } from 'semantic-ui-react'

export default class AccountVotingPower extends React.Component {

  votingPower() {
    const { last_vote_time, voting_power } = this.props.chainstate
    const last_vote = new Date(last_vote_time);
    let actual_power = ((new Date() - last_vote) / 1000 * 10000 / 86400 / 5) + voting_power
    if(actual_power > 10000) {
      actual_power = 10000
    }
    return (actual_power / 100).toFixed(2);
  }

  render() {
    const { chainstate } = this.props
    if(!chainstate) return false
    return (
      <span>
        {this.votingPower()}%
      </span>
    )
  }
}
