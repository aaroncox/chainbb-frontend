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
    let count = (target.votes) ? Object.keys(target.votes).length : target.active_votes.length
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
      const pending_payout_value = parseFloat(live.pending_payout_value).toFixed(3)
      count = votes.length
      history = (
        <PostVoteTable
          live={live}
          target={target}
          votes={votes}
          status={status}
        />
      )
      table = (
        <Table definition>
          <Table.Body>
            <Table.Row>
              <Table.Cell>pending reward</Table.Cell>
              <Table.Cell>{pending_payout_value}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>author reward</Table.Cell>
              <Table.Cell>{(pending_payout_value * 0.75).toFixed(3)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>curation reward</Table.Cell>
              <Table.Cell>{(pending_payout_value * 0.25).toFixed(3)}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>rshares (total)</Table.Cell>
              <Table.Cell><NumericLabel params={numberFormat}>{live.abs_rshares}</NumericLabel></Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>weight (total)</Table.Cell>
              <Table.Cell><NumericLabel params={numberFormat}>{live.total_vote_weight}</NumericLabel></Table.Cell>
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
          <Grid.Row columns={3}>
            <Grid.Column>
              {table}
            </Grid.Column>
            <Grid.Column>
              <Segment basic clearing>
                <PostVoteChartRewards
                  target={target}
                  votes={votes}
                  status={status}
                />
              </Segment>
            </Grid.Column>
            <Grid.Column>
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
    if(count > 0) {
      return (
        <Modal
          closeIcon={true}
          color='blue'
          onMount={this.handleOnOpen}
          onClose={this.handleOnClose}
          // open={(target.author == 'binkley')}
          size='large'
          trigger={(
            <Label color='blue' size='small' basic as='a' style={{marginLeft: '0.5em'}}>
              <Icon name='thumbs up' color='blue' />{count}&nbsp;
            </Label>
          )}
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
    return (
      <Popup
        trigger={
          <Label size='small' basic as='a' style={{marginLeft: '0.5em', color: '#d4d4d5'}}>
            <Icon name='thumbs up' />{count}&nbsp;
          </Label>
        }
        position='bottom center'
        inverted
        content='This post has no votes.'
        basic
      />
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
