import React from 'react';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux'
import _ from 'lodash'
import TimeAgo from 'react-timeago'

import { Dimmer, Divider, Grid, Header, Icon, Label, Loader, Modal, Segment, Table } from 'semantic-ui-react'

import * as postActions from '../../actions/postActions'

import PostVoteTable from '../../components/elements/post/vote/table'
import PostVoteChartRewards from '../../components/elements/post/vote/chart/rewards'
import PostVoteChartWeight from '../../components/elements/post/vote/chart/weight'
import NumericLabel from '../../utils/NumericLabel';

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
      const total_vote_rshares = _.sumBy(votes, 'rshares')
      const total_vote_weight = _.sumBy(votes, 'weight')
      let distribution = {
        'total': 100,
        'author': 75,
        'curation': 25,
        'beneficiaries': 0
      }
      if(payout_beneficiaries) {
        distribution['author'] -= payout_beneficiaries
        distribution['beneficiaries'] += payout_beneficiaries
      }
      let rewards = {}
      _.forOwn(distribution, function(weight, party) {
        rewards[party] = (payout_value * (weight / 100)).toFixed(3)
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
        totals.push((
          <Table.Row key={party}>
            <Table.Cell>
              {party} rewards
              {' '}
              [{distribution[party]}%]
            </Table.Cell>
            <Table.Cell>
              {(declined_payout)
                ? (
                  <span>
                    <strike>{rewards[party]}</strike> (declined)
                  </span>
                )
                : rewards[party]
              }
              {(payout_pending)
                ? ' (pending)'
                : false
              }
            </Table.Cell>
          </Table.Row>
        ))
      })
      table = (
        <Table definition size='small'>
          <Table.Body>
            {totals}
            <Table.Row>
              <Table.Cell>rshares (total)</Table.Cell>
              <Table.Cell><NumericLabel params={numberFormat}>{total_vote_rshares}</NumericLabel></Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>weight (total)</Table.Cell>
              <Table.Cell><NumericLabel params={numberFormat}>{total_vote_weight}</NumericLabel></Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>votes</Table.Cell>
              <Table.Cell>{count}</Table.Cell>
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
