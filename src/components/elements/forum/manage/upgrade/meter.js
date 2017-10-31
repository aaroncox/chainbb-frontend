import React from 'react';

import { Header, List, Modal, Progress, Segment } from 'semantic-ui-react'

export default class ForumUpgradeMeter extends React.Component {
    render() {
        const { target } = this.props
        const { funded, progression } = target
        const { progress, required } = progression
        const percent = Math.round(progression.progress / progression.required * 10000) / 100
        return(
            <div>
                <Progress percent={percent} indicating size='small'>
                    {percent}% complete - {progress} / {required}
                </Progress>
            </div>
        );
    }
}
