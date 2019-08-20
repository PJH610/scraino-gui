import bindAll from 'lodash.bindall';
import debounce from 'lodash.debounce';
import defaultsDeep from 'lodash.defaultsdeep';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import ScratchBlocks from 'scratch-blocks';
import VM from 'scratch-vm';

import errorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import BlocksComponent from '../components/blocks/blocks.jsx';
import {setCategoryId, setOffset} from '../reducers/peripherals';
import {setProjectChanged} from '../reducers/project-changed';
import {setCode} from '../reducers/code-tab';

class PeripheralTab extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'setBlocks',
            'workspaceOnChange',
            'handleExtensionAdded',
            'handleStatusButtonUpdate',
            'handleProjectNew'
        ]);
        this.state = {};
    }

    componentDidMount () {
        this.props.vm.runtime.peripheralExtensions.tabVisible = true;

        const workspaceConfig = defaultsDeep({}, PeripheralTab.defaultOptions, this.props.options, {
            rtl: this.props.isRtl,
            toolbox: ScratchBlocks.Blocks[`${this.props.vm.runtime.peripheralExtensions.id}Toolbox`]
        });
        this.workspace = ScratchBlocks.inject(this.blocks, workspaceConfig);

        this.setToolboxRefreshEnabled = this.workspace.setToolboxRefreshEnabled.bind(this.workspace);
        this.workspace.setToolboxRefreshEnabled = () => this.setToolboxRefreshEnabled(false);

        const xml = this.props.vm.runtime.peripheralExtensions.blocksXML;
        if (xml) {
            const dom = ScratchBlocks.Xml.textToDom(xml);
            ScratchBlocks.Xml.clearWorkspaceAndLoadFromXml(dom, this.workspace);
        }

        const categoryId = this.props.categoryId;
        const offset = this.props.offset;
        if (categoryId) {
            const currentCategoryPos = this.workspace.toolbox_.getCategoryPositionById(categoryId);
            const currentCategoryLen = this.workspace.toolbox_.getCategoryLengthById(categoryId);
            if (offset < currentCategoryLen) {
                this.workspace.toolbox_.setFlyoutScrollPos(currentCategoryPos + offset);
            } else {
                this.workspace.toolbox_.setFlyoutScrollPos(currentCategoryPos);
            }
        }

        this.props.vm.stopAll();
        this.props.vm.addListener('EXTENSION_ADDED', this.handleExtensionAdded);
        this.props.vm.addListener('PERIPHERAL_CONNECTED', this.handleStatusButtonUpdate);
        this.props.vm.addListener('PERIPHERAL_DISCONNECTED', this.handleStatusButtonUpdate);
        this.props.vm.addListener('_PROJECT_NEW', this.handleProjectNew);

        this.workspace.addChangeListener(this.workspaceOnChange);
        this.workspaceToCode_ = debounce(this.workspaceToCode, 200);
    }

    shouldComponentUpdate () {
        return false;
    }

    componentWillUnmount () {
        this.props.vm.runtime.peripheralExtensions.tabVisible = false;

        const dom = ScratchBlocks.Xml.workspaceToDom(this.workspace);
        const xml = ScratchBlocks.Xml.domToPrettyText(dom);
        this.props.vm.runtime.peripheralExtensions.blocksXML = xml;

        const categoryId = this.workspace.toolbox_.getSelectedCategoryId();
        const offset = this.workspace.toolbox_.getCategoryScrollOffset();
        this.props.setScroll(categoryId, offset);

        this.props.vm.removeListener('EXTENSION_ADDED', this.handleExtensionAdded);
        this.props.vm.removeListener('PERIPHERAL_CONNECTED', this.handleStatusButtonUpdate);
        this.props.vm.removeListener('PERIPHERAL_DISCONNECTED', this.handleStatusButtonUpdate);
        this.props.vm.removeListener('_PROJECT_NEW', this.handleProjectNew);

        this.workspace.removeChangeListener(this.workspaceOnChange_);
        this.workspace.dispose();
    }

    setBlocks (blocks) {
        this.blocks = blocks;
    }

    workspaceOnChange () {
        this.props.onProjectChanged();
        this.workspaceToCode_();
    }

    workspaceToCode () {
        // const code = ScratchBlocks.Python.workspaceToCode(this.workspace);
        this.props.setCode(`${Date.now()}`);
    }

    handleExtensionAdded (categoryInfo) {
        console.log('categoryInfo', categoryInfo);
        // const toolbox = ScratchBlocks.Blocks[`${this.props.vm.runtime.peripheralExtensions.id}Toolbox`];
        const toolbox =
            '<xml id="toolbox-categories" style="display: none"><category name="Nano" id="nano" ' +
            'colour="#FF6680" secondaryColour="#FF4D6A" showStatusButton="true"></category></xml>';
        this.workspace.updateToolbox(toolbox);
    }

    handleStatusButtonUpdate () {
        ScratchBlocks.refreshStatusButtons(this.workspace);
    }

    handleProjectNew () {
        this.props.vm.runtime.peripheralExtensions.blocksXML = null;
        this.workspace.clear();
    }

    render () {
        return (<BlocksComponent
            containerRef={this.setBlocks}
            grow={this.props.grow}
        />);
    }
}

