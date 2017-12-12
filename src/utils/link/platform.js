import React from 'react'

const fallback = {
  id: 'unknown',
  name: 'unknown',
  url: false,
  pages: [],
  version: '',
}

const platforms = [
  {
    id: 'busy',
    name: 'busy',
    url: 'https://busy.org',
    pages: ['account', 'comment'],
  },
  {
    id: 'chainbb',
    name: 'chainbb',
    url: 'https://chainbb.com',
    pages: ['account', 'comment'],
  },
  {
    id: 'esteem',
    name: 'esteem',
    url: 'http://esteem.ws',
    pages: ['account', 'comment'],
  },
  {
    id: 'steemit',
    name: 'steemit',
    url: 'https://steemit.com',
    pages: ['account', 'comment'],
  },
  {
    id: '⇐stoned⇔pastries⇒',
    name: '⇐stoned⇔pastries⇒',
    url: 'https://minnowbooster.net',
    pages: ['account', 'comment'],
  },
]

export default class PlatformLink extends React.Component {
  platform = (post) => {
    if(!post || !post.json_metadata) {
      return fallback
    }
    const apptag = post.json_metadata.app
    if(apptag) {
      const [ id, version ] = apptag.split('/')
      const platform = platforms.find(o => o.id === id)
      if(platform) {
        platform['version'] = version
        return platform
      }
    }
    return fallback
  }
  canonical = (platform, post) => {
    if (platform['url'] === false) return false
    return platform['url'] + post['url']
  }
  render() {
    let { platform, post } = this.props,
    link = <span>{platform}</span>,
    url = ''
    if(post) {
      platform = this.platform(post)
      url = this.canonical(platform, post)
      if(url) {
        link = <a rel='nofollow' alt={`${platform.name}`} href={`${url}`}>{platform.name}/{platform.version}</a>
      } else if(post.json_metadata) {
        const apptag = post.json_metadata.app
        link = <span>{ (apptag) ? apptag : platform.name }</span>
      } else {
        link = <span>Unknown</span>
      }
    }
    return(link);
  }
}
