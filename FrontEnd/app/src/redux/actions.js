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

    updateItems:{
        type: 'updateItems',
        payload: {
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