import React from 'react'

export const Modal = ({ ...props }) => {
    const overlayStyle = props.overlayStyle ? props.overlayStyle : {};
    const contentStyle = props.contentStyle ? props.contentStyle : {};
    const dialogStyle = props.dialogStyle ? props.dialogStyle : {};
    const onOverlayClick = () => props.onOverlayClick && props.onOverlayClick()
    const onDialogClick = (event) => event.stopPropagation()
    const modalOpened = props.isOpen
    return !modalOpened ? null : (
        <div>
            <div className="modal-overlay-div" style={overlayStyle} />
            <div className="modal-content-div" style={contentStyle} onClick={onOverlayClick}>
                <div className="modal-dialog-div" style={dialogStyle} onClick={onDialogClick}>
                    {props.children}
                </div>
            </div>
        </div>
    );
}