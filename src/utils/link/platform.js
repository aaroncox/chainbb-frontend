import React from 'react'

const fallback = {
    id: 'unknown-client',
    name: 'unknown',
    url: 'https://steemit.com',
    pages: ['account', 'comment'],
    version: 'unknown',
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
        const apptag = post.json_metadata.app
        const [ id, version ] = apptag.split('/')
        const platform = platforms.find(o => o.id === id)
        if(platform) {
            platform['version'] = version
            return platform
        }
        return fallback
    }
    canonical = (platform, post) => {
        return platform['url'] + post['url']
    }
    render() {
        let { platform, post } = this.props,
            link = <span>{platform}</span>,
            url = ''
        if(post) {
            platform = this.platform(post)
            url = this.canonical(platform, post)
            link = <a rel='nofollow' alt={`${platform.name}`} href={`${url}`}>{platform.name}/{platform.version}</a>
        }
        return(link);
    }
}
