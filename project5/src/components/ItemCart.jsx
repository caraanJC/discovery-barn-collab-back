import { Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
const ItemCart = (props) => {
    const dispatch = useDispatch();

    return (
        <tr>
            <td>
                <Button className="btn btn-primary mr-3" title="Increase" onClick={() => dispatch({ type: "CHANGE_CART_ITEM_QUANTITY", payload: { itemid: props.item.id, type: "increase" } })}>
                    <i className="fas fa-plus" />
                </Button>
                <Button className="btnbtn-primary mr-3" title="Decrease" onClick={() => dispatch({ type: "CHANGE_CART_ITEM_QUANTITY", payload: { itemid: props.item.id, type: "decrease" } })}>
                    <i className="fas fa-minus" />
                </Button>
                <Button className="btn btn-primary mr-3" title="Remove Item" onClick={() => dispatch({ type: "DELETE_CART_ITEM", payload: props.item.id })}>
                    <i className="fas fa-trash-alt" />
                </Button>
            </td>
            <td>{props.item.name}</td>
            <td>{props.item.quantity}</td>
            <td>
                <i className="fas fa-dollar-sign mx-3" />
                {props.item.price}
            </td>
            <td>
                <i className="fas fa-dollar-sign mx-3" />
                {props.item.quantity * props.item.price}
            </td>
        </tr>
    );
};

export default ItemCart;
