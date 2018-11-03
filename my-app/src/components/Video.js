import React from 'react'

export default class Video extends React.Component {
  render() {
    // console.log(this.props);
    return (
      <video
        id='video'
        style={{height:'480px', width:'640px'}}
        ref='video'
        preload='auto'
        controls={this.props.isPreview}
        autoPlay={!this.props.isPreview}
        src={this.props.url} />
    )
  }
}