import React from 'react';

import { Progress } from 'semantic-ui-react'

export default class ForumUpgradeMeter extends React.Component {
    render() {
        const { percent, target } = this.props
        const { progression } = target
        const { progress, required } = progression
        return(
            <div>
                <Progress percent={percent} indicating size='small'>
                    {progress} STEEM / {required} STEEM
                </Progress>
            </div>
        );
    }
}
