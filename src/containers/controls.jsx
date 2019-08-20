import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import VM from 'scratch-vm';
import {connect} from 'react-redux';
import {PERIPHERALS_TAB_INDEX} from '../reducers/editor-tab';
import {setUploading} from '../reducers/code-tab';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import ControlsComponent from '../components/controls/controls.jsx';

const messages = defineMessages({
    goTitle: {
        id: 'gui.controls.go',
        defaultMessage: 'Go',
        description: 'Green flag button title'
    },
    stopTitle: {
        id: 'gui.controls.stop',
        defaultMessage: 'Stop',
        description: 'Stop button title'
    },
    uploadTitle: {
        id: 'gui.akari.upload',
        defaultMessage: '上传'
    },
    cancelTitle: {
        id: 'gui.akari.cancel',
        defaultMessage: '取消'
    }
});

class Controls extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleGreenFlagClick',
            'handleStopAllClick',
            'handleCodeUpload',
            'handleCancelCodeUpload'
        ]);
    }
    handleGreenFlagClick (e) {
        e.preventDefault();
        if (e.shiftKey) {
            this.props.vm.setTurboMode(!this.props.turbo);
        } else {
            if (!this.props.isStarted) {
                this.props.vm.start();
            }
            this.props.vm.greenFlag();
        }
    }
    handleStopAllClick (e) {
        e.preventDefault();
        this.props.vm.stopAll();
    }
    handleCodeUpload (e) {
        e.preventDefault();
        if (!this.props.uploading) {
            console.log('upload');
            this.props.setUploading(true);
        }
    }
    handleCancelCodeUpload (e) {
        e.preventDefault();
        if (this.props.uploading) {
            console.log('cancel');
            this.props.setUploading(false);
        }
    }
    render () {
        const {
            /* eslint-disable no-unused-vars */
            vm,
            isStarted,
            setUploading: a,
            peripheralsTabVisible,
            /* eslint-disable no-unused-vars */
            uploading,
            projectRunning,
            intl,
            turbo,
            ...props
        } = this.props;
        return peripheralsTabVisible ? (
            <ControlsComponent
                {...props}
                active={uploading}
                goTitle={intl.formatMessage(messages.uploadTitle)}
                stopTitle={intl.formatMessage(messages.cancelTitle)}
                turbo={false}
                onGreenFlagClick={this.handleCodeUpload}
                onStopAllClick={this.handleCancelCodeUpload}
            />
        ) : (
            <ControlsComponent
                {...props}
                active={projectRunning}
                goTitle={intl.formatMessage(messages.goTitle)}
                stopTitle={intl.formatMessage(messages.stopTitle)}
                turbo={turbo}
                onGreenFlagClick={this.handleGreenFlagClick}
                onStopAllClick={this.handleStopAllClick}
            />
        );
    }
}

Controls.propTypes = {
    uploading: PropTypes.bool.isRequired,
    intl: intlShape.isRequired,
    isStarted: PropTypes.bool.isRequired,
    peripheralsTabVisible: PropTypes.bool.isRequired,
    projectRunning: PropTypes.bool.isRequired,
    setUploading: PropTypes.func.isRequired,
    turbo: PropTypes.bool.isRequired,
    vm: PropTypes.instanceOf(VM)
};

const mapStateToProps = state => ({
    uploading: state.scratchGui.codeTab.uploading,
    isStarted: state.scratchGui.vmStatus.running,
    peripheralsTabVisible: state.scratchGui.editorTab.activeTabIndex === PERIPHERALS_TAB_INDEX,
    projectRunning: state.scratchGui.vmStatus.running,
    turbo: state.scratchGui.vmStatus.turbo
});

const mapDispatchToProps = dispatch => ({
    setUploading: data => dispatch(setUploading(data))
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(Controls));
