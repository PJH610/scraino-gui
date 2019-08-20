// const EXTENSION_ID = 'scratch-gui/peripherals/EXTENSION_ID';
// const BLOCKS_XML = 'scratch-gui/peripherals/BLOCKS_XML';
const CATEGORY_ID = 'scratch-gui/peripherals/CATEGORY_ID';
const OFFSET = 'scratch-gui/peripherals/OFFSET';

const initialState = {
    // extensionId: 'nano',
    // blocksXML: null,
    categoryId: null,
    offset: 0
};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    // case EXTENSION_ID:
    //     return Object.assign({}, state, {
    //         extensionId: action.data
    //     });
    // case BLOCKS_XML:
    //     return Object.assign({}, state, {
    //         blocksXML: action.data
    //     });
    case CATEGORY_ID:
        return Object.assign({}, state, {
            categoryId: action.data
        });
    case OFFSET:
        return Object.assign({}, state, {
            offset: action.data
        });
    default:
        return state;
    }
};

// const setExtensionId = data => ({type: EXTENSION_ID, data});
// const setBlocksXML = data => ({type: BLOCKS_XML, data});
const setCategoryId = data => ({type: CATEGORY_ID, data});
const setOffset = data => ({type: OFFSET, data});

export {
    reducer as default,
    initialState as peripheralsInitialState,
    // setExtensionId,
    // setBlocksXML,
    setCategoryId,
    setOffset
};
