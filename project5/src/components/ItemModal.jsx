import { Modal, Form, Button } from "react-bootstrap";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { v4 as uuid } from "uuid";

const ItemModal = (props) => {
    const [newName, setNewName] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [newImage, setNewImage] = useState("");
    const [appMessage, setAppMessage] = useState("");
    const dispatch = useDispatch();
    const items = useSelector((state) => state.items);

    const handleOnInputChange = (e, fieldtype) => {
        if (fieldtype === "newname") {
            setNewName(e.target.value);
        } else if (fieldtype === "newprice") {
            setNewPrice(e.target.value);
        } else if (fieldtype === "newcategory") {
            setNewCategory(e.target.value);
        } else if (fieldtype === "newimage") {
            setNewImage(e.target.value);
        }
    };

    /* function to add or edit an item */
    const handleAddItem = () => {
        if (newName.trim() === "" || newPrice.toString().trim() === "" || newCategory.trim() === "" || newImage.trim() === "") {
            setAppMessage("All fields are required");
        } else {
            const findExisting = items.filter((item) => item.name.toLowerCase().trim() === newName.toLowerCase().trim() && item.id !== props.targetItemId);
            if (findExisting.length > 0) {
                setAppMessage("Item name already exist");
            } else if (newPrice <= 0 || isNaN(newPrice)) {
                setAppMessage("Item price must be greater than zero");
            } else {
                if (props.targetItemId === "ADD") {
                    const newItem = {
                        id: uuid(),
                        name: newName,
                        price: newPrice,
                        category: newCategory,
                        image: newImage,
                    };
                    dispatch({ type: "ADD_ITEM", payload: newItem });
                } else {
                    const itemForUpdate = items.filter((item) => {
                        if (item.id === props.targetItemId) {
                            item.name = newName;
                            item.price = newPrice;
                            item.category = newCategory;
                            item.image = newImage;
                            return true;
                        }
                        return false;
                    });
                    dispatch({ type: "EDIT_ITEM", payload: itemForUpdate });
                }

                props.onSetFilteredBy("All Categories");
                setNewName("");
                setNewPrice("");
                setNewCategory("");
                setNewImage("");
                setAppMessage("");
                handleOpenModal(false, "");
            }
        }
    };

    const handleOpenModal = (flag, targetItemId) => {
        props.onOpenModal(flag, targetItemId);
    };

    /* Funtion to load target item info for update */
    const onModalShown = (targetItemId) => {
        if (targetItemId !== "ADD") {
            items.map((item) => {
                if (item.id === targetItemId) {
                    setNewName(item.name);
                    setNewPrice(item.price);
                    setNewCategory(item.category);
                    setNewImage(item.image);
                }
            });
        }
    };

    return (
        <Modal show={props.showModalFlag} onHide={() => handleOpenModal(false, "")} onShow={() => onModalShown(props.targetItemId)} keyboard={false}>
            <Modal.Header closeButton>
                <Modal.Title>{props.targetItemId === "ADD" ? "New Item" : "Edit Item"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p id="appmessage">{appMessage}</p>
                <Form.Group className="mb-3">
                    <Form.Label>Name*</Form.Label>
                    <Form.Control type="text" value={newName} onChange={(e) => handleOnInputChange(e, "newname")} />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Price*</Form.Label>
                    <Form.Control type="number" value={newPrice} onChange={(e) => handleOnInputChange(e, "newprice")} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Category*</Form.Label>
                    <Form.Control type="text" value={newCategory} onChange={(e) => handleOnInputChange(e, "newcategory")} />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Image*</Form.Label>
                    <Form.Control type="text" value={newImage} onChange={(e) => handleOnInputChange(e, "newimage")} />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer className="py-3">
                <Button className="myButton" onClick={() => handleAddItem()}>
                    <i className="fas fa-save" /> Save Item
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
export default ItemModal;
