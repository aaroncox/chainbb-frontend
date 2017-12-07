import React from 'react';
import { Grid, Header, Icon, Segment } from 'semantic-ui-react'
import TimeAgo from 'react-timeago'
import { Link } from 'react-router-dom'
import slug from 'slug'

import AccountAvatar from '../account/avatar'
import AccountLink from '../account/link'
import Paginator from './post/paginator'
import ForumPostModeration from './post/moderation'
import PlatformLink from '../../../utils/link/platform'
import ForumPostText from './post/types/text'
import ForumPostThumbnail from './post/types/thumbnail'

export default class ForumPost extends React.Component {
  constructor(props) {
    super(props)
    const hasModeration = (props && props.forum && props.forum.funded >= 1) ? true : false
    const isModerator = hasModeration && (props && props.account && props.account.isUser && props.account.name === props.forum.creator)
    this.state = {
      isModerator: isModerator,
      hovering: false,
      moderating: false,
    }
  }
  onMouseEnter = () => this.setState({hovering: true})
  onMouseLeave = () => this.setState({hovering: false})
  onOpen = () => this.setState({moderating: true})
  onClose = (removePost = false) => this.setState({moderating: false})
  changeFilter = (e, data) => {
      const tag = slug(data.value).toString()
      this.props.changeFilter(tag)
  }
  render() {
    let { account, forum, moderation, topic } = this.props
    return (
      <ForumPostText
        state={this.state}
        {... this.props}
      />
      // <ForumPostThumbnail
      //   state={this.state}
      //   {... this.props}
      // />
    )
  }
}
