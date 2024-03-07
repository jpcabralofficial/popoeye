import { useCallback, useEffect, useState } from 'react';
import { useFlow, FLOW_EVENT_CHECK_MEMBERSHIP } from '../../context/flow';
import { useDispatch, useSelector } from 'react-redux';
import { membershipSelector } from '../../common/redux/selector';
import {
  clearMembershipBarcode,
  clearMembershipType,
} from '../../common/redux/slices/membership/membership';

const useViewModel = () => {
  const dispatch = useDispatch();

  const membershipRedux = useSelector(membershipSelector);

  const [textMembershipID, setTextMembershipID] = useState<string>('');

  const [isMemberExistModal, setIsMemberExistModal] = useState<boolean>(false);
  const [isMemberExpiredModal, setIsMemberExpiredModal] =
    useState<boolean>(false);

  const { emitFlowEvent } = useFlow();

  const membershipType = membershipRedux.memberType;
  const membershipBarcode = membershipRedux.membershipBarcode;

  useEffect(() => {
    if (membershipBarcode) {
      const formattedID = formatMembershipID(membershipBarcode);
      setTextMembershipID(formattedID);
    }
  }, [membershipBarcode]);

  useEffect(() => {
    if (membershipType === 'not exist') {
      setIsMemberExistModal(true);
      dispatch(clearMembershipType());
      dispatch(clearMembershipBarcode());
    } else if (membershipType === 'expired') {
      setIsMemberExpiredModal(true);
      dispatch(clearMembershipType());
      dispatch(clearMembershipBarcode());
    }
  }, [membershipType, dispatch]);

  const formatMembershipID = (text: string) => {
    // Remove any non-numeric characters from the input
    const formattedText = text.replace(/\D/g, '');

    // Insert a space after every 4 characters
    let formattedID = '';
    for (let i = 0; i < formattedText.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedID += ' ';
      }
      formattedID += formattedText[i];
    }

    return formattedID;
  };

  const onCheckMembershipId = useCallback(() => {
    const membershipIdWithoutSpaces = textMembershipID.replace(/\s/g, '');

    emitFlowEvent(FLOW_EVENT_CHECK_MEMBERSHIP, {
      id: membershipIdWithoutSpaces,
    });
  }, [emitFlowEvent, textMembershipID]);

  const handleMembershipIDChange = (text: string) => {
    const formattedID = formatMembershipID(text);
    setTextMembershipID(formattedID);
  };

  const handleConfirmPress = () => {
    onCheckMembershipId();
  };

  const handleOnHideModal = () => {
    setTextMembershipID('');
    setIsMemberExistModal(false);
    setIsMemberExpiredModal(false);
    dispatch(clearMembershipType());
  };

  return {
    textMembershipID,

    isMemberExistModal,
    isMemberExpiredModal,
    handleOnHideModal,

    handleMembershipIDChange,
    handleConfirmPress,
  };
};

export default useViewModel;
