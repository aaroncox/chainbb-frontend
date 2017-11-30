import React from 'react';
import _ from 'lodash'
import { Label, Table } from 'semantic-ui-react'
import AccountLink from '../../account/link'
import NumericLabel from '../../../../utils/NumericLabel';

const colors = {
  'rshares': [
    { value: 1E17, color: 'pink' },
    { value: 1E14, color: 'orange' },
    { value: 1E11, color: 'purple' },
    { value: 1E8,  color: 'blue' },
    { value: 1E5,  color: 'green' },
    { value: 1E3,  color: 'grey' }
  ],
  'curation': [
    { value: 10, color: 'pink' },
    { value: 1, color: 'orange' },
    { value: 0.1, color: 'purple' },
    { value: 0.01,  color: 'blue' },
    { value: 0.001,  color: 'green' },
    { value: 0,  color: 'grey' }
  ]
}

export default class PostVoteTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      column: 'rshares',
      data: _.sortBy(props.votes, ['rshares']).reverse(),
      direction: 'descending',
    }
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.votes && this.state.votes && nextProps.votes.lenth !== this.state.votes.lenth) {
      this.setState({
        data: nextProps.votes,
      })
    }
  }
  colorPicker = (type, num) => {
    var i;
    for (i = 0; i < colors[type].length; i++) {
      if (num >= colors[type][i].value) {
        return colors[type][i].color
      }
    }
    return 'grey'
  }
  estimate = (rshares) => {
    const { status } = this.props
    const { recent_claims, reward_balance, sbd_median_price } = status.network
    return rshares / recent_claims * reward_balance * sbd_median_price
  }
  handleSort = clickedColumn => () => {
    const { column, data, direction } = this.state
    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        data: _.sortBy(data, [clickedColumn]),
        direction: 'ascending',
      })
      return
    }
    this.setState({
      data: data.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending',
    })
  }
  render() {
    const numberFormat = {
      shortFormat: true,
      shortFormatMinValue: 1000
    };
    const { column, data, direction } = this.state
    const { live, total_vote_weight } = this.props
    const payout_pending = (live.pending_payout_value !== '0.000 SBD')
    const payout_value = parseFloat(((payout_pending) ? live.pending_payout_value : live.total_payout_value).split(" ")[0]).toFixed(3)
    const pending_curation_value = (payout_value * 0.25).toFixed(3)
    let rows = false
    if(data) {
      rows = data.map((vote) => {
        const authorReward = this.estimate(vote.rshares)
        const authorPercent = authorReward / payout_value
        const curationPercent = vote.weight / total_vote_weight
        const curationReward = (curationPercent * pending_curation_value).toFixed(3)
        return (
          <Table.Row key={vote.voter}>
            <Table.Cell>
              {vote.time} UTC
            </Table.Cell>
            <Table.Cell>
              <AccountLink username={vote.voter} />
            </Table.Cell>
            <Table.Cell textAlign='right'>
              {(vote.percent/100).toFixed(2)}%
            </Table.Cell>
            <Table.Cell textAlign='right'>
              <Label basic color={this.colorPicker('rshares', vote.rshares)}>
                +{authorReward.toFixed(3)}
                <Label.Detail>({(authorPercent * 100).toFixed(1)}%)</Label.Detail>
              </Label>
            </Table.Cell>
            <Table.Cell textAlign='right'>
              <NumericLabel params={numberFormat}>{vote.rshares}</NumericLabel>
            </Table.Cell>
            <Table.Cell textAlign='right'>
              <NumericLabel params={numberFormat}>{vote.weight}</NumericLabel>
            </Table.Cell>
            <Table.Cell textAlign='right'>
              <Label basic color={this.colorPicker('curation', curationReward)}>
                {curationReward}
                <Label.Detail>({(curationPercent * 100).toFixed(1)}%)</Label.Detail>
              </Label>
            </Table.Cell>
          </Table.Row>
        )
      })
    }

    return(
      <div>
        <Table size='small' sortable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell sorted={column === 'time' ? direction : null} onClick={this.handleSort('time')}>Time</Table.HeaderCell>
              <Table.HeaderCell sorted={column === 'voter' ? direction : null} onClick={this.handleSort('voter')}>Account</Table.HeaderCell>
              <Table.HeaderCell textAlign='right' sorted={column === 'percent' ? direction : null} onClick={this.handleSort('percent')}>%</Table.HeaderCell>
              <Table.HeaderCell textAlign='right' sorted={column === 'rshares' ? direction : null} onClick={this.handleSort('rshares')}>Author Reward</Table.HeaderCell>
              <Table.HeaderCell textAlign='right' sorted={column === 'rshares' ? direction : null} onClick={this.handleSort('rshares')}>rshares</Table.HeaderCell>
              <Table.HeaderCell textAlign='right' sorted={column === 'weight' ? direction : null} onClick={this.handleSort('weight')}>Weight</Table.HeaderCell>
              <Table.HeaderCell textAlign='right' sorted={column === 'weight' ? direction : null} onClick={this.handleSort('weight')}>Curation Reward</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows}
          </Table.Body>
        </Table>
      </div>
    );
  }
}
