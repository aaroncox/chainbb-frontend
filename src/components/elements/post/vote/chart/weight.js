import React from 'react';
import _ from 'lodash'

import { defaults } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';

defaults.global.animation = false;

export default class PostVoteChartWeight extends React.Component {
  state = {
    votes: []
  }
  constructor(props) {
    super(props)
    const { votes } = props
    this.state = {
      votes,
      chartData: {
        labels: votes.map((vote) => vote.voter),
      	datasets: [{
          data: votes.map((vote) => parseInt(vote.weight, 10)),
          backgroundColor: votes.map((vote) => this.getRandomColor()),
          borderWidth: 0,
        }]
      }
    }
  }
  getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.votes && this.state.votes && nextProps.votes.lenth !== this.state.votes.lenth) {
      const { votes } = nextProps
      this.setState({
        votes,
        chartData: {
          labels: votes.map((vote) => vote.voter),
        	datasets: [{
            data: votes.map((vote) => parseInt(vote.weight, 10)),
            backgroundColor: votes.map((vote) => this.getRandomColor()),
            borderWidth: 0,
          }]
        }
      })
    }
  }
  render() {
    const { chartData } = this.state
    const chartOptions = {
      animation: false,
      maintainAspectRatio: false,
      title: {
        display: true,
        text: 'Vote Weight by Voter'
      },
      legend: {
        display: false
      }
    }
    return (
      <Pie
        data={chartData}
        height={200}
        options={chartOptions}
      />
    )
  }
}
