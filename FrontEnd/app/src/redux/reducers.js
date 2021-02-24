

var name = (state = [], action) => {
    switch (action.type) {
        case 'updateName':
            state = action.payload.name;
            return state;
        default:
            return state
    }
}

var email = (state = [], action) => {
    switch (action.type) {
        case 'updateEmail':
            state = action.payload.email;
            return state;
        default:
            return state
    }
}

var items = (state = [], action)  => {
    switch (action.type) {
        case 'updateItems':
            state = action.payload.items;
            return state;
        default:
            return state
    }
}

var cart = (state = [], action) => {
    switch (action.type) {

        case 'setCartItem':
            state = action.payload.items;
            return state;

        case 'addCartItem':
            state.push([action.payload.item]);
            return state;

        case 'deleteCartItem':
            action.payload.cart.splice(action.payload.idx, 1);
            state = action.payload.cart;
            return state;

        default:
            return state
    }
}

var reducers = {
    name,
    email,
    items,
    cart
}

export default reducers;