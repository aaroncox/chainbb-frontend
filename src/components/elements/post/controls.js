import React from 'react';

import { Segment } from 'semantic-ui-react'

import VoteButton from './button/vote'

export default class PostControls extends React.Component {

  castVote = (payload) => {
    const id = [payload.author, payload.permlink].join("/")
    this.props.actions.setVoteProcessing(id)
    this.props.actions.castVote(payload)
  }

  clearVoteError = (payload) => {
    this.props.actions.clearVoteError(payload)
  }

  render() {
    let data = this.props.post
    let post = this.props.target
    let processing = data.processing
    const button = (
      <VoteButton
        account={this.props.account}
        status={this.props.status}
        post={post}
        loading={(processing.votes.indexOf(post._id) !== -1)}
        error={(processing.errors[post._id] ? processing.errors[post._id] : false)}
        onWeightChange={this.props.actions.setPreference}
        clearVoteError={this.clearVoteError}
        onVoteCast={this.castVote}
        weight={this.props.preferences.votePowerPost}
      />
    )
    if (this.props.onlyButton) {
      return button
    }
    return (
      <Segment secondary basic clearing attached textAlign='right'>
        {button}
        {this.props.editButton}
        {this.props.postButton}
      </Segment>
    )
  }
}
