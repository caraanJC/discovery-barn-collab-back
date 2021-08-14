import "./App.css";
import { useSelector, useDispatch } from "react-redux";
import React, { useState, useEffect } from "react";
import MenuItem from "./components/MenuItem";
import { v4 as uuid } from "uuid";
import { Container, Row, Col, Button, Form, Table } from "react-bootstrap";
import ItemModal from "./components/ItemModal";
import ItemCart from "./components/ItemCart";

const App = (props) => {
    const items = useSelector((state) => state.items);
    const cartItems = useSelector((state) => state.cartItems);
    const dispatch = useDispatch();
    const [filteredBy, setFilteredBy] = useState("All Categories");
    const [showModalFlag, setShowModalFlag] = useState(false);
    const [targetItemId, setTargetItemId] = useState("");

    useEffect(() => {
        dispatch({ type: "SET_ITEMS_ID" });
    }, []);

    const getUniqueCategories = () => {
        let uniqueCategories = ["All Categories"];
        items.map((item) => {
            if (uniqueCategories.indexOf(item.category) < 0) {
                uniqueCategories.push(item.category);
            }
            return item;
        });
        return uniqueCategories;
    };

    const handleFilter = (category) => {
        setFilteredBy(category);
    };

    const handleOpenModal = (showFlag, targetItemId) => {
        setShowModalFlag(showFlag);
        setTargetItemId(targetItemId);
    };

    const handleDeleteItem = (itemId) => {
        let itemCategory = "All Categories";
        items.map((item) => {
            if (item.id === itemId) {
                itemCategory = item.category;
            }
            return item;
        });
        const newItems = items.filter((item) => item.id !== itemId);
        dispatch({ type: "DELETE_ITEM", payload: itemId });

        if (newItems.filter((item) => item.category === itemCategory).length === 0) {
            handleFilter("All Categories");
        }
    };

    const getTotalCartAmount = () => {
        let totalAmount = 0;
        cartItems.map((item) => {
            totalAmount = totalAmount + item.price * item.quantity;
            return item;
        });
        return totalAmount;
    };

    let uniqueCategories = getUniqueCategories();
    return (
        <div className="App">
            <Container fluid>
                <Row>
                    <Col lg={12} xxl={7}>
                        <div className="menu">
                            <h1 className="mb-4 mt-5">Restaurant Menu</h1>
                            <Row className="mb-2">
                                <Col xs={12} sm={7} md={8} className="align-left">
                                    <Button className="myButton" onClick={() => handleOpenModal(true, "ADD")}>
                                        <i className="fas fa-plus" /> Add New Item
                                    </Button>
                                </Col>
                                <Col xs={12} sm={5} md={4}>
                                    <Form.Select onChange={(e) => handleFilter(e.target.value)} value={filteredBy}>
                                        {uniqueCategories.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Col>
                            </Row>
                            <Row xs={2} sm={2} md={2} lg={2} xl={3} className="itemBoxContainer">
                                {items.map((item) => (filteredBy === "All Categories" || filteredBy === item.category) && <MenuItem key={uuid()} item={item} onOpenModal={handleOpenModal} onDeleteItem={handleDeleteItem} />)}
                            </Row>
                        </div>
                    </Col>
                    <Col lg={12} xxl={5}>
                        <div className="cart">
                            <div className="cartTitle">
                                <i className="fas fa-shopping-cart" /> My Cart
                            </div>
                            <Table striped bordered>
                                <thead>
                                    <tr>
                                        <th></th>
                                        <th>Name</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.length === 0 && (
                                        <tr>
                                            <td colSpan="5">No Cart Items</td>
                                        </tr>
                                    )}
                                    {cartItems.map((item) => (
                                        <ItemCart key={item.id} item={item} />
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th colSpan="4">Total Amount</th>
                                        <th>
                                            <i className="fas fa-dollar-sign m-3" />
                                            {getTotalCartAmount()}
                                        </th>
                                    </tr>
                                </tfoot>
                            </Table>
                        </div>
                    </Col>
                </Row>
            </Container>
            <ItemModal key={uuid()} showModalFlag={showModalFlag} onOpenModal={handleOpenModal} onSetFilteredBy={setFilteredBy} targetItemId={targetItemId} />
        </div>
    );
};

export default App;
