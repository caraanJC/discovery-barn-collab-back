import { Col, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
const MenuItem = (props) => {
    const dispatch = useDispatch();
    const handleOpenModal = (flag, targetItemId) => {
        props.onOpenModal(flag, targetItemId);
    };

    const handleDeleteItem = (itemId) => {
        props.onDeleteItem(itemId);
    };
    return (
        <>
            <Col>
                <div className="itemBox">
                    <div className="itemBox-image">
                        <img src={props.item.image} alt={props.name} />
                    </div>
                    <div className="itemBox-text">
                        <strong>{props.item.name}</strong>
                        <p>
                            <small>{props.item.price}</small>
                        </p>
                        <p>
                            <small>{props.item.category}</small>
                        </p>
                        <p>
                            <Button className="itemBox-button myButton mb-2" onClick={() => dispatch({ type: "ORDER_ITEM", payload: props.item.id })}>
                                <i className="fas fa-cart-plus" /> Order
                            </Button>
                            <Button className="itemBox-button myButton mb-2" onClick={() => handleOpenModal(true, props.item.id)}>
                                <i className="fas fa-edit" /> Edit
                            </Button>
                            <Button className="itemBox-button myButton mb-2" onClick={() => handleDeleteItem(props.item.id)}>
                                <i className="fas fa-trash-alt" /> Delete
                            </Button>
                        </p>
                    </div>
                </div>
            </Col>
        </>
    );
};

export default MenuItem;
