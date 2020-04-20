import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { mapStateToProps, mapDispatchToProps } from '../common/store';
import { axiosGet } from '../common/axios';

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
export default class SnippetManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snippetData: null
    }
  }

  componentDidMount() {
    if (this.props.changeLoading) this.props.changeLoading(true);
    axiosGet('/analyze/findAnalyze/getAllAnalyze')
      .then(res => {
        this.setState({ snippetData: res.data.msg });
        if (this.props.changeLoading) this.props.changeLoading(false);
      });
  }

  render () {
    return (
      <div className="snippet-container">
        SnippetManage
      </div>
    );
  }
}