import React, { useCallback, useContext, useEffect, useRef } from "react";
import get from "lodash/get";
import { Context } from "./ModalContext";
import { Handler } from "./types";

const useModalRefetch = (
  modal: React.ReactNode,
  closeOnOverlayClick = true,
  updateOnPropsChange = false,
  modalId = "defaultNodeId",
  fetchCallback: (() => Promise<void>) | null = null
): [Handler, Handler] => {
  const { isOpen, nodeId, modalNode, setModalNode, onPresent, onDismiss } = useContext(Context);
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  const fetchData = async () => {
    if (fetchCallback) {
      await fetchCallback();
    }
  };

  useEffect(() => {
    if (isOpen && nodeId === modalId) {
      fetchData(); // Fetch data immediately when the modal opens
      intervalId.current = setInterval(fetchData, 15000); // Then fetch data every 15 seconds

      // Stop fetching after 3 minutes
      const timeoutId = setTimeout(() => {
        if (intervalId.current) clearInterval(intervalId.current);
      }, 180000);

      // Cleanup function
      return () => {
        if (intervalId.current) clearInterval(intervalId.current);
        clearTimeout(timeoutId);
      };
    }
  }, [isOpen, nodeId, modalId]); // Removed fetchCallback from dependencies

  const onPresentCallback = useCallback(() => {
    onPresent(modal, modalId, closeOnOverlayClick);
    // Clear previous interval when a new modal is presented
    if (intervalId.current) clearInterval(intervalId.current);
  }, [modal, modalId, onPresent, closeOnOverlayClick]);

  const onDismissCallback = useCallback(() => {
    onDismiss();
    // Clear interval when modal is dismissed
    if (intervalId.current) clearInterval(intervalId.current);
  }, [onDismiss]);

  // Updates the "modal" component if props are changed
  // Use carefully since it might result in unnecessary rerenders
  // Typically if modal is static there is no need for updates, use when you expect props to change
  useEffect(() => {
    // NodeId is needed in case there are 2 useModal hooks on the same page and one has updateOnPropsChange
    if (updateOnPropsChange && isOpen && nodeId === modalId) {
      const modalProps = get(modal, "props");
      const oldModalProps = get(modalNode, "props");
      // Note: I tried to use lodash isEqual to compare props but it is giving false-negatives too easily
      // For example ConfirmSwapModal in exchange has ~500 lines prop object that stringifies to same string
      // and online diff checker says both objects are identical but lodash isEqual thinks they are different
      // Do not try to replace JSON.stringify with isEqual, high risk of infinite rerenders
      // TODO: Find a good way to handle modal updates, this whole flow is just backwards-compatible workaround,
      // would be great to simplify the logic here
      if (modalProps && oldModalProps && JSON.stringify(modalProps) !== JSON.stringify(oldModalProps)) {
        setModalNode(modal);
      }
    }
  }, [updateOnPropsChange, nodeId, modalId, isOpen, modal, modalNode, setModalNode]);

  return [onPresentCallback, onDismissCallback];
};

export default useModalRefetch;