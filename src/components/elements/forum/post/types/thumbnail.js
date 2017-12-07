import React from 'react';
import { Button, Card, Grid, Header, Icon, Image, Segment } from 'semantic-ui-react'
import TimeAgo from 'react-timeago'
import { Link } from 'react-router-dom'

import AccountAvatar from '../../../account/avatar'
import AccountLink from '../../../account/link'
import Paginator from '../paginator'
import ForumPostModeration from '../moderation'
import PlatformLink from '../../../../../utils/link/platform'

export default class ForumPostThumbnail extends React.Component {
  render() {
    let { account, forum, moderation, topic } = this.props,
        moderatorRemoved = (topic._removedFrom && topic._removedFrom.indexOf(forum['_id']) >= 0),
        control =
            (moderatorRemoved)
            ? <Icon name='trash' />
            : (topic.cbb && topic.cbb.sticky)
            ? <Icon name='pin' />
            : (topic.children > 50)
            ? <Icon color='blue' name='chevron right' />
            : (topic.children > 20)
            ? <Icon color='blue' name='angle double right' />
            : (topic.children > 0)
            ? <Icon color='blue' name='angle right' />
            : <Icon name='circle thin' />
        ,
        paginator = false,
        last_reply = (
          <Grid.Column mobile={6} tablet={6} computer={5} largeScreen={4} textAlign="center">
            No Replies
          </Grid.Column>
        )
    if(topic.children > 10) {
      paginator = (
        <Paginator
          perPage={10}
          total={topic.children}
          url={topic.url}
        />
      )
    }
    if(topic.last_reply) {
      last_reply = (
        <Grid.Column mobile={6} tablet={6} computer={4} largeScreen={4} widescreen={4}>
          <AccountAvatar
            username={topic.last_reply_by}
            style={{minHeight: '35px', minWidth: '35px', marginBottom: 0}}
          />
          <AccountLink username={topic.last_reply_by} />
          <br/>
          {(topic.last_reply_url)
            ? (
              <Link to={topic.last_reply_url}>
                <TimeAgo date={`${topic.last_reply}Z`} />
              </Link>
            )
            : (
              <TimeAgo date={`${topic.last_reply}Z`} />
            )
          }
        </Grid.Column>
      )
    }
    if(this.props.state.isModerator && (this.props.state.hovering || this.props.state.moderating)) {
      control = (
        <ForumPostModeration
          account={account}
          actions={this.props.actions}
          forum={forum}
          moderation={moderation}
          topic={topic}
          onOpen={this.onOpen.bind(this)}
          onClose={this.onClose.bind(this)}
          removeTopic={this.props.removeTopic}
        />
      )
    }
    const thumbnail = (topic.json_metadata && topic.json_metadata.image && topic.json_metadata.image.length > 0) ? topic.json_metadata.image[0] : null
    return (
      <Card
        key={topic._id}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        tertiary={moderatorRemoved}
        >
        <Image src={'https://steemitimages.com/290x200/' + thumbnail} />
        <Card.Content>
          <Card.Header>
            <Link to={`/${(forum) ? forum._id : topic.category}/@${topic._id}`}>
              {topic.title}
            </Link>
          </Card.Header>
          <Card.Meta>
            <Image avatar floated='right' size='mini' src={`https://steemitimages.com/u/${topic.author}/avatar/small`} />
          </Card.Meta>
          <Card.Description>
          </Card.Description>
        </Card.Content>
        <Card.Content extra>
        </Card.Content>
      </Card>
    )
  }
}
