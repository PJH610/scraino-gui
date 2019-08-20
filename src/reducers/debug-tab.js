const VISIBLE = 'scratch-gui/debug-tab/VISIBLE';

const initialState = {
    visible: false
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case VISIBLE:
        return Object.assign({}, state, {
            visible: action.data
        });
    default:
        return state;
    }
};

const setVisible = data => ({type: VISIBLE, data});

export {reducer as default, initialState as debugTabInitialState, setVisible};
