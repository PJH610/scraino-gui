import PropTypes from 'prop-types';
import bindAll from 'lodash.bindall';
import React from 'react';
import {connect} from 'react-redux';
import {setVisible} from '../reducers/debug-tab';
import DebugTabComponent from '../components/debug-tab/debug-tab.jsx';

class DebugTab extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, ['handleToggle']);
        this.state = {};
    }
    componentDidMount () {}
    componentDidUpdate (prevProps) {
        if (prevProps.visible !== this.props.visible) {
            window.dispatchEvent(new Event('resize'));
        }
    }
    componentWillUnmount () {}
    handleToggle () {
        this.props.setVisible(!this.props.visible);
    }
    render () {
        return (<DebugTabComponent
            visible={this.props.visible}
            onToggle={this.handleToggle}
        />);
    }
}

DebugTab.propTypes = {
    setVisible: PropTypes.func.isRequired,
    visible: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
    visible: state.scratchGui.debugTab.visible
});

const mapDispatchToProps = dispatch => ({
    setVisible: data => dispatch(setVisible(data))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DebugTab);
