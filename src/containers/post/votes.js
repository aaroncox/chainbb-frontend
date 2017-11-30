import React from 'react';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import _ from 'lodash'
import TimeAgo from 'react-timeago'

import { Dimmer, Divider, Grid, Header, Icon, Label, Loader, Modal, Popup, Segment, Table } from 'semantic-ui-react'

import * as postActions from '../../actions/postActions'

import PostVoteTable from '../../components/elements/post/vote/table'
import PostVoteChartRewards from '../../components/elements/post/vote/chart/rewards'
import PostVoteChartWeight from '../../components/elements/post/vote/chart/weight'
import NumericLabel from '../../utils/NumericLabel';
import AccountLink from '../../components/elements/account/link'

class PostVotes extends React.Component {
  handleOnOpen = () => {
    const { author, permlink } = this.props.target
    setTimeout(() => {
      this.props.actions.fetchPostLive(author, permlink)
    }, 50)
    this.interval = setInterval(() => this.props.actions.fetchPostLive(author, permlink), 30000)
  }
  handleOnClose = () => {
    const { author, permlink } = this.props.target
    setTimeout(() => {
      this.props.actions.removePostLive(author, permlink)
      clearInterval(this.interval);
    }, 50)
  }
  render() {
    const numberFormat = {
      shortFormat: true,
      shortFormatMinValue: 1000
    };
    const { post, status, target } = this.props
    const id = (target && target['_id']) ? target['_id'] : [target['author'], target['permlink']].join('/')
    const allLive = post.live
    const allVotes = post.votes
    const voteLength = (target.votes) ? Object.keys(target.votes).length : (target.active_votes) ? target.active_votes.length : 0
    let count = voteLength
    let details = false
    let table = false
    let loader = {
          style:{
            minHeight: '100px',
            display: 'block'
          },
          content: 'Retrieving current votes...'
        },
        history = (
          <Dimmer active inverted style={loader.style}>
            <Loader size='large' content={loader.content}/>
          </Dimmer>
        );
    const votes = allVotes[id]
    const live = allLive[id]
    if(live && votes) {
      const {
        beneficiaries,
        last_payout,
        max_accepted_payout,
        pending_payout_value,
        total_payout_value
      } = live
      const declined_payout = (max_accepted_payout === '0.000 SBD')
      const payout_pending = (pending_payout_value !== '0.000 SBD')
      const payout_value = parseFloat(((payout_pending) ? pending_payout_value : total_payout_value).split(" ")[0]).toFixed(3)
      const payout_beneficiaries = (beneficiaries.length > 0) ? _.sumBy(beneficiaries, 'weight') / 100 : false
      const payout_value_post_curation = payout_value - (0.25 * payout_value)
      const total_vote_rshares = _.sumBy(votes, 'rshares')
      const total_vote_weight = _.sumBy(votes, 'weight')
      let distribution = {
        'total': 100,
        'curation': 25,
        'author': 100,
        'beneficiaries': 0,
      }
      let rewards = {}
      let beneficiary_weights = {}
      let beneficiary_rewards = {}
      if(payout_beneficiaries) {
        _.each(beneficiaries, (b) => {
          beneficiary_weights[b.account] = parseFloat((b.weight / 100).toFixed(2))
          beneficiary_rewards[b.account] = parseFloat((b.weight / 100).toFixed(2))
          beneficiary_rewards[b.account] = (payout_value_post_curation * (b.weight / 10000)).toFixed(3)
        })
        distribution['beneficiaries'] += payout_beneficiaries
        distribution['author'] -= payout_beneficiaries
      }
      _.forOwn(distribution, function(weight, party) {
        const v = (party === 'total') ? payout_value : payout_value_post_curation
        rewards[party] = (v * (weight / 100)).toFixed(3)
      });
      count = votes.length
      history = (
        <PostVoteTable
          live={live}
          target={target}
          votes={votes}
          status={status}
          total_vote_rshares={total_vote_rshares}
          total_vote_weight={total_vote_weight}
        />
      )
      const totals = []
      if(!payout_pending) {
        totals.push((
          <Table.Row key='distributed'>
            <Table.Cell>
              <small>
                rewards distributed
              </small>
            </Table.Cell>
            <Table.Cell>
              <small>
                {last_payout} UTC
              </small>
            </Table.Cell>
          </Table.Row>
        ))
      }
      _.forOwn(rewards, (reward, party) => {
        let subtable = false
        if(party === 'beneficiaries') {
          let account_rows = []
          _.forOwn(beneficiary_rewards, (reward, account) =>
            account_rows.push((
              <Table.Row key={account}>
                <Table.Cell>
                  <AccountLink username={account} />
                </Table.Cell>
                <Table.Cell>
                  {beneficiary_weights[account]}%
                </Table.Cell>
                <Table.Cell>
                  {reward}
                </Table.Cell>
              </Table.Row>
            )
          ))
          subtable = (
            <Table size='small'>
              <Table.Body>
                {account_rows}
              </Table.Body>
            </Table>
          )
        }
        totals.push((
          <Table.Row verticalAlign='top' key={party}>
            <Table.Cell>
              {party}
              {' '}
            </Table.Cell>
            <Table.Cell>
              {distribution[party]}%
            </Table.Cell>
            <Table.Cell>
              {(payout_pending)
                ? (
                  <Popup
                    trigger={
                      <Icon name='time' style={{marginRight: '0.5em'}} />
                    }
                    position='bottom center'
                    inverted
                    content='Pending'
                    basic
                  />
                )
                : false
              }
              {(declined_payout)
                ? (
                  <span>
                    <strike>{rewards[party]}</strike> (declined)
                  </span>
                )
                : rewards[party]
              }
            </Table.Cell>
          </Table.Row>
        ))
        if(subtable) {
          totals.push((
            <Table.Row key='subtable'>
              <Table.Cell colSpan='3'>
                {subtable}
              </Table.Cell>
            </Table.Row>
          ))
        }
      })
      table = (
        <Table size='small'>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell colSpan="10">
                Estimated Reward Breakdown
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {totals}
            <Table.Row>
              <Table.Cell colSpan="10" textAlign='center'>
                Totaling
                {' '}
                <strong>
                  <NumericLabel params={numberFormat}>{total_vote_rshares}</NumericLabel>
                </strong>
                {' '}
                rshares,
                {' '}
                <strong>
                  <NumericLabel params={numberFormat}>{total_vote_weight}</NumericLabel>
                </strong>
                {' '}
                weight, and
                {' '}
                <strong>
                  {count}
                </strong>
                {' '}
                votes.
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>
      )
      details = (
        <Grid>
          <Grid.Row>
            <Grid.Column width={6}>
              {table}
            </Grid.Column>
            <Grid.Column width={5}>
              <Segment basic clearing>
                <PostVoteChartRewards
                  target={target}
                  votes={votes}
                  status={status}
                />
              </Segment>
            </Grid.Column>
            <Grid.Column width={5}>
              <Segment basic clearing>
                <PostVoteChartWeight
                  target={target}
                  votes={votes}
                  status={status}
                />
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      )
    }
    const { action, author, permlink } = this.props.match.params
    const defaultOpen = (action === 'votes' && author === target.author && permlink === target.permlink)
    return (
      <Modal
        closeIcon={true}
        color='blue'
        defaultOpen={defaultOpen}
        onMount={this.handleOnOpen}
        onClose={this.handleOnClose}
        size='large'
        trigger={
          <Label color='blue' size='small' basic as='a' style={{marginLeft: '0.5em'}}>
            <Icon name='thumbs up' color='blue' />{count}&nbsp;
          </Label>
        }
        >
        <Segment basic style={{marginTop: 0, minHeight: '200px'}}>
          <Header icon='pie chart' style={{marginTop: 0}} content='Vote Information' />
          <Modal.Content>
            <Segment basic padded>
              <Header>
                Post Details: {id}
                <Header.Subheader>
                  This information was last updated <TimeAgo date={Date()} />.
                </Header.Subheader>
              </Header>
              {details}
              <Divider horizontal>Vote History</Divider>
              {history}
            </Segment>
          </Modal.Content>
        </Segment>
      </Modal>
    )
  }
}

function mapStateToProps(state, ownProps) {
  return {
    post: state.post,
    status: state.status
  }
}

function mapDispatchToProps(dispatch) {
  return {actions: bindActionCreators({
    ...postActions,
  }, dispatch)}
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(PostVotes));
