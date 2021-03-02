var actions = {

    updateName:{
        type: 'updateName',
        payload:{
            name: "Default"
        }
    },

    updateEmail:{
        type: 'updateEmail',
        payload: {
            email: "Default"
        }
    },

    setItem: {
        type: 'setItem',
        payload: {
            items: []
        }
    },

    addItem: {
        type: 'addItem',
        payload: {
            item: []
        }
    },

    deleteItem: {
        type: 'deleteItem',
        payload: {
            idx: 0,
            items: []
        }
    },

    setCartItem: {
        type: 'setCartItem',
        payload: {
            items: []
        }
    },

    addCartItem:{
        type: 'addCartItem',
        payload: {
            item: ""
        }
    },

    deleteCartItem: {
        type: 'deleteCartItem',
        payload: {
            idx: 0,
            cart: []
        }
    }

}

export default actions;