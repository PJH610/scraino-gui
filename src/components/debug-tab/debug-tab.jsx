import React from 'react';
import PropTypes from 'prop-types';
import {FormattedMessage} from 'react-intl';

import styles from './debug-tab.css';

const DebugTabComponent = ({onToggle, visible}) => (
    <div className={styles.container}>
        <div
            className={styles.header}
            onClick={onToggle}
        >
            <FormattedMessage
                defaultMessage="调试信息"
                id="gui.debugTab.debugInfo"
            />
        </div>
        {visible ? <div className={styles.info} /> : null}
    </div>
);

DebugTabComponent.propTypes = {
    onToggle: PropTypes.func,
    visible: PropTypes.bool
};

export default DebugTabComponent;
