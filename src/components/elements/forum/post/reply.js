import React from 'react';

import { Divider, Grid, Header, Segment } from 'semantic-ui-react'
import TimeAgo from 'react-timeago'
import PostReplyHeader from './reply/header'
import PostReplyContent from '../../post/reply/content'
import MarkdownViewer from '../../../../utils/MarkdownViewer';
import AccountLink from '../../account/link'

export default class ForumPostReply extends React.Component {
  render() {
    const {topic} = this.props
    const { parent, reply } = topic
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
            <PostReplyHeader
                content={reply}
                hideAuthor={true}
                quote={quote}
                op={false}
                {...this.props}
            />
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
