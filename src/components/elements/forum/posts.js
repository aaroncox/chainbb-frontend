import React from 'react';

import { Card } from 'semantic-ui-react'

import ForumPost from './post'

export default class ForumPosts extends React.Component {
  render() {
    const { topics } = this.props
    return (
      // <Card.Group
      //   itemsPerRow={3}
      //   >
      <div>
        {topics.map((topic, idx) => (
          <ForumPost
            account={this.props.account}
            actions={this.props.actions}
            changeFilter={this.props.changeFilter}
            forum={this.props.forum}
            moderation={this.props.moderation}
            key={idx}
            topic={topic}
            removeTopic={this.props.removeTopic}
          />
        ))}
      </div>
      // </Card.Group>
    )
  }
}
