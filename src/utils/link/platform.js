import React from 'react'

export default class PlatformLink extends React.Component {
    render() {
      let { platform, post } = this.props,
          link = <span>{platform}</span>,
          url = ''
      if(post) {
          url = `/${post.category}/@${post.author}/${post.permlink}`
      }
      if(platform) {
        let [id, version] = platform.split("/")
        switch(id) {
          case "busy":
            link = <a rel='nofollow' alt={`${id}/${version}`} href={`https://busy.org${url}`}>busy/{version}</a>
            break
          case "chainbb":
            link = <a rel='nofollow' alt={`${id}/${version}`} href={`https://chainbb.com${url}`}>chainbb/{version}</a>
            break
          case "esteem":
            link = <a rel='nofollow' alt={`${id}/${version}`} href={`http://esteem.ws`}>esteem/{version}</a>
            break
          case "steemit":
            link = <a rel='nofollow' alt={`${id}/${version}`} href={`https://steemit.com${url}`}>steemit/{version}</a>
            break
          case "⇐stoned⇔pastries⇒":
            link = <a rel='nofollow' alt={`${id}/${version}`} href={`https://minnowbooster.net`}>⇐stoned⇔pastries⇒/{version}</a>
            break
          default:
            break
        }
      } else {
        link = <span>unknown client</span>
      }
      return(link);
    }
}
