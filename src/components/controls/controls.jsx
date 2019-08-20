import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';

import GreenFlag from '../green-flag/green-flag.jsx';
import StopAll from '../stop-all/stop-all.jsx';
import TurboMode from '../turbo-mode/turbo-mode.jsx';

import styles from './controls.css';

const Controls = function (props) {
    const {
        active,
        className,
        goTitle,
        onGreenFlagClick,
        onStopAllClick,
        stopTitle,
        turbo,
        ...componentProps
    } = props;
    return (
        <div
            className={classNames(styles.controlsContainer, className)}
            {...componentProps}
        >
            <GreenFlag
                active={active}
                title={goTitle}
                onClick={onGreenFlagClick}
            />
            <StopAll
                active={active}
                title={stopTitle}
                onClick={onStopAllClick}
            />
            {turbo ? (
                <TurboMode />
            ) : null}
        </div>
    );
};

Controls.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    goTitle: PropTypes.string,
    onGreenFlagClick: PropTypes.func.isRequired,
    onStopAllClick: PropTypes.func.isRequired,
    stopTitle: PropTypes.string,
    turbo: PropTypes.bool
};

Controls.defaultProps = {
    active: false,
    turbo: false
};

export default Controls;
