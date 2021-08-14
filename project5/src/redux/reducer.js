import data from "../components/data";
import { v4 as uuid } from "uuid";
const initState = {
    items: data,
    cartItems: [],
};
const reducer = (state = initState, action) => {
    switch (action.type) {
        case "SET_ITEMS_ID":
            const itemsWithId = state.items.map((item) => {
                item.id = uuid();
                return item;
            });
            return { ...state, items: itemsWithId };
        case "ADD_ITEM":
            const newItemAddedList = [...state.items, action.payload];
            return { ...state, items: newItemAddedList };
        case "EDIT_ITEM":
            const updatedItemsAfterEdit = state.items.map((item) => {
                if (item.id === action.payload.id) {
                    item.name = action.payload.name;
                    item.price = action.payload.price;
                    item.category = action.payload.category;
                    item.image = action.payload.image;
                }
                return item;
            });

            const updatedCartItemsAfterEdit = state.cartItems.map((item) => {
                if (item.id === action.payload[0].id) {
                    item.name = action.payload[0].name;
                    item.price = action.payload[0].price;
                }
                return item;
            });

            return { ...state, items: updatedItemsAfterEdit, cartItems: updatedCartItemsAfterEdit };
        case "DELETE_ITEM":
            const updatedItemsAfterDeletion = state.items.filter((item) => item.id !== action.payload);
            const updatedCartItemsAfterDeletion = state.cartItems.filter((item) => item.id !== action.payload);
            return { ...state, items: updatedItemsAfterDeletion, cartItems: updatedCartItemsAfterDeletion };
        case "ORDER_ITEM":
            let existFlag = 0;
            let itemName, itemPrice;
            let cartItems = state.cartItems.map((item) => {
                if (item.id === action.payload) {
                    item.quantity = item.quantity + 1;
                    item.amount = item.quantity * item.price;
                    existFlag = 1;
                }
                return item;
            });
            if (existFlag === 0) {
                state.items.map((item) => {
                    if (item.id === action.payload) {
                        itemName = item.name;
                        itemPrice = item.price;
                    }
                    return item;
                });
                const newCartItem = {
                    id: action.payload,
                    name: itemName,
                    price: itemPrice,
                    quantity: 1,
                };
                cartItems = [...state.cartItems, newCartItem];
            }

            return { ...state, cartItems: cartItems };
        case "DELETE_CART_ITEM":
            const modifiedCartItems = state.cartItems.filter((item) => item.id !== action.payload);
            return { ...state, cartItems: modifiedCartItems };
        case "CHANGE_CART_ITEM_QUANTITY":
            let updatedCartItems = [];
            if (action.payload.type === "decrease") {
                updatedCartItems = state.cartItems.filter((item) => {
                    if (item.id === action.payload.itemid) {
                        if (item.quantity > 1) {
                            item.quantity = item.quantity - 1;
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return true;
                    }
                });
            } else {
                updatedCartItems = state.cartItems.map((item) => {
                    console.log(action.payload.itemid);
                    if (item.id === action.payload.itemid) {
                        item.quantity = item.quantity + 1;
                    }
                    return item;
                });
            }

            return { ...state, cartItems: updatedCartItems };
        default:
            return state;
    }
};

export default reducer;