PeripheralTab.propTypes = {
    categoryId: PropTypes.string,
    grow: PropTypes.number,
    isRtl: PropTypes.bool,
    offset: PropTypes.number,
    onProjectChanged: PropTypes.func.isRequired,
    options: PropTypes.shape({
        media: PropTypes.string,
        zoom: PropTypes.shape({
            controls: PropTypes.bool,
            wheel: PropTypes.bool,
            startScale: PropTypes.number
        }),
        colours: PropTypes.shape({
            workspace: PropTypes.string,
            flyout: PropTypes.string,
            toolbox: PropTypes.string,
            toolboxSelected: PropTypes.string,
            scrollbar: PropTypes.string,
            scrollbarHover: PropTypes.string,
            insertionMarker: PropTypes.string,
            insertionMarkerOpacity: PropTypes.number,
            fieldShadow: PropTypes.string,
            dragShadowOpacity: PropTypes.number
        }),
        comments: PropTypes.bool,
        collapse: PropTypes.bool
    }),
    setCode: PropTypes.func,
    setScroll: PropTypes.func,
    vm: PropTypes.instanceOf(VM).isRequired
};

PeripheralTab.defaultOptions = {
    zoom: {
        controls: true,
        wheel: true,
        startScale: 0.675
    },
    grid: {
        spacing: 40,
        length: 2,
        colour: '#ddd'
    },
    colours: {
        workspace: '#F9F9F9',
        flyout: '#F9F9F9',
        toolbox: '#FFFFFF',
        toolboxSelected: '#E9EEF2',
        scrollbar: '#CECDCE',
        scrollbarHover: '#CECDCE',
        insertionMarker: '#000000',
        insertionMarkerOpacity: 0.2,
        fieldShadow: 'rgba(255, 255, 255, 0.3)',
        dragShadowOpacity: 0.6
    },
    comments: true,
    collapse: false,
    sounds: false
};

const mapStateToProps = state => ({
    isRtl: state.locales.isRtl,
    categoryId: state.scratchGui.peripherals.categoryId,
    offset: state.scratchGui.peripherals.offset
});

const mapDispatchToProps = dispatch => ({
    onProjectChanged: () => dispatch(setProjectChanged()),
    setCode: data => dispatch(setCode(data)),
    setScroll: (categoryId, offset) => {
        dispatch(setCategoryId(categoryId));
        dispatch(setOffset(offset));
    }
});

export default errorBoundaryHOC('PeripheralTab')(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(PeripheralTab)
);
