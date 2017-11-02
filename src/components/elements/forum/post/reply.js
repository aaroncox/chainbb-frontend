import React from 'react';

import { Divider, Grid, Header, Icon, Label, Segment } from 'semantic-ui-react'
import TimeAgo from 'react-timeago'
import { Link } from 'react-router-dom'
import PlatformLink from '../../../../utils/link/platform'
import PostReplyContent from '../../post/reply/content'
import MarkdownViewer from '../../../../utils/MarkdownViewer';
import AccountAvatar from '../../account/avatar'
import AccountLink from '../../account/link'

export default class ForumPostReply extends React.Component {
  render() {
    const {topic} = this.props
    const { parent, reply } = topic
    const votes = Object.keys(reply.votes).length
    let quote = false
    if(parent.depth > 0) {
      quote = (
        <div>
          <Segment padded>
            <Header size='small'>
              <AccountLink username={parent.author} />
              {' '}
              posted
              {' '}
              <TimeAgo date={`${parent.created}Z`} />
              {' '}
              ...
            </Header>
            <MarkdownViewer text={parent.body} jsonMetadata={{}} large highQualityPost={true}  />
          </Segment>
          <Divider hidden></Divider>
          <Divider hidden></Divider>
        </div>
      )
    }
    return (
      <Grid>
        <Grid.Row verticalAlign='middle'>
          <Grid.Column tablet={16} computer={16} mobile={16}>
            <Segment style={{ borderTop: '2px solid #2185D0' }} secondary attached stacked={(this.props.op && this.props.page !== 1)}>
              <Grid>
                <Grid.Row verticalAlign='top'>
                  <Grid.Column tablet={13} computer={13} mobile={13}>
                    <Header size='medium'>
                      <AccountAvatar username={reply.author} />
                      <AccountLink username={reply.author} />
                      <Header.Subheader>
                        {'↳ '}
                        <TimeAgo date={`${reply.created}Z`} />
                        {' • '}
                        <Link to={`/${reply.category}/@${reply.root_post}`}>
                          {parent.root_title}
                        </Link>
                      </Header.Subheader>
                    </Header>
                  </Grid.Column>
                  <Grid.Column tablet={3} computer={3} mobile={3} textAlign='right' verticalAlign='middle'>
                      <small>
                        <PlatformLink platform={reply.json_metadata.app} />
                      </small>
                    <Label color='blue' size='small' basic as='a' style={{marginLeft: '0.5em'}}>
                        <Icon name='thumbs up' color='blue' />{votes}&nbsp;
                    </Label>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Segment>
            <PostReplyContent
              content={reply}
              hideAuthor={true}
              quote={quote}
              op={false}
              scrollToLatestPost={this.scrollToLatestPost}
              {...this.props}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
